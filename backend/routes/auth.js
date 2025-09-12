const express = require('express');
const router = express.Router();

// DIAGNOSTIC: Log requests reaching the auth router
router.use((req, res, next) => {
  console.log(`[DIAGNOSTIC AUTH] Request received by auth router: ${req.method} ${req.originalUrl}`);
  next();
});

const { 
  registerUser, 
  loginUser, 
  refreshToken, 
  authenticateToken,
  validatePassword,
  validateEmail,
  validateUsername 
} = require('../middleware/auth');
const { logPerformance } = require('../middleware/logging');

// User registration
router.post('/register', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { username, email, password, role = 'student' } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Username, email, and password are required'
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Validate username format
    if (!validateUsername(username)) {
      return res.status(400).json({
        error: 'Invalid username format',
        message: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores'
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password requirements not met',
        details: passwordValidation.errors
      });
    }

    // Validate role
    const allowedRoles = ['student', 'staff', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error: 'Invalid role',
        message: 'Role must be one of: student, staff, admin'
      });
    }

    // Register user
    const result = await registerUser({ username, email, password, role });
    
    const duration = Date.now() - startTime;
    logPerformance('user_registration', duration, { username, role });

    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token,
      refreshToken: result.refreshToken
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logPerformance('user_registration_error', duration, { error: error.message });

    if (error.message === 'Username already exists' || error.message === 'Email already exists') {
      return res.status(409).json({
        error: 'User already exists',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
});

// User login
router.post('/login', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Username and password are required'
      });
    }

    // Login user
    const result = await loginUser({ username, password });
    
    const duration = Date.now() - startTime;
    logPerformance('user_login', duration, { username });

    res.json({
      message: 'Login successful',
      user: result.user,
      token: result.token,
      refreshToken: result.refreshToken
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logPerformance('user_login_error', duration, { error: error.message });

    if (error.message === 'Invalid credentials') {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password'
      });
    }

    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Missing refresh token',
        message: 'Refresh token is required'
      });
    }

    const result = await refreshToken(token);
    
    const duration = Date.now() - startTime;
    logPerformance('token_refresh', duration);

    res.json({
      message: 'Token refreshed successfully',
      token: result.token,
      refreshToken: result.refreshToken
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    logPerformance('token_refresh_error', duration, { error: error.message });

    res.status(401).json({
      error: 'Token refresh failed',
      message: 'Invalid or expired refresh token'
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      message: 'Profile retrieved successfully',
      user: req.user
    });
  } catch (error) {
    res.status(500).json({
      error: 'Profile retrieval failed',
      message: 'An error occurred while retrieving profile'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // by removing the token from storage
  res.json({
    message: 'Logout successful',
    note: 'Please remove the token from client storage'
  });
});

// Password strength checker (public endpoint)
router.post('/check-password', (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        error: 'Password required',
        message: 'Please provide a password to check'
      });
    }

    const validation = validatePassword(password);
    
    res.json({
      isValid: validation.isValid,
      errors: validation.errors,
      strength: validation.isValid ? 'strong' : 'weak'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Password check failed',
      message: 'An error occurred while checking password'
    });
  }
});

// Username availability check
router.post('/check-username', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        error: 'Username required',
        message: 'Please provide a username to check'
      });
    }

    // Validate username format
    if (!validateUsername(username)) {
      return res.json({
        available: false,
        message: 'Username format is invalid'
      });
    }

    // Check if username exists (you'll need to import User from database)
    const { User } = require('../database/database');
    const existingUser = await User.findByUsername(username);
    
    res.json({
      available: !existingUser,
      message: existingUser ? 'Username is already taken' : 'Username is available'
    });

  } catch (error) {
    res.status(500).json({
      error: 'Username check failed',
      message: 'An error occurred while checking username'
    });
  }
});

module.exports = router;


