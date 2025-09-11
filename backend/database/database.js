const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database file path
const dbPath = path.join(__dirname, 'chatbot.db');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'student',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Chat sessions table
  db.run(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      session_id TEXT UNIQUE NOT NULL,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME,
      message_count INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      user_id INTEGER,
      message_type TEXT DEFAULT 'text',
      content TEXT NOT NULL,
      sender TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      metadata TEXT,
      FOREIGN KEY (session_id) REFERENCES chat_sessions (session_id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Analytics table
  db.run(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL,
      total_sessions INTEGER DEFAULT 0,
      total_messages INTEGER DEFAULT 0,
      unique_users INTEGER DEFAULT 0,
      avg_session_duration REAL DEFAULT 0,
      popular_queries TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User feedback table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      session_id TEXT,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      feedback_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id),
      FOREIGN KEY (session_id) REFERENCES chat_sessions (session_id)
    )
  `);

  // Courses table for CMS
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      dean TEXT,
      time TEXT,
      tuition TEXT,
      credits INTEGER,
      description TEXT,
      prerequisites TEXT
    )
  `);

  // Facilities table for CMS
  db.run(`
    CREATE TABLE IF NOT EXISTS facilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      manager TEXT,
      location TEXT,
      hours TEXT,
      capacity TEXT,
      booking_fee TEXT,
      amenities TEXT,
      description TEXT,
      contact TEXT,
      phone TEXT,
      services TEXT,
      rules TEXT,
      requirements TEXT,
      latitude REAL,
      longitude REAL
    )
  `);

  // Staff table for CMS
  db.run(`
    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      position TEXT,
      department TEXT,
      email TEXT,
      phone TEXT,
      education TEXT,
      experience TEXT,
      specialization TEXT,
      office_hours TEXT,
      office_location TEXT,
      profile_picture TEXT,
      bio TEXT,
      achievements TEXT
    )
  `);

  // Announcements table
  db.run(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users (id)
    )
  `);

  // Knowledge Base table
  db.run(`
    CREATE TABLE IF NOT EXISTS knowledge_base (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Database tables initialized');
}

