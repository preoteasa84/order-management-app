# Order Management App - API Documentation

## Overview

This application provides a complete backend API for order management with JWT authentication, user management, agent management, and database operations.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All endpoints except `/auth/login` and `/auth/register` require authentication.

### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active"
  }
}
```

### Register
**POST** `/auth/register`

Request:
```json
{
  "username": "newuser",
  "password": "password123",
  "email": "user@example.com",
  "role": "office"
}
```

Response:
```json
{
  "message": "User created successfully",
  "user": {
    "id": 2,
    "username": "newuser",
    "email": "user@example.com",
    "role": "office",
    "status": "active"
  }
}
```

### Logout
**POST** `/auth/logout`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "message": "Logged out successfully"
}
```

### Get Current User
**GET** `/auth/me`

Headers: `Authorization: Bearer <token>`

Response:
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "status": "active"
}
```

## User Management (Admin Only)

### List All Users
**GET** `/users`

Headers: `Authorization: Bearer <token>` (Admin only)

Response:
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "status": "active",
    "created_at": "2026-01-28 12:32:18",
    "updated_at": "2026-01-28 12:32:18"
  }
]
```

### Get User by ID
**GET** `/users/:id`

### Create User
**POST** `/users`

Request:
```json
{
  "username": "officeuser",
  "password": "password123",
  "email": "office@example.com",
  "role": "office",
  "status": "active"
}
```

### Update User
**PUT** `/users/:id`

Request:
```json
{
  "username": "officeuser",
  "email": "newemail@example.com",
  "role": "office",
  "status": "active",
  "password": "newpassword123"
}
```

### Update User Status
**PATCH** `/users/:id/status`

Request:
```json
{
  "status": "inactive"
}
```

### Delete User
**DELETE** `/users/:id`

Response:
```json
{
  "message": "User deleted successfully"
}
```

## Agent Management (Admin/Office)

### List All Agents
**GET** `/agents`

Headers: `Authorization: Bearer <token>` (Admin or Office)

Response:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "commission_rate": 0.05,
    "status": "active",
    "office_user_id": 1,
    "created_at": "2026-01-28 12:32:39",
    "updated_at": "2026-01-28 12:32:39"
  }
]
```

### Get Agent by ID
**GET** `/agents/:id`

### Create Agent
**POST** `/agents`

Request:
```json
{
  "name": "Jane Smith",
  "commission_rate": 0.08,
  "status": "active",
  "office_user_id": 1
}
```

### Update Agent
**PUT** `/agents/:id`

Request:
```json
{
  "name": "Jane Smith Updated",
  "commission_rate": 0.10,
  "status": "active",
  "office_user_id": 1
}
```

### Delete Agent
**DELETE** `/agents/:id`

### Get Agent Allocations
**GET** `/agents/:id/allocations`

Response:
```json
[
  {
    "id": 1,
    "client_id": "client001",
    "agent_id": 1,
    "allocated_at": "2026-01-28 12:32:39"
  }
]
```

### Allocate Client to Agent
**POST** `/agents/:id/allocations`

Request:
```json
{
  "client_id": "client001"
}
```

### Remove Client Allocation
**DELETE** `/agents/:id/allocations/:allocationId`

## Database Operations (Admin Only)

### Backup Database
**POST** `/database/backup`

Headers: `Authorization: Bearer <token>` (Admin only)

Response: Full database export in JSON format
```json
{
  "_metadata": {
    "exportDate": "2026-01-28T12:32:49.572Z",
    "version": "1.0",
    "tables": ["users", "agents", "client_allocations", "clients", "products", "orders"]
  },
  "users": [...],
  "agents": [...],
  "client_allocations": [...],
  "clients": [...],
  "products": [...],
  "orders": [...]
}
```

### Import Database
**POST** `/database/import`

Headers: `Authorization: Bearer <token>` (Admin only)

Request: Same format as backup response

Response:
```json
{
  "message": "Database imported successfully",
  "importedTables": ["users", "agents", "client_allocations", "clients", "products", "orders"]
}
```

## Protected Endpoints

All these endpoints now require authentication:

### Clients
- **GET** `/clients` - List all clients
- **GET** `/clients/:id` - Get client by ID
- **POST** `/clients` - Create client
- **PUT** `/clients/:id` - Update client
- **DELETE** `/clients/:id` - Delete client

### Products
- **GET** `/products` - List all products
- **GET** `/products/:id` - Get product by ID
- **POST** `/products` - Create product
- **PUT** `/products/:id` - Update product
- **DELETE** `/products/:id` - Delete product

### Orders
- **GET** `/orders` - List all orders
- **POST** `/orders` - Create order
- **PUT** `/orders/:id` - Update order
- **DELETE** `/orders/:id` - Delete order

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden. You do not have permission to access this resource.",
  "requiredRoles": ["admin"],
  "userRole": "office"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 409 Conflict
```json
{
  "error": "Username already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Role-Based Access Control

| Endpoint | Admin | Office | Agent |
|----------|-------|--------|-------|
| Auth endpoints | ✅ | ✅ | ✅ |
| User management | ✅ | ❌ | ❌ |
| Agent management | ✅ | ✅ | ❌ |
| Database backup/import | ✅ | ❌ | ❌ |
| Clients/Products/Orders | ✅ | ✅ | ❌* |

*Agent access can be implemented based on allocations in future updates

## Security Features

- ✅ JWT tokens with 7-day expiry
- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ Role-based access control
- ✅ Input validation
- ✅ Foreign key constraints
- ⚠️ Rate limiting not implemented (future enhancement)

## Environment Variables

```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secret-key-change-this-in-production
```

## Testing the API

### Using cURL

1. Register a user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","email":"admin@example.com","role":"admin"}'
```

2. Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

3. Use the token for authenticated requests:
```bash
TOKEN="your-jwt-token-here"
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/users
```

## Frontend Integration

The frontend includes:
- Login screen with JWT authentication
- Automatic token storage in localStorage
- Token inclusion in all API requests
- 401 handling with automatic logout

See `frontend/src/utils/auth.js` for the authentication utility functions.
