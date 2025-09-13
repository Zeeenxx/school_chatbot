# Vercel Deployment Guide for School Chatbot

This guide will help you deploy your school chatbot project to Vercel, including both the React frontend and Node.js backend as serverless functions.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Environment Variables**: You'll need your Gemini API key and other secrets

## Project Structure

```
school_chatbot/
├── frontend/          # React frontend
├── backend/           # Node.js backend (for reference)
├── api/              # Vercel serverless functions
│   ├── index.js      # Main API handler
│   └── package.json  # API dependencies
├── vercel.json       # Vercel configuration
└── VERCEL_DEPLOYMENT_GUIDE.md
```

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

## Step 3: Configure Environment Variables

You'll need to set these environment variables in Vercel:

### Required Environment Variables:
- `GEMINI_API_KEY`: Your Google Gemini API key
- `JWT_SECRET`: A secret key for JWT tokens
- `FRONTEND_URL`: Your Vercel frontend URL (will be set automatically)

### Optional Environment Variables:
- `NODE_ENV`: Set to "production"
- `DATABASE_URL`: If using external database (SQLite is included)

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. **Initialize Vercel project:**
   ```bash
   vercel
   ```

2. **Follow the prompts:**
   - Link to existing project: No
   - Project name: school-chatbot (or your preferred name)
   - Directory: . (current directory)
   - Override settings: No

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Other
   - **Root Directory**: Leave empty (uses root)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/build`

## Step 5: Configure Environment Variables in Vercel

1. Go to your project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add the following variables:

```
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_jwt_secret_here
NODE_ENV=production
```

## Step 6: Update Frontend Configuration

Update your frontend to use the Vercel API URL. In your `frontend/src/services/apiService.ts`:

```typescript
private getBaseURL(): string {
  // Use Vercel API URL in production
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_API_URL || window.location.origin;
  }
  return process.env.REACT_APP_API_URL || window.location.origin;
}
```

## Step 7: Update Socket.IO Configuration

In your `frontend/src/components/ChatBot.tsx`, update the Socket.IO connection:

```typescript
useEffect(() => {
  const serverUrl = process.env.REACT_APP_API_URL || 
                   (process.env.NODE_ENV === 'production' 
                     ? window.location.origin 
                     : `http://${window.location.hostname}:5000`);
  
  const newSocket = io(serverUrl, {
    transports: ['websocket', 'polling'],
    timeout: 20000,
    forceNew: true
  });
  // ... rest of your socket logic
}, []);
```

## Step 8: Deploy and Test

1. **Deploy your changes:**
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Vercel will automatically deploy** when you push to your main branch

3. **Test your deployment:**
   - Visit your Vercel URL
   - Test the chatbot functionality
   - Test file uploads
   - Test admin features

## Important Notes

### Database Considerations
- SQLite files are read-only in Vercel serverless functions
- Consider using a cloud database (PostgreSQL, MongoDB) for production
- Current setup includes SQLite for development/testing

### File Uploads
- File uploads are stored temporarily in Vercel's serverless environment
- Consider using cloud storage (AWS S3, Cloudinary) for persistent file storage
- Current setup stores files temporarily

### Socket.IO Limitations
- Vercel serverless functions have limitations with WebSocket connections
- Consider using Vercel's real-time features or external services for real-time chat
- Current setup may have limitations with real-time features

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check that all dependencies are in package.json
   - Ensure TypeScript compilation passes
   - Check Vercel build logs

2. **API Errors:**
   - Verify environment variables are set
   - Check API function logs in Vercel dashboard
   - Ensure CORS is properly configured

3. **Frontend Issues:**
   - Verify REACT_APP_API_URL is set correctly
   - Check browser console for errors
   - Ensure all assets are properly referenced

### Getting Help:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- View build logs in Vercel dashboard
- Check function logs for API issues

## Next Steps

1. **Set up a production database** (PostgreSQL recommended)
2. **Configure cloud storage** for file uploads
3. **Set up monitoring** and error tracking
4. **Configure custom domain** if needed
5. **Set up CI/CD** for automatic deployments

## Alternative: Hybrid Deployment

If you encounter issues with serverless functions, consider:
- Frontend on Vercel
- Backend on Render, Railway, or Heroku
- Use environment variables to connect them

This hybrid approach gives you more control over your backend while still benefiting from Vercel's excellent frontend hosting.
