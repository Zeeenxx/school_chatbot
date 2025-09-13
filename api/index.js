// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const xlsx = require('xlsx');
require('dotenv').config();

// Import security and logging middleware
const { sanitizeInput, validateMessage, rateLimit, securityHeaders } = require('../backend/middleware/validation');
const { requestLogger, errorLogger, logChatMessage, logAIInteraction, logFileUpload, logPerformance } = require('../backend/middleware/logging');

// Import database and authentication
const { User, ChatSession, Message, Analytics, Course, Facility, Staff, KnowledgeBase } = require('../backend/database/database');
const { optionalAuth } = require('../backend/middleware/auth');

// Import routes
const authRoutes = require('../backend/routes/auth');
const analyticsRoutes = require('../backend/routes/analytics');
const createCmsRouter = require('../backend/routes/cms');
const publicRoutes = require('../backend/routes/public');
const knowledgeRoutes = require('../backend/routes/knowledge');

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

const app = express();

// Define allowed origins for Vercel
const allowedOrigins = [
  "http://localhost:3000",
  /https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/,
  /https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/,
  process.env.FRONTEND_URL
].filter(Boolean);

// CORS configuration
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security headers
app.use(securityHeaders);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(requestLogger);

// Rate limiting
app.use(rateLimit);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../backend/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|docx|xlsx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, Word docs, Excel files, and text files are allowed.'));
    }
  }
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/cms', createCmsRouter());
app.use('/api/public', publicRoutes);
app.use('/api/knowledge', knowledgeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// File upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`
    };

    logFileUpload(req, fileInfo);
    res.json({ success: true, file: fileInfo });
  } catch (error) {
    errorLogger(error, req, res);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../backend/uploads')));

// Chat endpoint
app.post('/api/chat', optionalAuth, async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message || !validateMessage(message)) {
      return res.status(400).json({ error: 'Invalid message' });
    }

    const sanitizedMessage = sanitizeInput(message);
    
    if (!model) {
      return res.status(500).json({ error: 'AI model not available' });
    }

    // Log the chat message
    logChatMessage(req, sanitizedMessage);

    const startTime = Date.now();
    
    try {
      const result = await model.generateContent(sanitizedMessage);
      const response = await result.response;
      const aiResponse = response.text();
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      // Log AI interaction
      logAIInteraction(req, sanitizedMessage, aiResponse, responseTime);
      
      res.json({ 
        response: aiResponse,
        sessionId: sessionId || Date.now().toString(),
        timestamp: new Date().toISOString()
      });
    } catch (aiError) {
      errorLogger(aiError, req, res);
      res.status(500).json({ error: 'AI service temporarily unavailable' });
    }
  } catch (error) {
    errorLogger(error, req, res);
    res.status(500).json({ error: 'Chat processing failed' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  errorLogger(error, req, res);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;
