@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Osmena Colleges Chatbot - System Check
echo ========================================
echo.

REM Set colors for better visibility
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "NC=[0m"

echo Checking system requirements...
echo.

REM Check if Node.js is installed
echo %YELLOW%Checking Node.js installation...%NC%
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%❌ ERROR: Node.js is not installed!%NC%
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Recommended version: Node.js 18 LTS or higher
    echo.
    echo After installing Node.js:
    echo 1. Restart this computer
    echo 2. Run this script again
    echo.
    pause
    exit /b 1
) else (
    echo %GREEN%✅ Node.js is installed%NC%
    for /f "tokens=*" %%i in ('node --version') do echo    Version: %%i
)

REM Check npm
echo %YELLOW%Checking npm installation...%NC%
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo %RED%❌ ERROR: npm is not available!%NC%
    echo Please reinstall Node.js from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo %GREEN%✅ npm is available%NC%
    for /f "tokens=*" %%i in ('npm --version') do echo    Version: %%i
)

REM Check if ports are available
echo %YELLOW%Checking port availability...%NC%
netstat -an | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo %YELLOW%⚠️  Warning: Port 3000 is in use%NC%
    echo    You may need to stop other applications using this port
) else (
    echo %GREEN%✅ Port 3000 is available%NC%
)

netstat -an | findstr :5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo %YELLOW%⚠️  Warning: Port 5000 is in use%NC%
    echo    You may need to stop other applications using this port
) else (
    echo %GREEN%✅ Port 5000 is available%NC%
)

REM Check project structure
echo %YELLOW%Checking project files...%NC%
if not exist "%~dp0frontend" (
    echo %RED%❌ ERROR: frontend folder missing!%NC%
    goto :missing_files
)
if not exist "%~dp0backend" (
    echo %RED%❌ ERROR: backend folder missing!%NC%
    goto :missing_files
)
if not exist "%~dp0frontend\package.json" (
    echo %RED%❌ ERROR: frontend\package.json missing!%NC%
    goto :missing_files
)
if not exist "%~dp0backend\package.json" (
    echo %RED%❌ ERROR: backend\package.json missing!%NC%
    goto :missing_files
)

echo %GREEN%✅ All project files are present%NC%

echo.
echo %GREEN%========================================%NC%
echo %GREEN%✅ System check completed successfully!%NC%
echo %GREEN%========================================%NC%
echo.
echo Your system is ready for the Osmena Colleges Chatbot.
echo You can now run: portable-setup.bat
echo.
pause
exit /b 0

:missing_files
echo.
echo %RED%========================================%NC%
echo %RED%❌ PROJECT FILES MISSING%NC%
echo %RED%========================================%NC%
echo.
echo Please ensure you have copied the complete school_chatbot folder
echo including all subdirectories and files.
echo.
echo Required structure:
echo school_chatbot\
echo ├── frontend\
echo │   ├── src\
echo │   ├── public\
echo │   └── package.json
echo ├── backend\
echo │   ├── server.js
echo │   └── package.json
echo └── [setup files]
echo.
pause
exit /b 1
