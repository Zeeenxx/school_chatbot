#!/bin/bash

echo "========================================"
echo "   School Chatbot - Vercel Deployment"
echo "========================================"
echo

echo "[1/5] Installing Vercel CLI..."
npm install -g vercel
if [ $? -ne 0 ]; then
    echo "Error: Failed to install Vercel CLI"
    exit 1
fi

echo
echo "[2/5] Checking if you're logged in to Vercel..."
vercel whoami >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Please login to Vercel first:"
    vercel login
    if [ $? -ne 0 ]; then
        echo "Error: Failed to login to Vercel"
        exit 1
    fi
fi

echo
echo "[3/5] Building frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Frontend build failed"
    exit 1
fi
cd ..

echo
echo "[4/5] Deploying to Vercel..."
vercel --prod
if [ $? -ne 0 ]; then
    echo "Error: Deployment failed"
    exit 1
fi

echo
echo "[5/5] Deployment complete!"
echo
echo "Next steps:"
echo "1. Go to your Vercel dashboard"
echo "2. Set up environment variables:"
echo "   - GEMINI_API_KEY"
echo "   - JWT_SECRET"
echo "   - NODE_ENV=production"
echo "3. Test your deployed application"
echo
echo "For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md"
echo
