const express = require('express');
const { body, validationResult } = require('express-validator');
const Agent = require('../models/Agent');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all agents
router.get('/', authenticateToken, async (req, res) => {
  try {
    const agents = await Agent.find({ isActive: true }).select('-password');
    res.json({ agents });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single agent
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-password');
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json({ agent });
  } catch (error) {
    console.error('Get agent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new agent
router.post('/', authenticateToken, [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('mobileNumber').trim().isLength({ min: 10 }).withMessage('Valid mobile number required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, mobileNumber, password } = req.body;

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ message: 'Agent with this email already exists' });
    }

    // Create new agent
    const agent = new Agent({ name, email, mobileNumber, password });
    await agent.save();

    // Return agent without password
    const agentResponse = await Agent.findById(agent._id).select('-password');
    
    res.status(201).json({
      message: 'Agent created successfully',
      agent: agentResponse
    });
  } catch (error) {
    console.error('Create agent error:', error);
    res.status(500).json({ message: 'Server error during agent creation' });
  }
});

// Update agent
router.put('/:id', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('mobileNumber').optional().trim().isLength({ min: 10 }),
  body('password').optional().isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { name, email, mobileNumber, password } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (password) updateData.password = password;

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({
      message: 'Agent updated successfully',
      agent
    });
  } catch (error) {
    console.error('Update agent error:', error);
    res.status(500).json({ message: 'Server error during agent update' });
  }
});

// Delete agent (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Delete agent error:', error);
    res.status(500).json({ message: 'Server error during agent deletion' });
  }
});

module.exports = router;