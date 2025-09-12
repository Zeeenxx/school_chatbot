@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Stopping Osmena Colleges Chatbot
echo ========================================

REM Set colors for output messages
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "NC=[0m"

echo %YELLOW%Stopping all Node.js processes...%NC%

REM Forcefully terminate all running Node.js processes.
REM The /f flag ensures the process is terminated without prompting.
REM The /im flag specifies the image name of the process to be terminated.
REM >nul 2>&1 redirects both standard output and standard error to null, so no output is shown.
taskkill /f /im node.exe >nul 2>&1

REM Check the exit code of the taskkill command.
if %errorlevel% equ 0 (
    echo %GREEN%✅ Chatbot servers stopped successfully%NC%
) else (
    echo %YELLOW%ℹ️  No running chatbot processes found%NC%
)

REM Also try to close any chatbot-related command windows by their title.
REM This is useful for closing the terminal windows opened by start-chatbot.bat.
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
