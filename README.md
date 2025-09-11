# 🎓 Osmeña Colleges School Chatbot

A modern, AI-powered web-based chatbot designed specifically for Osmeña Colleges to help students and staff get instant information about courses, facilities, contacts, and more.

## 🌟 Features

- **Real-time Chat**: Instant messaging with WebSocket support
- **AI-Powered Responses**: Google Gemini AI for intelligent conversations
- **School Information**: Course schedules, facility locations, department contacts
- **Tuition & Financial Aid**: Course costs, scholarship information, payment plans
- **Comprehensive Course Data**: Tuition, credits, prerequisites, descriptions
- **Financial Support**: Scholarship details, financial aid options, payment plans
- **Smart Fallback**: Database responses + AI enhancement for natural conversations
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **TypeScript**: Type-safe development for better code quality
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript for type safety
- **Styled Components** for dynamic styling
- **Socket.io Client** for real-time communication
- **Responsive Design** for all devices

### Backend (Node.js + Express)
- **Express.js** server with RESTful APIs
- **Socket.io** for real-time WebSocket communication
- **CORS** enabled for cross-origin requests
- **Environment variables** for configuration

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd school_chatbot
   npm run install-all
   ```

3. **Configure AI integration (Optional but Recommended):**
   - Get a free Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add it to `backend/.env`: `GEMINI_API_KEY=your_api_key_here`
   - See `GEMINI_SETUP.md` for detailed instructions

3. **Start the development servers:**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

### Individual Commands

**Start backend only:**
```bash
npm run server
```

**Start frontend only:**
```bash
npm run client
```

**Build for production:**
```bash
npm run build
```

## 💬 How to Use

1. Open your browser and go to `http://localhost:3000`
2. Start chatting with the school assistant
3. Try these example queries:
   - **Courses**: "What courses are available?", "Show me all classes"
   - **Tuition**: "How much does Computer Science cost?", "What are the tuition fees?"
   - **Financial Aid**: "Tell me about scholarships", "What financial aid is available?"
   - **Payment Plans**: "What payment options do you have?", "Can I pay in installments?"
   - **Facilities**: "Where is the library?", "Show me school facilities"
   - **Contacts**: "How can I contact admissions?", "Financial aid office contact"

## 🎯 Sample Queries

The chatbot can help with:

- **Courses**: "Tell me about available courses", "What classes does Dr. Smith teach?"
- **Tuition & Fees**: "How much is tuition?", "What does Computer Science cost?", "Course fees"
- **Financial Aid**: "What scholarships are available?", "Financial aid options", "STEM scholarships"
- **Payment Plans**: "Payment plan options", "Can I pay monthly?", "Installment plans"
- **Facilities**: "Where is the library?", "What are the lab hours?"
- **Contacts**: "How do I contact admissions?", "Financial aid office phone number"
- **AI-Enhanced**: "How should I prepare for college?", "Tips for managing tuition payments?", "What's the best study approach?"
- **General**: "Hello", "Help me with school information"

## 🤖 AI Features (with Gemini API)

When you add a Gemini API key, the chatbot becomes much more intelligent:

- **Natural Conversations**: Ask questions in your own words
- **Contextual Understanding**: Understands complex, multi-part questions
- **Educational Advice**: Get study tips, college preparation advice
- **Smart Responses**: Combines school data with AI intelligence
- **24/7 Support**: Always available with helpful, human-like responses

**Example AI-Enhanced Interactions**:
- "I'm worried about affording college, what options do I have?"
- "How can I prepare for the Computer Science program?"
- "What's the difference between semester and monthly payment plans?"

## 🛠️ Customization

### Adding School Data

Edit `backend/server.js` to add your school's specific information:

```javascript
const schoolData = {
  courses: [
    // Add your courses here
  ],
  facilities: [
    // Add your facilities here
  ],
  departments: [
    // Add your departments here
  ]
};
```

### Styling

The frontend uses Styled Components. Modify colors and styling in:
- `frontend/src/components/ChatBot.tsx`
- `frontend/src/App.tsx`

### AI Integration

To add OpenAI integration:
1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to `backend/.env`
3. Uncomment the OpenAI integration code in `backend/server.js`

## 📱 Responsive Design

The chatbot is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- School kiosks

## 🔧 Development

### Project Structure
```
school_chatbot/
├── frontend/          # React TypeScript app
│   ├── src/
│   │   ├── components/
│   │   └── App.tsx
├── backend/           # Node.js Express server
│   ├── server.js
│   └── package.json
└── package.json       # Root package.json
```

### Technology Stack
- **Frontend**: React, TypeScript, Styled Components, Socket.io Client
- **Backend**: Node.js, Express, Socket.io, CORS
- **Communication**: WebSocket + REST API
- **Styling**: Styled Components with responsive design

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
- `PORT`: Server port (default: 5000)
- `OPENAI_API_KEY`: OpenAI API key (optional)

### Hosting Options
- **Frontend**: Netlify, Vercel, GitHub Pages
- **Backend**: Heroku, Railway, DigitalOcean

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues:
- Check the console for error messages
- Ensure both frontend and backend servers are running
- Verify WebSocket connection at `http://localhost:5000`

## 📋 To-Do List

- [ ] Add authentication for admin features
- [ ] Implement chat history persistence
- [ ] Add more AI capabilities with OpenAI integration
- [ ] Create admin panel for managing school data
- [ ] Add file upload for documents
- [ ] Implement user feedback system
- [ ] Add multi-language support

---

Built with ❤️ for educational institutions
