// Input validation middleware for security
const validator = require('validator');

// Sanitize and validate user input
const sanitizeInput = (req, res, next) => {
  if (req.body && req.body.message) {
    // Remove potentially dangerous characters
    req.body.message = req.body.message
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
    
    // Limit message length
    if (req.body.message.length > 1000) {
      req.body.message = req.body.message.substring(0, 1000);
    }
  }
  
  next();
};

// Validate message content
const validateMessage = (req, res, next) => {
  if (!req.body || !req.body.message) {
    return res.status(400).json({
      error: 'Message is required',
      text: 'Please provide a message to continue the conversation.'
    });
  }

  if (typeof req.body.message !== 'string') {
    return res.status(400).json({
      error: 'Invalid message format',
      text: 'Message must be a text string.'
    });
  }

  if (req.body.message.length === 0) {
    return res.status(400).json({
      error: 'Empty message',
      text: 'Please enter a message to continue.'
    });
  }

  next();
};

// Rate limiting (simple implementation)
const rateLimitMap = new Map();

const rateLimit = (windowMs = 60000, maxRequests = 10) => {
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [key, value] of rateLimitMap.entries()) {
      if (value < windowStart) {
        rateLimitMap.delete(key);
      }
    }

    // Check current requests
    const requests = rateLimitMap.get(clientId) || [];
    const recentRequests = requests.filter(time => time > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        text: 'Please wait a moment before sending another message.'
      });
    }

    // Add current request
    recentRequests.push(now);
    rateLimitMap.set(clientId, recentRequests);

    next();
  };
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security (for HTTPS)
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' ws: wss:; " +
    "font-src 'self' data:;"
  );
  
  next();
};

module.exports = {
  sanitizeInput,
  validateMessage,
  rateLimit,
  securityHeaders
};

