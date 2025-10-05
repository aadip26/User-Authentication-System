const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { authenticateToken } = require('../middleware/auth');
const Agent = require('../models/Agent');
const CSVDistribution = require('../models/CSVDistribution');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.csv', '.xlsx', '.xls'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV, XLSX, and XLS files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Function to parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Validate required fields
        if (data.FirstName && data.Phone) {
          results.push({
            firstName: data.FirstName.trim(),
            phone: data.Phone.trim(),
            notes: data.Notes ? data.Notes.trim() : ''
          });
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Function to parse Excel file
const parseExcel = (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    return data.map(row => ({
      firstName: row.FirstName ? row.FirstName.toString().trim() : '',
      phone: row.Phone ? row.Phone.toString().trim() : '',
      notes: row.Notes ? row.Notes.toString().trim() : ''
    })).filter(item => item.firstName && item.phone);
  } catch (error) {
    throw new Error('Error parsing Excel file: ' + error.message);
  }
};

// Function to distribute items equally among agents
const distributeItems = (items, agents) => {
  const distributions = [];
  const itemsPerAgent = Math.floor(items.length / agents.length);
  const remainingItems = items.length % agents.length;
  
  let itemIndex = 0;
  
  agents.forEach((agent, agentIndex) => {
    const agentItemCount = itemsPerAgent + (agentIndex < remainingItems ? 1 : 0);
    const agentItems = items.slice(itemIndex, itemIndex + agentItemCount);
    
    distributions.push({
      agent: agent._id,
      items: agentItems,
      itemCount: agentItems.length
    });
    
    itemIndex += agentItemCount;
  });
  
  return distributions;
};

// Upload and distribute CSV
router.post('/upload', authenticateToken, upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    let items = [];
    
    // Parse file based on extension
    if (fileExt === '.csv') {
      items = await parseCSV(filePath);
    } else if (fileExt === '.xlsx' || fileExt === '.xls') {
      items = await parseExcel(filePath);
    } else {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Unsupported file format' });
    }

    if (items.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No valid data found in file' });
    }

    // Get all active agents
    const agents = await Agent.find({ isActive: true });
    
    if (agents.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No active agents found. Please add agents first.' });
    }

    // Distribute items among agents
    const distributions = distributeItems(items, agents);

    // Create CSV distribution record
    const csvDistribution = new CSVDistribution({
      fileName: req.file.originalname,
      totalItems: items.length,
      uploadedBy: req.user._id,
      distributions: distributions,
      status: 'completed'
    });

    await csvDistribution.save();

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Populate agent details in response
    await csvDistribution.populate('distributions.agent', 'name email mobileNumber');

    res.status(201).json({
      message: 'CSV uploaded and distributed successfully',
      distribution: csvDistribution
    });

  } catch (error) {
    console.error('CSV upload error:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Server error during CSV upload',
      error: error.message 
    });
  }
});

// Get all CSV distributions
router.get('/distributions', authenticateToken, async (req, res) => {
  try {
    const distributions = await CSVDistribution.find()
      .populate('uploadedBy', 'email')
      .populate('distributions.agent', 'name email mobileNumber')
      .sort({ createdAt: -1 });

    res.json({ distributions });
  } catch (error) {
    console.error('Get distributions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single CSV distribution
router.get('/distributions/:id', authenticateToken, async (req, res) => {
  try {
    const distribution = await CSVDistribution.findById(req.params.id)
      .populate('uploadedBy', 'email')
      .populate('distributions.agent', 'name email mobileNumber');

    if (!distribution) {
      return res.status(404).json({ message: 'Distribution not found' });
    }

    res.json({ distribution });
  } catch (error) {
    console.error('Get distribution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get distributions for a specific agent
router.get('/agent/:agentId', authenticateToken, async (req, res) => {
  try {
    const distributions = await CSVDistribution.find({
      'distributions.agent': req.params.agentId
    })
    .populate('uploadedBy', 'email')
    .populate('distributions.agent', 'name email mobileNumber')
    .sort({ createdAt: -1 });

    res.json({ distributions });
  } catch (error) {
    console.error('Get agent distributions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;