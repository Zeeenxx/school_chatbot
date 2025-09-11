@echo off
title Osmena Colleges Chatbot
color 0A

echo.
echo  ===================================
echo   OSMENA COLLEGES CHATBOT
echo  ===================================
echo.
echo  Starting servers...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

echo.
echo Dependencies ready!
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak > nul

REM Open browser
start http://localhost:3000

echo.
echo Starting chatbot servers...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo.

REM Start the development servers
npm run dev

echo.
echo Servers stopped.
pause
