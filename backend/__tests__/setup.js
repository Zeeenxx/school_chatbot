// Test setup file
const path = require('path');

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '5001'; // Use different port for testing

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to suppress console.log in tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Increase timeout for async operations
jest.setTimeout(10000);

