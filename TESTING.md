# 🧪 Testing Your Gemini AI Integration

## Quick Test Commands

After adding your Gemini API key to `backend/.env`, test these queries:

### 1. Basic Structured Queries (Database)
```bash
# These will use the database responses (fast, structured)
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What courses are available?"}'

curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How much is tuition?"}'
```

### 2. AI-Enhanced Queries (Gemini)
```bash
# These will use Gemini AI (natural, conversational)
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How can I prepare for Computer Science 101?"}'

curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What advice do you have for managing college expenses?"}'
```

## PowerShell Commands (Windows)

```powershell
# Test structured query
Invoke-RestMethod -Uri "http://localhost:5000/api/chat" -Method POST -ContentType "application/json" -Body '{"message": "What courses are available?"}'

# Test AI query (requires Gemini API key)
Invoke-RestMethod -Uri "http://localhost:5000/api/chat" -Method POST -ContentType "application/json" -Body '{"message": "How should I prepare for college?"}'
```

## Expected Behaviors

### Without Gemini API Key
- **Structured queries**: Return formatted database responses
- **General questions**: Return fallback message with suggestions

### With Gemini API Key
- **Structured queries**: Still return database responses (faster)
- **General questions**: Return intelligent, conversational AI responses
- **Complex queries**: AI analyzes school data and provides contextual advice

## Sample AI-Enhanced Responses

When Gemini is enabled, you might get responses like:

**Query**: "How can I prepare for Computer Science 101?"
**AI Response**: "Based on the course information, Computer Science 101 with Dr. Smith is an introductory course with no prerequisites. Here are some ways to prepare: 1) Familiarize yourself with basic programming concepts, 2) Review fundamental math skills, 3) Consider online coding tutorials to get started..."

**Query**: "I'm worried about tuition costs, what should I do?"
**AI Response**: "I understand your concern about tuition costs. Looking at our financial aid options, we have several scholarships available including Academic Excellence (up to $2,000) and Need-Based Aid (up to $1,500). We also offer flexible payment plans..."

## Troubleshooting

### If AI responses aren't working:
1. ✅ Check your API key in `backend/.env`
2. ✅ Restart the server after adding the key
3. ✅ Check server logs for errors
4. ✅ Verify internet connection
5. ✅ Try a simple query first

### Common Issues:
- **Invalid API key**: Check the key format and permissions
- **Rate limits**: Gemini Pro has generous limits, rarely an issue
- **Network errors**: Check internet connection and firewall

---

**Pro Tip**: Start with one test query to ensure everything is working, then experiment with more complex, conversational questions to see the AI in action!
