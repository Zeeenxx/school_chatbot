@echo off
echo ========================================
echo    School Chatbot - Vercel Deployment
echo ========================================
echo.

echo [1/5] Installing Vercel CLI...
npm install -g vercel
if %errorlevel% neq 0 (
    echo Error: Failed to install Vercel CLI
    pause
    exit /b 1
)

echo.
echo [2/5] Checking if you're logged in to Vercel...
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo Please login to Vercel first:
    vercel login
    if %errorlevel% neq 0 (
        echo Error: Failed to login to Vercel
        pause
        exit /b 1
    )
)

echo.
echo [3/5] Building frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Error: Frontend build failed
    pause
    exit /b 1
)
cd ..

echo.
echo [4/5] Deploying to Vercel...
vercel --prod
if %errorlevel% neq 0 (
    echo Error: Deployment failed
    pause
    exit /b 1
)

echo.
echo [5/5] Deployment complete!
echo.
echo Next steps:
echo 1. Go to your Vercel dashboard
echo 2. Set up environment variables:
echo    - GEMINI_API_KEY
echo    - JWT_SECRET
echo    - NODE_ENV=production
echo 3. Test your deployed application
echo.
echo For detailed instructions, see VERCEL_DEPLOYMENT_GUIDE.md
echo.
pause
