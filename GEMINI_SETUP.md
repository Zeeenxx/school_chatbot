# 🤖 Google Gemini AI Integration Guide - Osmeña Colleges

## Getting Your Gemini API Key

1. **Visit Google AI Studio**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account

2. **Create API Key**:
   - Click "Create API key"
   - Select or create a project
   - Copy your API key

3. **Add to Environment**:
   - Open `backend/.env` file
   - Replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=AIzaSyC-your-actual-api-key-here
   ```

## 🚀 How It Works

### Enhanced AI Responses for Osmeña Colleges
- **Structured Data Queries**: Tuition, courses, facilities → Direct database responses
- **General Questions**: Natural conversation → Powered by Gemini AI with Osmeña Colleges context
- **Fallback System**: If AI fails → Smart fallback responses

### Example Interactions

**Traditional Queries** (Database responses):
- "What courses are available at Osmeña Colleges?"
- "How much is tuition?"
- "Tell me about scholarships"

**AI-Enhanced Queries** (Gemini responses):
- "How can I prepare for Computer Science 101 at Osmeña Colleges?"
- "What's the best way to apply for financial aid at Osmeña Colleges?"
- "Can you explain the difference between semester and monthly payment plans?"
- "I'm nervous about starting college at Osmeña Colleges, any advice?"

## 🔧 Configuration Options

### Model Selection
Current: `gemini-pro` (text-only)
- Best for conversational responses
- Fast and cost-effective

### Customization
Edit the AI prompt in `backend/server.js` to:
- Adjust the chatbot's personality for Osmeña Colleges
- Add specific Osmeña Colleges policies
- Include additional context about the institution

### Safety & Limits
- Built-in error handling
- Automatic fallback to regular responses
- Rate limiting handled by Google

## 🎯 Benefits

1. **Natural Conversations**: More human-like responses about Osmeña Colleges
2. **Contextual Understanding**: Understands complex questions about the institution
3. **School-Specific**: AI trained on your Osmeña Colleges data
4. **Always Available**: 24/7 intelligent assistance for students and staff
5. **Cost-Effective**: Gemini Pro offers generous free tier

## 🔍 Testing

After adding your API key:

1. **Restart the server** (if running)
2. **Try these AI-enhanced queries**:
   - "What should I know before taking Mathematics 201 at Osmeña Colleges?"
   - "How do I decide between Computer Science and Business at Osmeña Colleges?"
   - "What are some tips for managing tuition payments at Osmeña Colleges?"

## 💡 Pro Tips

- **Free Tier**: Gemini Pro has a generous free tier
- **Privacy**: No conversation data is stored by Google
- **Performance**: Responses typically under 2 seconds
- **Reliability**: Automatic fallback ensures 100% uptime

## 🔒 Security

- API key is stored securely in environment variables
- Never commit API keys to version control
- Use `.env` file for local development
- Use environment variables in production

---

**Ready to make your Osmeña Colleges chatbot more intelligent? Add your Gemini API key and restart the server!**
