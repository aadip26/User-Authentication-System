# CSTech MERN Stack Application

A complete MERN stack application for agent management and CSV distribution system.

## Features

### 🔐 Admin Authentication
- Secure login system with JWT tokens
- Password hashing with bcrypt
- Protected routes and middleware

### 👥 Agent Management
- Add, view, edit, and delete agents
- Agent details: Name, Email, Mobile Number, Password
- Soft delete functionality
- Form validation and error handling

### 📊 CSV Upload & Distribution
- Upload CSV, XLSX, and XLS files
- File validation (size limit: 10MB)
- Automatic distribution among 5 agents
- Equal distribution with remainder handling
- Real-time upload progress

### 📋 Distribution Management
- View all distribution history
- Detailed view of each distribution
- Agent-wise item assignment
- Export and tracking capabilities

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **csv-parser** - CSV parsing
- **xlsx** - Excel file parsing

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (v4.4 or higher)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CSTech-project
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```bash
cp env.example .env
```

Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/cstech_mern_app

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 5. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

## Running the Application

### Development Mode

#### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

#### Option 2: Run Both Together
```bash
# Install concurrently for running both servers
npm install -g concurrently

# Run both backend and frontend
npm run dev & npm run client
```

### Production Mode
```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

## Application URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/api

## Default Admin Credentials

For testing purposes, you can register a new admin user or use these demo credentials:

```
Email: admin@cstech.com
Password: admin123
```

**Note:** You need to register the admin user first using the `/api/auth/register` endpoint.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

### Agent Management
- `GET /api/agents` - Get all agents
- `GET /api/agents/:id` - Get single agent
- `POST /api/agents` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### CSV Management
- `POST /api/csv/upload` - Upload CSV file
- `GET /api/csv/distributions` - Get all distributions
- `GET /api/csv/distributions/:id` - Get single distribution
- `GET /api/csv/agent/:agentId` - Get distributions for agent

## CSV File Format

The application accepts CSV, XLSX, and XLS files with the following required columns:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| FirstName | Text | Yes | Contact's first name |
| Phone | Number | Yes | Contact's phone number |
| Notes | Text | No | Additional notes |

### Example CSV Format:
```csv
FirstName,Phone,Notes
John Doe,+1234567890,Important client
Jane Smith,+0987654321,Follow up needed
```

## Distribution Logic

The application automatically distributes CSV items among agents:

1. **Equal Distribution:** Items are divided equally among all active agents
2. **Remainder Handling:** If items can't be divided equally, remaining items are distributed sequentially
3. **Example:** 25 items among 5 agents = 5 items per agent
4. **Example:** 23 items among 5 agents = 4 agents get 5 items, 1 agent gets 3 items

## Project Structure

```
CSTech-project/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/      # React contexts
│   │   └── App.tsx       # Main App component
│   └── package.json
├── models/                # MongoDB models
│   ├── User.js
│   ├── Agent.js
│   └── CSVDistribution.js
├── routes/                # Express routes
│   ├── auth.js
│   ├── agents.js
│   └── csv.js
├── middleware/            # Express middleware
│   └── auth.js
├── uploads/               # File upload directory
├── server.js             # Main server file
├── package.json
└── README.md
```

## Features in Detail

### 🔒 Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- File upload security

### 📱 Responsive Design
- Mobile-first approach
- Modern UI with clean design
- Intuitive navigation
- Loading states and error handling

### 🚀 Performance
- Efficient database queries
- Optimized file processing
- Client-side routing
- Lazy loading components

### 🛠️ Error Handling
- Comprehensive error messages
- Form validation
- File upload validation
- Network error handling

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify MongoDB port (default: 27017)

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes on ports 3000/5000

3. **File Upload Issues**
   - Check file size (max 10MB)
   - Verify file format (CSV, XLSX, XLS)
   - Ensure uploads directory exists

4. **Authentication Issues**
   - Verify JWT_SECRET in `.env`
   - Check token expiration
   - Clear browser storage

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team

## Demo Video

A working demonstration video will be provided showing:
- Admin login process
- Agent management functionality
- CSV upload and distribution
- Viewing distribution results

---

**Built with ❤️ using the MERN Stack**

