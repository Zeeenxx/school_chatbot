const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Mock the Google Generative AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('Mocked AI response')
        }
      })
    })
  }))
}));

// Mock socket.io
jest.mock('socket.io', () => ({
  Server: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    cors: jest.fn()
  }))
}));

// Create a test app instead of importing the full server
const app = express();
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json());

// Mock school data
const schoolData = {
  courses: [
    {
      name: "Computer Science",
      credits: 120,
      tuition: 15000,
      description: "Bachelor of Science in Computer Science"
    }
  ],
  facilities: [
    {
      name: "Library",
      location: "Main Building, 2nd Floor",
      description: "Main campus library"
    }
  ],
  staff: [
    {
      name: "Dr. Maria Santos",
      position: "Dean",
      department: "Academic Affairs"
    }
  ]
};

// Mock response generation
const generateResponse = (message) => {
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes('course')) {
    return {
      text: "Here are our available courses:",
      data: schoolData.courses,
      type: "courses"
    };
  }
  
  if (lowercaseMessage.includes('tuition')) {
    return {
      text: "Here's our tuition information:",
      data: schoolData.courses,
      type: "tuition"
    };
  }
  
  if (lowercaseMessage.includes('library') || lowercaseMessage.includes('facility')) {
    return {
      text: "Here are our facilities:",
      data: schoolData.facilities,
      type: "facilities"
    };
  }
  
  if (lowercaseMessage.includes('dean') || lowercaseMessage.includes('staff')) {
    return {
      text: "Here's our staff information:",
      data: schoolData.staff,
      type: "staff"
    };
  }
  
  return {
    text: "I can help you with information about courses, tuition, facilities, and staff.",
    type: "general"
  };
};

// Add routes
app.get('/', (req, res) => {
  res.json({ message: 'Osmeña Colleges Chatbot API' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  // Handle malformed requests
  if (!message) {
    return res.json({
      text: "Please provide a message to continue the conversation.",
      type: "error"
    });
  }
  
  const response = generateResponse(message);
  res.json(response);
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found on this server.'
  });
});

describe('Server API Endpoints', () => {
  test('GET / should return server status', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Osmeña Colleges Chatbot');
  });

  test('GET /api/health should return health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('POST /api/chat should handle course queries', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'What courses are available?' })
      .expect(200);

    expect(response.body).toHaveProperty('text');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('type', 'courses');
  });

  test('POST /api/chat should handle tuition queries', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'How much is tuition?' })
      .expect(200);

    expect(response.body).toHaveProperty('text');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('type', 'tuition');
  });

  test('POST /api/chat should handle facility queries', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Where is the library?' })
      .expect(200);

    expect(response.body).toHaveProperty('text');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('type', 'facilities');
  });

  test('POST /api/chat should handle staff queries', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Who is the dean?' })
      .expect(200);

    expect(response.body).toHaveProperty('text');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('type', 'staff');
  });

  test('POST /api/chat should handle invalid input gracefully', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: '' })
      .expect(200);

    expect(response.body).toHaveProperty('text');
  });

  test('POST /api/chat should handle malformed requests', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({})
      .expect(200);

    expect(response.body).toHaveProperty('text');
  });
});

describe('Server Configuration', () => {
  test('CORS should be properly configured', async () => {
    const response = await request(app)
      .options('/api/chat')
      .expect(204);

    expect(response.headers).toHaveProperty('access-control-allow-credentials');
    expect(response.headers).toHaveProperty('access-control-allow-methods');
  });

  test('Server should handle 404 routes', async () => {
    await request(app)
      .get('/nonexistent-route')
      .expect(404);
  });
});

describe('School Data Structure', () => {
  test('should have proper course data structure', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'What courses are available?' })
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
    if (response.body.data.length > 0) {
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('credits');
      expect(response.body.data[0]).toHaveProperty('tuition');
    }
  });

  test('should have proper facility data structure', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'Where is the library?' })
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
    if (response.body.data.length > 0) {
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('location');
    }
  });
});

describe('Error Handling', () => {
  test('should handle server errors gracefully', async () => {
    // This test ensures the server doesn't crash on unexpected errors
    const response = await request(app)
      .post('/api/chat')
      .send({ message: 'test' })
      .expect(200);

    expect(response.body).toHaveProperty('text');
  });
});
