@echo off
echo ========================================
echo Osmena Colleges Chatbot - Quick Test
echo ========================================
echo.

REM Test if both servers are running
echo Testing backend connection...
curl -s http://localhost:5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend server is running
) else (
    echo ❌ Backend server is not responding
    echo Please check if start-chatbot.bat was run successfully
)

echo.
echo Testing frontend connection...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend server is running
) else (
    echo ❌ Frontend server is not responding
    echo Please check if start-chatbot.bat was run successfully
)

echo.
echo Opening chatbot in browser...
start http://localhost:3000

echo.
echo If the chatbot doesn't open automatically:
echo 1. Open your web browser
echo 2. Go to: http://localhost:3000
echo.
pause
