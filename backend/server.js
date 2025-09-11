
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth'); // For DOCX files
const pdfParse = require('pdf-parse'); // For PDF files
const xlsx = require('xlsx'); // For Excel files
require('dotenv').config();

// Import security and logging middleware
const { sanitizeInput, validateMessage, rateLimit, securityHeaders } = require('./middleware/validation');
const { requestLogger, errorLogger, logChatMessage, logAIInteraction, logFileUpload, logPerformance } = require('./middleware/logging');

// Import database and authentication
const { User, ChatSession, Message, Analytics, Course, Facility, Staff, KnowledgeBase } = require('./database/database');
const { optionalAuth } = require('./middleware/auth');

// Import routes
const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const createCmsRouter = require('./routes/cms');
const publicRoutes = require('./routes/public');
const knowledgeRoutes = require('./routes/knowledge');

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.235:3000", "http://192.168.56.1:3000"],
    methods: ["GET", "POST"]
  },
  // Add timeout and connection configurations for mobile devices
  pingTimeout: 60000, // 60 seconds
  pingInterval: 25000, // 25 seconds
  connectTimeout: 60000, // 60 seconds
  transports: ['websocket', 'polling'] // Allow fallback to polling for mobile
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(securityHeaders); // Security headers first
app.use(requestLogger); // Request logging
app.use(cors({
  origin: ["http://localhost:3000", "http://192.168.1.235:3000", "http://192.168.56.1:3000"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(sanitizeInput); // Sanitize all inputs

// Health check endpoint for mobile testing
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running and accessible',
    timestamp: new Date().toISOString(),
    server_ip: req.ip
  });
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow common document and image types
  const allowedExtensions = /\.(jpeg|jpg|png|gif|pdf|doc|docx|txt|xlsx|xls|ppt|pptx|csv)$/i;
  const allowedMimeTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/csv',
    'application/csv'
  ];

  const extname = allowedExtensions.test(file.originalname.toLowerCase());
  const mimetype = allowedMimeTypes.includes(file.mimetype);

  console.log('File filter check:', {
    filename: file.originalname,
    mimetype: file.mimetype,
    extnameValid: extname,
    mimetypeValid: mimetype
  });

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only documents and images are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Gemini AI integration
async function generateAIResponse(message, history = [], schoolContext) {
  if (!model) {
    return null; // Fallback if no API key
  }

  try {
    // System instruction to guide the AI
    const systemInstruction = {
      role: "user",
      parts: [{ 
        text: `You are a helpful AI assistant for Osmeña Colleges. Your goal is to help students with their questions about the school and general academic topics.
        
        Guidelines:
        - Be helpful, friendly, and educational.
        - Keep responses concise but informative.
        - Use the provided school data to answer specific questions about Osmeña Colleges.
        - For general knowledge questions, answer normally.
        - Detect the language of the user's question. If it is in Filipino/Tagalog, you MUST respond in Filipino/Tagalog. Otherwise, respond in English.
        - After your main response, ALWAYS provide three relevant follow-up questions the user might ask next. Format them as a JSON array of strings like this: {"suggestions": ["Question 1?", "Question 2?", "Question 3?"]}. The questions should be concise and directly related to the user's query.
        
        Here is the school data for your reference:
        ${JSON.stringify(schoolContext, null, 2)}` 
      }],
    };
    
    // Acknowledge the instruction to start the conversation correctly
    const modelAck = {
      role: "model",
      parts: [{ text: "Okay, I am ready to help students of Osmeña Colleges." }]
    };

    const chat = model.startChat({
        history: [systemInstruction, modelAck, ...history],
        generationConfig: {
            maxOutputTokens: 1500, // Increased token limit for conversation
        },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const textResponse = response.text();

    // Extract the JSON part from the response
    const jsonMatch = textResponse.match(/\{"suggestions":\s*\[.*\]\}/);
    let suggestions = [];
    let cleanText = textResponse;

    if (jsonMatch) {
      try {
        const parsedJson = JSON.parse(jsonMatch[0]);
        suggestions = parsedJson.suggestions || [];
        // Remove the JSON part from the main text
        cleanText = textResponse.replace(jsonMatch[0], '').trim();
      } catch (e) {
        console.error("Failed to parse AI suggestions JSON:", e);
      }
    }

    return { text: cleanText, suggestions };
  } catch (error) {
    console.error('Gemini AI Error:', error);
    
    // Check if it's a quota exceeded error
    if (error.status === 429) {
      console.log('⚠️  Gemini API quota exceeded. Falling back to school database responses.');
      return null; // This will trigger the fallback to regular responses
    }
    
    return null; // Fallback to regular responses
  }
}

// Function to analyze images with Gemini Vision
async function analyzeImagesWithGemini(message, images) {
  if (!genAI) {
    console.log('Gemini AI not available');
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert images to the format Gemini expects
    const imageParts = [];
    
    for (const image of images) {
      try {
        const imagePath = path.join(__dirname, 'uploads', image.filename);
        console.log('Trying to read image from:', imagePath); // Debug log
        
        if (!fs.existsSync(imagePath)) {
          console.error('Image file does not exist:', imagePath);
          continue;
        }
        
        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString('base64');
        
        imageParts.push({
          inlineData: {
            data: base64Image,
            mimeType: image.mimetype || image.mimeType || 'image/jpeg'
          }
        });
        
        console.log('Successfully processed image:', image.filename); // Debug log
      } catch (fileError) {
        console.error('Error reading image file:', fileError);
        continue;
      }
    }

    if (imageParts.length === 0) {
      return null; // No valid images to process
    }

    const prompt = `You are the Osmeña Colleges School Assistant. 

Context about Osmeña Colleges:
- Founded in 1948
- Located in Osmeña Street Masbate City, Philippines
- Offers various undergraduate and graduate programs
- Known for excellence in education
- Has modern facilities and experienced faculty

The user has uploaded ${images.length} image(s) and asked: "${message}"

Please analyze the image(s) and provide a helpful response. If the images show:
- School documents: Help explain or clarify the content
- Campus photos: Provide information about facilities or areas shown
- Academic materials: Assist with understanding the content
- Forms or applications: Guide the user through the process
- Any other school-related content: Provide relevant assistance

Be helpful, educational, and specific about what you see in the image(s).`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Vision Error:', error);
    return null;
  }
}

// Function to extract text from different document types
async function extractDocumentText(filePath, mimeType, originalName) {
  try {
    const fileExtension = path.extname(originalName).toLowerCase();
    
    console.log(`Extracting text from ${originalName} (${mimeType})`);
    
    switch (true) {
      // PDF files
      case mimeType === 'application/pdf' || fileExtension === '.pdf':
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(pdfBuffer);
        return pdfData.text;
      
      // DOCX files
      case mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileExtension === '.docx':
        const docxBuffer = fs.readFileSync(filePath);
        const docxResult = await mammoth.extractRawText({ buffer: docxBuffer });
        return docxResult.value;
      
      // Excel files (XLS, XLSX)
      case mimeType === 'application/vnd.ms-excel' || 
           mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
           fileExtension === '.xls' || fileExtension === '.xlsx':
        const workbook = xlsx.readFile(filePath);
        let excelText = '';
        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const sheetData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
          excelText += `Sheet: ${sheetName}\n`;
          sheetData.forEach(row => {
            if (row.length > 0) {
              excelText += row.join(' | ') + '\n';
            }
          });
          excelText += '\n';
        });
        return excelText;
      
      // Text files
      case mimeType === 'text/plain' || fileExtension === '.txt':
        return fs.readFileSync(filePath, 'utf8');
      
      // PowerPoint files
      case mimeType === 'application/vnd.ms-powerpoint' || 
           mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
           fileExtension === '.ppt' || fileExtension === '.pptx':
        // For now, return a note about PowerPoint files
        // You can add a PowerPoint parser library if needed
        return `PowerPoint file: ${originalName} - Content analysis available but text extraction limited. Please describe what you need help with regarding this presentation.`;
      
      // Default case for other files
      default:
        return `File: ${originalName} (${mimeType}) - This file type is supported. Please describe what you need help with regarding this document.`;
    }
  } catch (error) {
    console.error('Error extracting document text:', error);
    return `Error reading ${originalName}. Please try uploading the file again or describe what you need help with.`;
  }
}

// Function to analyze documents with Gemini AI
async function analyzeDocumentWithGemini(message, files) {
  if (!genAI) {
    console.log('Gemini AI not available');
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Extract text from all uploaded files
    const documentContents = [];
    
    for (const file of files) {
      try {
        const filePath = path.join(__dirname, 'uploads', file.filename);
        console.log('Analyzing document:', filePath);
        
        if (!fs.existsSync(filePath)) {
          console.error('Document file does not exist:', filePath);
          continue;
        }
        
        const extractedText = await extractDocumentText(filePath, file.mimetype || file.mimeType, file.originalName);
        
        documentContents.push({
          filename: file.originalName,
          content: extractedText,
          type: file.mimetype || file.mimeType
        });
        
        console.log('Successfully processed document:', file.originalName);
      } catch (fileError) {
        console.error('Error processing document file:', fileError);
        continue;
      }
    }

    if (documentContents.length === 0) {
      return null; // No valid documents to process
    }

    // Prepare the prompt with document contents
    let documentsText = '';
    documentContents.forEach((doc, index) => {
      documentsText += `\n--- Document ${index + 1}: ${doc.filename} (${doc.type}) ---\n`;
      documentsText += doc.content;
      documentsText += '\n--- End of Document ---\n';
    });

    const prompt = `You are the Osmeña Colleges School Assistant AI. 

Context about Osmeña Colleges:
- Founded in 1948
- Located in Masbate City, Philippines
- Offers various undergraduate and graduate programs
- Known for excellence in education
- Has modern facilities and experienced faculty

The user has uploaded ${files.length} document(s) and asked: "${message}"

Here are the contents of the uploaded documents:
${documentsText}

Please analyze the document(s) and provide a helpful response. You can:
- Explain or summarize the document content
- Answer specific questions about the documents
- Help interpret forms, schedules, or academic materials
- Provide guidance on how to complete forms or applications
- Clarify any school policies or procedures mentioned
- Help with understanding academic requirements or course information

Be helpful, accurate, and educational in your response. Reference specific parts of the documents when relevant.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Document Analysis Error:', error);
    return null;
  }
}

// Enhanced chatbot logic with AI fallback
async function generateResponse(message, history = []) {
  const lowercaseMessage = message.toLowerCase().trim();

  // Fetch dynamic data from the database
  const courses = await Course.getAll();
  const facilities = await Facility.getAll();
  const staff = await Staff.getAll();

  // Define strict patterns for specific queries
  const coursePatterns = [
    /what courses/, /list of courses/, /show me courses/, /course offerings/,
    /available courses/, /what programs/, /list of programs/, /degree programs/
  ];
  const facilityPatterns = [
    /what facilities/, /list of facilities/, /show me the facilities/, /campus tour/,
    /where is the library/, /gym hours/, /cafeteria location/
  ];
  const staffPatterns = [
    /who are the staff/, /list of staff/, /faculty members/, /contact a teacher/,
    /dean of/, /who is the president/
  ];

  // 1. Check for strict pattern matches first
  if (coursePatterns.some(pattern => pattern.test(lowercaseMessage))) {
    return {
      text: "Here are our available courses:",
      data: courses,
      type: "courses",
      suggestions: ["What are the tuition fees?", "Tell me about the facilities.", "How can I enroll?"]
    };
  }

  if (facilityPatterns.some(pattern => pattern.test(lowercaseMessage))) {
    return {
      text: "Here are our school facilities:",
      data: facilities,
      type: "facilities",
      suggestions: ["What courses are available?", "Who are the staff members?", "What are the admission requirements?"]
    };
  }

  if (staffPatterns.some(pattern => pattern.test(lowercaseMessage))) {
    return {
      text: "Here are our school staff members:",
      data: staff,
      type: "staff",
      suggestions: ["What are the office hours for the registrar?", "How do I contact the Computer Science dean?", "Tell me more about the library."]
    };
  }

  // 2. Check Knowledge Base if no strict pattern matches
  try {
    const allKnowledge = await KnowledgeBase.getAll();
    // Use a more sophisticated matching algorithm
    let bestMatch = null;
    let highestScore = 0;
    
    const stopWords = new Set(['a', 'an', 'the', 'are', 'is', 'in', 'of', 'for', 'what', 'when', 'where', 'who', 'why', 'how', 'do', 'you', 'i', 's', 't', 'm', 're', 've', 'and', 'or']);


    allKnowledge.forEach(item => {
      const question = item.question.toLowerCase();
      const userMessage = lowercaseMessage;

      // Simple word overlap score, ignoring stop words
      const questionWords = new Set(question.split(/\W+/).filter(w => w.length > 2 && !stopWords.has(w)));
      const userWords = new Set(userMessage.split(/\W+/).filter(w => w.length > 2 && !stopWords.has(w)));
      const intersection = new Set([...userWords].filter(x => questionWords.has(x)));
      const score = intersection.size;
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    });
    
    // Set a threshold for a "good" match to avoid false positives
    if (bestMatch && highestScore >= 2) {
        return {
            text: bestMatch.answer,
            type: 'knowledge_base',
            suggestions: ["Ask another question", "What other events are there?", "Tell me about enrollment."],
        };
    }
  } catch (err) {
    console.error("Error querying knowledge base:", err);
  }

  // 3. If no match, fallback to Gemini AI
  try {
    const schoolContext = { courses, facilities, staff };
    const aiResponse = await generateAIResponse(message, history, schoolContext);
    if (aiResponse && aiResponse.text) {
      return {
        text: aiResponse.text,
        suggestions: aiResponse.suggestions,
        type: "ai_response"
      };
    }
  } catch (error) {
    console.error('AI Response Error:', error);
  }
  
  // 4. Final fallback response if AI fails or provides no response
  return {
    text: "I'm sorry, I couldn't find a specific answer for that. I can help with questions about courses, school facilities, and staff members. How can I assist you?",
    type: "default",
    suggestions: ["List all courses", "Show me the campus facilities", "Who are the deans?"]
  };
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Analytics routes
app.use('/api/analytics', analyticsRoutes);

// Public routes
app.use('/api/public', publicRoutes);

// CMS routes
const cmsRoutes = createCmsRouter(io);
app.use('/api/cms', cmsRoutes);

// Knowledge routes
app.use('/api/knowledge', knowledgeRoutes);

app.post('/api/chat', 
  rateLimit(60000, 30), // 30 requests per minute
  validateMessage,
  optionalAuth, // Optional authentication
  async (req, res) => {
    const startTime = Date.now();
    const { message, sessionId } = req.body;
    const userId = req.user ? req.user.id : null;
    
    try {
      // Generate or get session ID
      const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create or update chat session
      let session = await ChatSession.getById(currentSessionId);
      if (!session) {
        await ChatSession.create(currentSessionId, userId);
      } else {
        await ChatSession.updateMessageCount(currentSessionId);
      }
      
      // Fetch message history for context
      const messageHistory = await Message.findAllBy({ sessionId: currentSessionId }) || [];
      
      // Format history for the AI model, limiting to the last 10 messages
      const history = messageHistory
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
        .slice(-10); 

      // Save user message to database
      await Message.save({
        sessionId: currentSessionId,
        userId,
        messageType: 'text',
        content: message,
        sender: 'user',
        metadata: { timestamp: new Date().toISOString() }
      });
      
      // Generate response with conversation history
      const response = await generateResponse(message, history);
      const duration = Date.now() - startTime;
      
      // Save bot response to database
      await Message.save({
        sessionId: currentSessionId,
        userId,
        messageType: 'text',
        content: response.text,
        sender: 'bot',
        metadata: { 
          type: response.type,
          hasData: !!response.data,
          duration: duration
        }
      });
      
      // Log the chat interaction
      logChatMessage(message, response, duration);
      
      res.json({
        ...response,
        sessionId: currentSessionId
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logPerformance('chat_error', duration, { error: error.message });
      
      res.status(500).json({
        text: "I'm sorry, I encountered an error processing your request. Please try again.",
        type: "error"
      });
    }
  }
);

// File upload endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    const fileInfo = {
      success: true,
      message: 'File uploaded successfully!',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadDate: new Date().toISOString(),
        url: `/uploads/${req.file.filename}`,
        previewUrl: `/uploads/${req.file.filename}` // Add previewUrl for compatibility
      }
    };

    console.log('File uploaded:', fileInfo);
    res.json(fileInfo);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Upload failed: ' + error.message 
    });
  }
});

// Delete uploaded file
app.delete('/api/upload/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found' 
      });
    }
    
    // Delete the file
    fs.unlinkSync(filePath);
    
    console.log('File deleted:', filename);
    res.json({ 
      success: true, 
      message: 'File deleted successfully',
      filename 
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Delete failed: ' + error.message 
    });
  }
});

// Get uploaded files list
app.get('/api/files', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir)
      .filter(file => file !== '.gitkeep')
      .map(filename => {
        const filePath = path.join(uploadsDir, filename);
        const stats = fs.statSync(filePath);
        return {
          filename,
          size: stats.size,
          uploadDate: stats.mtime,
          url: `/uploads/${filename}`
        };
      })
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    res.json({ success: true, files });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error reading files: ' + error.message 
    });
  }
});

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.emit('message', {
    text: "Welcome to the Osmeña Colleges School Chatbot! How can I help you today?",
    type: "greeting",
    sender: "bot"
  });
  
  socket.on('user_message', async (data) => {
    let response;
    
    // Check if images are included
    if (data.images && data.images.length > 0) {
      console.log('Processing message with images:', data.images.length);
      
      const visionResponse = await analyzeImagesWithGemini(data.message, data.images);
      
      if (visionResponse) {
        response = {
          text: visionResponse,
          sender: "bot",
          timestamp: new Date().toISOString()
        };
      } else {
        response = {
          text: "I can see that you've uploaded an image, but I'm having trouble analyzing it right now. Could you describe what you'd like to know about the image?",
          sender: "bot",
          timestamp: new Date().toISOString()
        };
      }
    }
    // Check if documents are included  
    else if (data.files && data.files.length > 0) {
      console.log('Processing message with documents:', data.files.length);
      
      const documentResponse = await analyzeDocumentWithGemini(data.message, data.files);
      
      if (documentResponse) {
        response = {
          text: documentResponse,
          sender: "bot",
          timestamp: new Date().toISOString()
        };
      } else {
        response = {
          text: "I can see that you've uploaded a document, but I'm having trouble analyzing it right now. Could you describe what you'd like to know about the document?",
          sender: "bot",
          timestamp: new Date().toISOString()
        };
      }
    }
    // Handle legacy single file uploads
    else if (data.file) {
      const files = [data.file];
      const documentResponse = await analyzeDocumentWithGemini(data.message, files);
      
      if (documentResponse) {
        response = {
          text: documentResponse,
          sender: "bot",
          timestamp: new Date().toISOString()
        };
      } else {
        // Note: Socket-based chat will remain stateless for now
        response = await generateResponse(data.message);
      }
    }
    else {
      // Handle text-only messages as before
      // Note: Socket-based chat will remain stateless for now
      response = await generateResponse(data.message);
    }
    
    // Add a delay to let users appreciate the typing indicator animation
    const responseDelay = 2000; // 2 seconds delay
    setTimeout(() => {
      socket.emit('bot_message', {
        ...response,
        sender: "bot",
        timestamp: new Date().toISOString()
      });
    }, responseDelay);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware (must be last)
app.use(errorLogger);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found on this server.'
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT} and accessible from all network interfaces`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔒 Security middleware enabled`);
  console.log(`📝 Logging enabled`);
});
