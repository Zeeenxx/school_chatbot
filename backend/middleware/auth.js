const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../database/database');

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ 
      error: 'Access denied',
      message: 'No token provided' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: 'Invalid token',
        message: 'Token is invalid or expired' 
      });
    }
    
    req.user = user;
    next();
  });
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
};

// Role-based authorization
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Access denied',
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Password hashing
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Password verification
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      type: 'refresh' 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// User registration
const registerUser = async (userData) => {
  try {
    const { username, email, password, role = 'student' } = userData;

    // Check if user already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      throw new Error('Email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash,
      role
    });

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token,
      refreshToken
    };
  } catch (error) {
    throw error;
  }
};

// User login
const loginUser = async (credentials) => {
  try {
    const { username, password } = credentials;

    // Find user
    const user = await User.findByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token,
      refreshToken
    };
  } catch (error) {
    throw error;
  }
};

// Refresh token
const refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    const user = await User.findByUsername(decoded.username);
    if (!user) {
      throw new Error('User not found');
    }

    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);

    return {
      token: newToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    throw error;
  }
};

// Password validation
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Username validation
const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

module.exports = {
  authenticateToken,
  optionalAuth,
  authorize,
  hashPassword,
  verifyPassword,
  generateToken,
  generateRefreshToken,
  registerUser,
  loginUser,
  refreshToken,
  validatePassword,
  validateEmail,
  validateUsername
};


