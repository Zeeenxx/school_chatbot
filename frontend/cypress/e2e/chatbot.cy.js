describe('Osmeña Colleges Chatbot E2E Tests', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('/');
    
    // Wait for the page to load
    cy.get('[data-testid="chat-icon"]', { timeout: 10000 }).should('be.visible');
  });

  it('should open and close the chat interface', () => {
    // Click the chat icon to open
    cy.get('[data-testid="chat-icon"]').click();
    
    // Verify chat interface is open
    cy.get('h2').should('contain', 'Osmeña Colleges Assistant');
    
    // Close the chat
    cy.get('[data-testid="chat-close"]').click();
    
    // Verify chat is closed
    cy.get('h2').should('not.exist');
  });

  it('should send and receive messages', () => {
    // Open chat
    cy.get('[data-testid="chat-icon"]').click();
    
    // Wait for welcome message
    cy.contains('Welcome to the Osmeña Colleges School Chatbot', { timeout: 10000 });
    
    // Type a message
    cy.get('input[placeholder*="type your message"]').type('What courses are available?');
    
    // Send the message
    cy.get('button[type="submit"]').click();
    
    // Verify message was sent (input should be empty)
    cy.get('input[placeholder*="type your message"]').should('have.value', '');
    
    // Wait for response
    cy.contains('Here are our available courses', { timeout: 10000 });
  });

  it('should handle course queries', () => {
    cy.get('[data-testid="chat-icon"]').click();
    cy.contains('Welcome to the Osmeña Colleges School Chatbot', { timeout: 10000 });
    
    cy.get('input[placeholder*="type your message"]').type('What courses do you offer?');
    cy.get('button[type="submit"]').click();
    
    // Should show course information
    cy.contains('Computer Science', { timeout: 10000 });
    cy.contains('Business Administration');
  });

  it('should handle tuition queries', () => {
    cy.get('[data-testid="chat-icon"]').click();
    cy.contains('Welcome to the Osmeña Colleges School Chatbot', { timeout: 10000 });
    
    cy.get('input[placeholder*="type your message"]').type('How much is tuition?');
    cy.get('button[type="submit"]').click();
    
    // Should show tuition information
    cy.contains('tuition', { timeout: 10000 });
  });

  it('should handle facility queries', () => {
    cy.get('[data-testid="chat-icon"]').click();
    cy.contains('Welcome to the Osmeña Colleges School Chatbot', { timeout: 10000 });
    
    cy.get('input[placeholder*="type your message"]').type('Where is the library?');
    cy.get('button[type="submit"]').click();
    
    // Should show facility information
    cy.contains('library', { timeout: 10000 });
  });

  it('should be responsive on mobile', () => {
    // Test mobile viewport
    cy.viewport(375, 667);
    
    cy.get('[data-testid="chat-icon"]').click();
    cy.get('h2').should('contain', 'Osmeña Colleges Assistant');
    
    // Test mobile interaction
    cy.get('input[placeholder*="type your message"]').type('Hello');
    cy.get('button[type="submit"]').click();
  });

  it('should handle empty messages gracefully', () => {
    cy.get('[data-testid="chat-icon"]').click();
    cy.contains('Welcome to the Osmeña Colleges School Chatbot', { timeout: 10000 });
    
    // Try to send empty message
    cy.get('button[type="submit"]').click();
    
    // Should not crash
    cy.get('input[placeholder*="type your message"]').should('be.visible');
  });

  it('should support keyboard navigation', () => {
    cy.get('[data-testid="chat-icon"]').click();
    cy.contains('Welcome to the Osmeña Colleges School Chatbot', { timeout: 10000 });
    
    // Type message and press Enter
    cy.get('input[placeholder*="type your message"]').type('Test message{enter}');
    
    // Input should be cleared
    cy.get('input[placeholder*="type your message"]').should('have.value', '');
  });

  it('should display school branding correctly', () => {
    // Check if school logo is present
    cy.get('img[alt*="Osmeña"]').should('be.visible');
    
    // Check if school name is displayed
    cy.contains('Osmeña Colleges');
  });

  it('should handle multiple consecutive messages', () => {
    cy.get('[data-testid="chat-icon"]').click();
    cy.contains('Welcome to the Osmeña Colleges School Chatbot', { timeout: 10000 });
    
    // Send multiple messages
    const messages = [
      'What courses are available?',
      'How much is tuition?',
      'Where is the library?'
    ];
    
    messages.forEach((message, index) => {
      cy.get('input[placeholder*="type your message"]').type(message);
      cy.get('button[type="submit"]').click();
      
      // Wait for response before next message
      cy.wait(2000);
    });
    
    // Should have multiple conversation bubbles
    cy.get('[data-testid="message-bubble"]').should('have.length.greaterThan', 3);
  });
});

