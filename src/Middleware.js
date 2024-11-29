const jwt = require('jsonwebtoken');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, '../.env') });
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET; 

//JWT token authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  });
};

//Admin Authentication

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); 
    req.user = decoded; // Populate req.user with the token payload
    if (req.user.role !== 'Admin') {
      console.log(decoded)
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {authenticateToken, verifyAdmin};