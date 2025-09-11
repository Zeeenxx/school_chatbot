// Logging middleware for monitoring and debugging
const fs = require('fs');
const path = require('path');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create log file path with date
const getLogFileName = () => {
  const date = new Date().toISOString().split('T')[0];
  return path.join(logsDir, `chatbot-${date}.log`);
};

// Log format
const formatLog = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  return JSON.stringify({
    timestamp,
    level,
    message,
    ...meta
  }) + '\n';
};

// Write to log file
const writeLog = (level, message, meta = {}) => {
  const logEntry = formatLog(level, message, meta);
  const logFile = getLogFileName();
  
  fs.appendFile(logFile, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request
  writeLog('info', 'Request received', {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent')
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - startTime;
    
    writeLog('info', 'Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress
    });

    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  writeLog('error', 'Server error occurred', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress
  });

  console.error('Server Error:', err);
  next(err);
};

// Chat message logging
const logChatMessage = (message, response, duration) => {
  writeLog('info', 'Chat interaction', {
    userMessage: message,
    botResponse: response.text,
    responseType: response.type,
    duration: `${duration}ms`,
    hasData: !!response.data
  });
};

// AI API logging
const logAIInteraction = (prompt, response, error = null) => {
  if (error) {
    writeLog('error', 'AI API error', {
      error: error.message,
      prompt: prompt.substring(0, 100) + '...'
    });
  } else {
    writeLog('info', 'AI API success', {
      promptLength: prompt.length,
      responseLength: response ? response.length : 0
    });
  }
};

// File upload logging
const logFileUpload = (filename, fileSize, success, error = null) => {
  if (error) {
    writeLog('error', 'File upload failed', {
      filename,
      fileSize,
      error: error.message
    });
  } else {
    writeLog('info', 'File upload success', {
      filename,
      fileSize
    });
  }
};

// Performance monitoring
const logPerformance = (operation, duration, details = {}) => {
  writeLog('info', 'Performance metric', {
    operation,
    duration: `${duration}ms`,
    ...details
  });
};

module.exports = {
  requestLogger,
  errorLogger,
  logChatMessage,
  logAIInteraction,
  logFileUpload,
  logPerformance,
  writeLog
};

