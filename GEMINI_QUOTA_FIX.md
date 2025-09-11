# 🔧 Gemini API Quota Exceeded - Quick Fix Guide

## 🚨 Problem
Your Gemini API has exceeded the daily quota (50 requests per day for free tier).

## ✅ Quick Solutions

### Option 1: Wait (Simplest)
- **Wait 24 hours** for quota to reset
- The chatbot will work with basic school data in the meantime

### Option 2: Get New API Key (5 minutes)
1. **Go to**: [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Sign in** with a different Google account (or create new project)
3. **Click "Create API Key"**
4. **Copy the new key**
5. **Replace in** `backend/.env` file:
   ```
   GEMINI_API_KEY=your_new_api_key_here
   ```
6. **Restart server**: `npm start` in backend folder

### Option 3: Upgrade Plan
- Visit [Google AI Studio](https://makersuite.google.com) 
- Check pricing for higher quotas

## 🔄 Changes Made
- ✅ **Switched from `gemini-1.5-flash` to `gemini-pro`** (higher quota)
- ✅ **Improved error handling** for quota exceeded
- ✅ **Graceful fallback** to school database when AI unavailable

## 🧪 Test Your Fix
Try asking:
- **Database questions**: "What courses are available?" (Should work)
- **AI questions**: "How should I prepare for college?" (Works if quota available)

---
**The chatbot works perfectly even without AI - you get all school information from the database!**
