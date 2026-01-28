# Order Management App - Setup Guide

## Overview

This application provides a complete order management system with JWT authentication, user management, agent management, and database operations.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/preoteasa84/order-management-app.git
cd order-management-app
```

### 2. Backend Setup

```bash
cd server
npm install
```

#### Configure Environment Variables

Create or update `.env` file in the `server` directory:

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secure-random-secret-key-change-this
```

**Important**: Change the `JWT_SECRET` to a secure random string in production.

#### Start the Backend Server

```bash
node server.js
```

The server will start on `http://localhost:5000` and automatically:
- Create the SQLite database (`orders.db`)
- Run migrations to create tables
- Initialize the database schema

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

#### Configure API URL

The frontend automatically connects to `http://localhost:5000` in development. To change this, create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

#### Start the Frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy).

#### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## First Time Setup

### Create an Admin User

You need to create an admin user before you can use the application. You can do this via API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "email": "admin@example.com",
    "role": "admin"
  }'
```

Or use the register form in the frontend (if available).

### Login

1. Open the frontend in your browser: `http://localhost:5173`
2. Login with the credentials you created:
   - Username: `admin`
   - Password: `admin123`

## Application Structure

```
order-management-app/
├── server/                    # Backend (Node.js + Express)
│   ├── config/               # Configuration files
│   │   ├── database.js       # Database connection
│   │   └── jwt.js           # JWT configuration
│   ├── middleware/           # Express middleware
│   │   ├── auth.js          # JWT authentication
│   │   └── roles.js         # Role-based access control
│   ├── models/               # Database models
│   │   ├── User.js          # User model
│   │   ├── Agent.js         # Agent model
│   │   └── ClientAllocation.js
│   ├── routes/               # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── users.js         # User management routes
│   │   ├── agents.js        # Agent management routes
│   │   └── database.js      # Database backup/import
│   ├── migrations/           # Database migrations
│   │   └── init.sql         # Initial schema
│   ├── server.js            # Main server file
│   ├── orders.db            # SQLite database (created automatically)
│   └── package.json
│
├── frontend/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── utils/
│   │   │   └── auth.js      # Authentication utilities
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   └── package.json
│
├── API_DOCUMENTATION.md       # Complete API documentation
└── README.md                  # This file
```

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `password` - Hashed password (bcrypt)
- `email` - Email address
- `role` - User role (admin, office)
- `status` - Account status (active, inactive)
- `created_at`, `updated_at` - Timestamps

### Agents Table
- `id` - Primary key
- `name` - Agent name
- `commission_rate` - Commission rate (decimal)
- `status` - Agent status (active, inactive)
- `office_user_id` - Foreign key to Users table
- `created_at`, `updated_at` - Timestamps

### ClientAllocations Table
- `id` - Primary key
- `client_id` - Client identifier
- `agent_id` - Foreign key to Agents table
- `allocated_at` - Allocation timestamp

### Orders Table (existing + updated)
- Existing fields
- `agent_id` - Foreign key to Agents table (new)

## User Roles

### Admin
- Full access to all features
- User management (create, update, delete users)
- Agent management
- Database backup/import
- All data access

### Office
- Agent management
- Client/product/order management
- No user management
- No database operations

### Agent
- View own assigned clients and orders
- Limited access (to be implemented in frontend)

## API Usage

### Authentication Flow

1. **Register** (first time only):
   ```bash
   POST /api/auth/register
   ```

2. **Login**:
   ```bash
   POST /api/auth/login
   ```
   Response includes JWT token.

3. **Use Token** in all subsequent requests:
   ```
   Authorization: Bearer <token>
   ```

### Common Operations

#### Create an Office User (Admin only)
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "office1",
    "password": "office123",
    "email": "office@example.com",
    "role": "office"
  }'
```

#### Create an Agent
```bash
curl -X POST http://localhost:5000/api/agents \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "commission_rate": 0.05,
    "status": "active",
    "office_user_id": 1
  }'
```

#### Allocate Client to Agent
```bash
curl -X POST http://localhost:5000/api/agents/1/allocations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"client_id": "client001"}'
```

#### Backup Database
```bash
curl -X POST http://localhost:5000/api/database/backup \
  -H "Authorization: Bearer $TOKEN" \
  > backup.json
```

#### Import Database
```bash
curl -X POST http://localhost:5000/api/database/import \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d @backup.json
```

## Security

### Password Security
- Passwords are hashed using bcryptjs with 10 salt rounds
- Never stored in plain text

### JWT Tokens
- Tokens expire after 7 days
- Store securely (localStorage in frontend)
- Include in Authorization header for all protected routes

### Role-Based Access
- Routes are protected by role middleware
- Unauthorized access returns 403 Forbidden

### Best Practices
1. Change the default `JWT_SECRET` in production
2. Use HTTPS in production
3. Regularly backup the database
4. Update passwords periodically
5. Disable or delete inactive users

## Troubleshooting

### Backend Won't Start
- Check if port 5000 is available
- Verify Node.js version (v14+)
- Check database file permissions

### Authentication Fails
- Verify JWT_SECRET is set correctly
- Check token expiration (7 days)
- Clear localStorage and login again

### Database Issues
- Delete `orders.db` to reset database
- Migrations will run automatically on restart
- You'll need to recreate users

### Frontend Can't Connect
- Verify backend is running on port 5000
- Check CORS settings
- Verify API_URL in frontend .env

## Development

### Running Tests
```bash
# Backend
cd server
npm test

# Frontend
cd frontend
npm test
```

### Database Migrations
The database is automatically initialized on first run. To reset:
```bash
cd server
rm orders.db
node server.js
```

### Adding New Routes
1. Create route file in `server/routes/`
2. Import in `server.js`
3. Mount with `app.use()`
4. Add authentication middleware if needed

## Production Deployment

### Backend
1. Set environment variables:
   ```env
   NODE_ENV=production
   JWT_SECRET=<secure-random-string>
   PORT=5000
   ```

2. Use a process manager:
   ```bash
   npm install -g pm2
   pm2 start server.js --name order-api
   ```

### Frontend
1. Build the frontend:
   ```bash
   npm run build
   ```

2. Serve static files using nginx or similar

### Database Backup
Schedule regular backups using the backup API endpoint:
```bash
# Add to crontab
0 2 * * * curl -X POST http://localhost:5000/api/database/backup \
  -H "Authorization: Bearer $TOKEN" \
  > /backups/db-$(date +\%Y\%m\%d).json
```

## Support

For issues or questions:
1. Check API_DOCUMENTATION.md for API details
2. Review this SETUP.md for configuration
3. Check the browser console for frontend errors
4. Check server logs for backend errors

## License

[Your License Here]
