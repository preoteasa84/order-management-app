# Order Management App

Complete order management system with JWT authentication, user management, agent management, and database operations.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication with 7-day token expiry
- Password hashing with bcryptjs (10 salt rounds)
- Role-based access control (Admin, Office, Agent)
- Secure login/logout functionality

### 👥 User Management (Admin Only)
- Create, read, update, delete users
- User roles: Admin, Office
- User status management (active/inactive)
- Password management

### 🤝 Agent Management (Admin/Office)
- Complete CRUD operations for agents
- Commission rate tracking
- Client allocation to agents
- Agent status management

### 💾 Database Operations (Admin Only)
- Full database backup to JSON
- Database import from JSON
- Complete data export/import capability

### 📊 Core Features
- Client management
- Product management
- Order management
- All endpoints protected with JWT authentication

## Technology Stack

### Backend
- Node.js + Express.js
- SQLite database
- JWT authentication (jsonwebtoken)
- Password hashing (bcryptjs)
- RESTful API architecture

### Frontend
- React 19
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons

## Quick Start

### Prerequisites
- Node.js v14 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/preoteasa84/order-management-app.git
   cd order-management-app
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   node server.js
   ```
   Server will start on http://localhost:5000

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Frontend will start on http://localhost:5173

4. **Create Admin User**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin123","email":"admin@example.com","role":"admin"}'
   ```

5. **Login** at http://localhost:5173 with your admin credentials

## Documentation

- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference with examples
- **[Setup Guide](SETUP.md)** - Detailed setup and deployment instructions

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### User Management (Admin Only)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/status` - Update user status

### Agent Management (Admin/Office)
- `GET /api/agents` - List all agents
- `POST /api/agents` - Create agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent
- `GET /api/agents/:id/allocations` - Get agent allocations
- `POST /api/agents/:id/allocations` - Allocate client to agent
- `DELETE /api/agents/:id/allocations/:allocationId` - Remove allocation

### Database Operations (Admin Only)
- `POST /api/database/backup` - Backup database to JSON
- `POST /api/database/import` - Import database from JSON

### Protected Endpoints (All authenticated users)
- `GET /api/clients` - List clients
- `POST /api/clients` - Create client
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/orders` - List orders
- `POST /api/orders` - Create order

## Security Features

✅ Passwords hashed with bcryptjs (10 salt rounds)  
✅ JWT tokens with 7-day expiry  
✅ Role-based access control  
✅ Protected API endpoints  
✅ Input validation  
✅ Foreign key constraints  
⚠️ Rate limiting not implemented (future enhancement)

## Database Schema

### Users
- Authentication and authorization
- Roles: admin, office
- Status: active, inactive

### Agents
- Agent information
- Commission rates
- Status management
- Office user association

### ClientAllocations
- Client-to-agent assignments
- Allocation tracking

### Orders, Clients, Products
- Core business entities
- Agent relationships

## Project Structure

```
order-management-app/
├── server/                    # Backend (Node.js + Express)
│   ├── config/               # Configuration (database, JWT)
│   ├── middleware/           # Auth & role middleware
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── migrations/           # Database migrations
│   └── server.js            # Main server file
│
├── frontend/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── utils/           # Auth utilities
│   │   ├── App.jsx          # Main component
│   │   └── main.jsx         # Entry point
│   └── package.json
│
├── API_DOCUMENTATION.md       # Complete API docs
├── SETUP.md                  # Setup guide
└── README.md                 # This file
```

## Development

### Running in Development
```bash
# Backend
cd server
node server.js

# Frontend
cd frontend
npm run dev
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build
```

### Database Reset
```bash
cd server
rm orders.db
node server.js  # Will recreate with migrations
```

## Testing

### Test Authentication
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Use token for authenticated requests
curl -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/users
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License Here]

## Support

For detailed information:
- See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- See [SETUP.md](SETUP.md) for setup instructions
- Check server logs for backend issues
- Check browser console for frontend issues
