@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Starting Osmena Colleges Chatbot
echo ========================================

REM Set colors
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Check if setup was run
if not exist "%~dp0backend\node_modules" (
    echo %RED%❌ Backend dependencies not found!%NC%
    echo %YELLOW%Please run portable-setup.bat first%NC%
    pause
    exit /b 1
)

if not exist "%~dp0frontend\node_modules" (
    echo %RED%❌ Frontend dependencies not found!%NC%
    echo %YELLOW%Please run portable-setup.bat first%NC%
    pause
    exit /b 1
)

REM Kill any existing Node processes
echo %YELLOW%Stopping any existing chatbot processes...%NC%
taskkill /f /im node.exe >nul 2>&1

REM Wait a moment
timeout /t 2 /nobreak >nul

echo %YELLOW%Starting backend server...%NC%
start "Osmena Chatbot Backend" cmd /k "cd /d %~dp0backend && echo %GREEN%Backend Server Starting...%NC% && npm start"

echo %YELLOW%Waiting for backend to initialize...%NC%
timeout /t 5 /nobreak >nul

echo %YELLOW%Starting frontend server...%NC%
start "Osmena Chatbot Frontend" cmd /k "cd /d %~dp0frontend && echo %GREEN%Frontend Server Starting...%NC% && npm start"

echo.
echo %GREEN%========================================%NC%
echo %GREEN%🚀 CHATBOT SERVERS ARE STARTING! 🚀%NC%
echo %GREEN%========================================%NC%
echo.
echo %BLUE%Server Information:%NC%
echo • Backend API: %YELLOW%http://localhost:5000%NC%
echo • Frontend App: %YELLOW%http://localhost:3000%NC%
echo.
echo %BLUE%What's happening:%NC%
echo 1. Backend server is starting (may take 10-30 seconds)
echo 2. Frontend server is starting (may take 30-60 seconds)
echo 3. Your browser will automatically open to the chatbot
echo.
echo %YELLOW%⏳ Please wait for both servers to fully start...%NC%
echo %YELLOW%The application will be ready when you see "compiled successfully" messages%NC%
echo.
echo %BLUE%To stop the application:%NC%
echo • Double-click %YELLOW%stop-chatbot.bat%NC%
echo • Or close both command windows
echo.
echo %GREEN%Enjoy using the Osmena Colleges Chatbot!%NC%
echo.
pause
