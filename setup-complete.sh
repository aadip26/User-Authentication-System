#!/bin/bash

# CSTech MERN Stack Application - Complete Setup Script

echo "🚀 CSTech MERN Stack Application Setup"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Node.js found: $(node --version)"

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    print_warning "MongoDB is not running. Starting MongoDB..."
    brew services start mongodb/brew/mongodb-community
    sleep 3
fi

print_status "MongoDB is running"

# Install backend dependencies
print_info "Installing backend dependencies..."
npm install

# Install frontend dependencies
print_info "Installing frontend dependencies..."
cd client
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating .env file..."
    cp env.example .env
    print_status ".env file created"
else
    print_status ".env file already exists"
fi

# Create uploads directory
print_info "Creating uploads directory..."
mkdir -p uploads

# Create admin user
print_info "Creating admin user..."
node scripts/createAdmin.js

print_status "Setup completed successfully!"
echo ""
echo "🎯 Next Steps:"
echo "=============="
echo "1. Backend Server:"
echo "   Run: npm run dev"
echo "   URL: http://localhost:5001"
echo ""
echo "2. Frontend Server:"
echo "   Run: cd client && npm start"
echo "   URL: http://localhost:3000"
echo ""
echo "3. Login Credentials:"
echo "   Email: admin@cstech.com"
echo "   Password: admin123"
echo ""
echo "4. Test CSV File:"
echo "   Use: sample_contacts.csv (26 contacts included)"
echo ""
echo "🌐 Application URLs:"
echo "==================="
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5001"
echo "API Docs: http://localhost:5001/api"
echo ""
echo "📚 For detailed instructions, see README.md"
echo ""
print_status "Happy Coding! 🎉"
