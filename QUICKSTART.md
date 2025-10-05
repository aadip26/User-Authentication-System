# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js (v14+)
- MongoDB running locally
- Terminal/Command Prompt

### 1. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client && npm install && cd ..
```

### 2. Setup Environment
```bash
# Copy environment file
cp env.example .env

# Edit .env file with your MongoDB connection
# Default: mongodb://localhost:27017/cstech_mern_app
```

### 3. Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 4. Create Admin User
```bash
npm run create-admin
```

### 5. Start the Application
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
npm run client
```

### 6. Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### 7. Login
- Email: `admin@cstech.com`
- Password: `admin123`

## 🎯 Test the Features

### 1. Add Agents
- Go to "Agent Management"
- Click "Add New Agent"
- Fill in agent details
- Save agent

### 2. Upload CSV
- Go to "CSV Upload"
- Select the sample CSV file (`sample_data.csv`)
- Click "Upload & Distribute"
- View distribution results

### 3. View Distributions
- Go to "View Distributions"
- See all uploaded files and their distributions
- Click "View Details" for detailed breakdown

## 📁 Sample Data
Use the included `sample_data.csv` file to test the CSV upload functionality.

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
pgrep mongod

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
net start MongoDB                      # Windows
```

### Port Issues
- Backend runs on port 5000
- Frontend runs on port 3000
- Change ports in `.env` if needed

### File Upload Issues
- Max file size: 10MB
- Supported formats: CSV, XLSX, XLS
- Check `uploads/` directory exists

## 📞 Support
- Check the full README.md for detailed documentation
- Review error messages in browser console
- Check server logs in terminal

---

**Happy Coding! 🎉**