// User management functions
const User = {
  // Create a new user
  create: (userData) => {
    return new Promise((resolve, reject) => {
      const { username, email, passwordHash, role = 'student' } = userData;
      
      db.run(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [username, email, passwordHash, role],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, username, email, role });
          }
        }
      );
    });
  },

  // Find user by username
  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  },

  // Find user by email
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  },

  // Update last login
  updateLastLogin: (userId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [userId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
};

// Chat session management
const ChatSession = {
  // Create a new chat session
  create: (sessionId, userId = null) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO chat_sessions (session_id, user_id) VALUES (?, ?)',
        [sessionId, userId],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, sessionId, userId });
          }
        }
      );
    });
  },

  // Get session by ID
  getById: (sessionId) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM chat_sessions WHERE session_id = ?',
        [sessionId],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  },

  // Update session message count
  updateMessageCount: (sessionId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE chat_sessions SET message_count = message_count + 1 WHERE session_id = ?',
        [sessionId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  },

  // End session
  endSession: (sessionId) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE chat_sessions SET ended_at = CURRENT_TIMESTAMP WHERE session_id = ?',
        [sessionId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
};

// Message management
const Message = {
  // Save a message
  save: (messageData) => {
    return new Promise((resolve, reject) => {
      const { sessionId, userId, messageType, content, sender, metadata } = messageData;
      
      db.run(
        'INSERT INTO messages (session_id, user_id, message_type, content, sender, metadata) VALUES (?, ?, ?, ?, ?, ?)',
        [sessionId, userId, messageType, content, sender, JSON.stringify(metadata)],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  },

  // Get messages for a session
  getBySession: (sessionId, limit = 50) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM messages WHERE session_id = ? ORDER BY timestamp DESC LIMIT ?',
        [sessionId, limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => ({...row, metadata: JSON.parse(row.metadata || '{}')})).reverse());
          }
        }
      );
    });
  },

  // Find all messages by a condition
  findAllBy: (condition) => {
    return new Promise((resolve, reject) => {
      const whereClause = Object.keys(condition).map(key => `${key} = ?`).join(' AND ');
      const values = Object.values(condition);
      
      db.all(
        `SELECT * FROM messages WHERE ${whereClause} ORDER BY timestamp ASC`,
        values,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows.map(row => ({...row, metadata: JSON.parse(row.metadata || '{}')})));
          }
        }
      );
    });
  },

  // Get popular queries
  getPopularQueries: (limit = 10) => {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT content, COUNT(*) as count 
         FROM messages 
         WHERE sender = 'user' AND message_type = 'text' 
         GROUP BY content 
         ORDER BY count DESC 
         LIMIT ?`,
        [limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
};

// Generic CRUD factory
const createCrudManager = (tableName, fields) => {
  const fieldsString = fields.join(', ');
  const placeholders = fields.map(() => '?').join(', ');
  const updatePlaceholders = fields.map(field => `${field} = ?`).join(', ');

  return {
    // Get all records
    getAll: () => new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${tableName}`, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

    // Get a record by ID
    getById: (id) => new Promise((resolve, reject) => {
      db.get(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    }),

    // Create a new record
    create: (data) => new Promise((resolve, reject) => {
      const values = fields.map(field => data[field]);
      db.run(`INSERT INTO ${tableName} (${fieldsString}) VALUES (${placeholders})`, values, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, ...data });
      });
    }),

    // Update a record
    update: (id, data) => new Promise((resolve, reject) => {
      const values = [...fields.map(field => data[field]), id];
      db.run(`UPDATE ${tableName} SET ${updatePlaceholders} WHERE id = ?`, values, function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    }),

    // Delete a record
    delete: (id) => new Promise((resolve, reject) => {
      db.run(`DELETE FROM ${tableName} WHERE id = ?`, [id], function(err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    }),
  };
};


// CMS Models
const Course = createCrudManager('courses', [
  'name', 'dean', 'time', 'tuition', 'credits', 'description', 'prerequisites'
]);

const Facility = createCrudManager('facilities', [
  'name', 'manager', 'location', 'hours', 'capacity', 'booking_fee', 
  'amenities', 'description', 'contact', 'phone', 'services', 'rules', 'requirements',
  'latitude', 'longitude'
]);

const Staff = createCrudManager('staff', [
  'name', 'position', 'department', 'email', 'phone', 'education', 'experience', 
  'specialization', 'office_hours', 'office_location', 'profile_picture', 'bio', 'achievements'
]);

const Announcement = createCrudManager('announcements', [
  'title', 'content', 'author_id'
]);

const KnowledgeBase = createCrudManager('knowledge_base', [
  'category', 'question', 'answer'
]);


// Analytics functions
const Analytics = {
  // Record daily analytics
  recordDailyStats: (stats) => {
    return new Promise((resolve, reject) => {
      const { date, totalSessions, totalMessages, uniqueUsers, avgSessionDuration, popularQueries } = stats;
      
      db.run(
        `INSERT OR REPLACE INTO analytics 
         (date, total_sessions, total_messages, unique_users, avg_session_duration, popular_queries) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [date, totalSessions, totalMessages, uniqueUsers, avgSessionDuration, JSON.stringify(popularQueries)],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  },

  // Get analytics for date range
  getAnalytics: (startDate, endDate) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM analytics WHERE date BETWEEN ? AND ? ORDER BY date DESC',
        [startDate, endDate],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
};

// User feedback functions
const Feedback = {
  // Save user feedback
  save: (feedbackData) => {
    return new Promise((resolve, reject) => {
      const { userId, sessionId, rating, feedbackText } = feedbackData;
      
      db.run(
        'INSERT INTO user_feedback (user_id, session_id, rating, feedback_text) VALUES (?, ?, ?, ?)',
        [userId, sessionId, rating, feedbackText],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  },

  // Get feedback summary
  getSummary: () => {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
           COUNT(*) as total_feedback,
           AVG(rating) as avg_rating,
           COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_feedback
         FROM user_feedback`,
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }
};

// Close database connection
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Database connection closed');
        resolve();
      }
    });
  });
};

module.exports = {
  db,
  User,
  ChatSession,
  Message,
  Analytics,
  Feedback,
  Course,
  Facility,
  Staff,
  Announcement,
  KnowledgeBase,
  closeDatabase
};


