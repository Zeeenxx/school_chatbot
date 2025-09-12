import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

test('renders Osmeña Colleges branding', () => {
  render(<App />);
  const titleElement = screen.getByText(/Osmeña Colleges/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders chat interface', () => {
  render(<App />);
  const chatElement = screen.getByText(/Open Chat/i);
  expect(chatElement).toBeInTheDocument();
});
