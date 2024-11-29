# Restaurant Management System - Backend

This is the backend service for the **Restaurant Management System**, providing APIs for user authentication, food item management, and role-based access control. The system supports Admin and Manager roles for enhanced security and functionality.

---

## Features

- **JWT Authentication**: Secure user authentication using JSON Web Tokens (JWT).
- **Role-Based Access Control**: Different APIs are accessible based on roles (`Admin`, `Manager`, and `Customer`).
- **CRUD Operations**: Manage food items, user roles, and reservations.
- **Error Handling**: Detailed error responses for better debugging.
- **Secure Endpoints**: Ensure that only authorized users can perform sensitive operations.

---

## Technologies Used

- **Node.js**: Runtime environment.
- **Express.js**: Framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing data.
- **Mongoose**: ODM for MongoDB.
- **JWT**: Secure token-based authentication.
- **dotenv**: Manage environment variables.

---

## Getting Started

### Prerequisites

- Node.js installed (v14 or later)
- MongoDB installed and running
- A `.env` file with the following variables:

````bash
ACCESS_TOKEN_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
PORT=3000

## Installation

### Clone the repository:
```bash
git clone https://github.com/yourusername/restaurant-backend.git
cd restaurant-backend

### Install dependencies:
```bash
npm install

### Run in development mode
```bash
npm run dev

### Install dependencies:
```bash
npm install

# API Endpoints

## Authentication
- **POST** `/api/auth/register`
  Register a new user.

- **POST** `/api/auth/login`
  Authenticate a user and return a JWT token.

---

## User Management
- **PUT** `/api/users/:userId`
  Update a user's role (Admin/Manager-only).

---

## Food Management
- **POST** `/api/food`
  Add a new food item (Admin/Manager-only).

- **DELETE** `/api/food/:id`
  Delete a food item (Admin/Manager-only).

---

## Table Reservations
- **GET** `/api/table`
  Retrieve all reservations.

---

## Role-Based Access Control
### Roles in the system:
- **Admin**: Full access to all APIs.
- **Manager**: Limited access to food management APIs.
- **Customer**: Basic access to view data.

### Middleware:
- `authenticateToken`: Verifies the JWT token.
- `verifyAdmin`: Ensures only Admins can access specific routes.
- `verifyAdminOrManager`: Allows Admin and Manager roles to access certain APIs.

## Swagger API Documentation

1. Start the server.
2. Open your browser and navigate to:
   ```bash
   http://localhost:3000/api-docs
````
