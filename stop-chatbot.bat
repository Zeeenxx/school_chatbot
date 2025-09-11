@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Stopping Osmena Colleges Chatbot
echo ========================================

REM Set colors
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "NC=[0m"

echo %YELLOW%Stopping all Node.js processes...%NC%

REM Stop all node processes
taskkill /f /im node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo %GREEN%✅ Chatbot servers stopped successfully%NC%
) else (
    echo %YELLOW%ℹ️  No running chatbot processes found%NC%
)

REM Also try to close any chatbot-related command windows
taskkill /f /fi "WindowTitle eq Osmena Chatbot Backend*" >nul 2>&1
taskkill /f /fi "WindowTitle eq Osmena Chatbot Frontend*" >nul 2>&1

echo.
echo %GREEN%========================================%NC%
echo %GREEN%🛑 CHATBOT STOPPED SUCCESSFULLY%NC%
echo %GREEN%========================================%NC%
echo.
echo All chatbot processes have been terminated.
echo You can now:
echo • Restart the chatbot with %YELLOW%start-chatbot.bat%NC%
echo • Close this window
echo.
pause
