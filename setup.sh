#!/bin/bash

# CSTech MERN Stack Application Setup Script

echo "🚀 Setting up CSTech MERN Stack Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   On macOS: brew services start mongodb-community"
    echo "   On Ubuntu: sudo systemctl start mongod"
    echo "   On Windows: net start MongoDB"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

echo "✅ Setup completed successfully!"
echo ""
echo "🔧 Next steps:"
echo "1. Update the .env file with your MongoDB connection string"
echo "2. Start the backend: npm run dev"
echo "3. Start the frontend: npm run client"
echo "4. Register an admin user using the API endpoint: POST /api/auth/register"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5000"
echo ""
echo "📚 For detailed instructions, see README.md"

