# 🎓 Osmeña Colleges Chatbot - Portable Installation

## 📋 **Quick Start Guide (No Configuration Needed!)**

### **Step 1: Prerequisites (One-time setup)**
1. **Install Node.js** (if not already installed):
   - Download from: https://nodejs.org/
   - Choose the LTS version
   - Install with default settings

### **Step 2: Run the Chatbot**
**Option A: Automatic Setup (Recommended)**
1. Double-click `START_CHATBOT.bat`
2. Wait for setup to complete
3. Browser will open automatically at http://localhost:3000

**Option B: Manual Setup**
1. Open Command Prompt or PowerShell
2. Navigate to this folder: `cd path\to\school_chatbot`
3. Run: `node setup.js` (first time only)
4. Run: `npm run dev`
5. Open http://localhost:3000 in your browser

### **Step 3: Optional - Add AI Features**
1. Get a free API key from: https://makersuite.google.com/app/apikey
2. Edit `backend\.env` file
3. Replace `your_gemini_api_key_here` with your actual key
4. Restart the chatbot

---

## 🔧 **Troubleshooting**

### **If you get "Node.js not found":**
- Install Node.js from https://nodejs.org/
- Restart your computer
- Try again

### **If you get "Port already in use":**
- Close any other running applications on ports 3000 or 5000
- Or restart your computer

### **If dependencies fail to install:**
- Make sure you have internet connection
- Try running as Administrator
- Delete `node_modules` folders and try again

---

## 📁 **What's Included**

✅ **Complete source code** - All React and Node.js files  
✅ **All dependencies** - No need to install anything else  
✅ **Sample data** - School courses, staff, facilities pre-loaded  
✅ **File upload support** - PDF, Word, Excel, PowerPoint  
✅ **Text-to-speech** - Built-in voice features  
✅ **Staff profiles** - Complete with placeholder images  
✅ **AI integration** - Ready for Gemini API (optional)  
✅ **Auto-setup scripts** - One-click installation  

---

## 🚀 **Features**

- **Real-time Chat** - Instant messaging interface
- **School Information** - Courses, tuition, facilities, contacts
- **File Upload** - Analyze documents with AI
- **Text-to-Speech** - Voice responses
- **Staff Directory** - Complete staff information with photos
- **Responsive Design** - Works on desktop, tablet, mobile
- **AI Powered** - Optional Gemini AI integration
- **Easy Setup** - No technical knowledge required

---

## 📞 **Support**

If you need help:
1. Check the troubleshooting section above
2. Make sure Node.js is properly installed
3. Ensure you have internet connection for initial setup
4. Try running as Administrator if you get permission errors

---

## 🔄 **Updates**

To update the chatbot:
1. Replace all files with the new version
2. Keep your `backend\.env` file (contains your API key)
3. Run `START_CHATBOT.bat` again

---

**Built with ❤️ for Osmeña Colleges**
