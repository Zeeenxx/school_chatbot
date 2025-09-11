@echo off
title Osmeña Colleges Chatbot - Final Portable Package Creator
color 0A

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║              OSMEÑA COLLEGES CHATBOT FINAL CREATOR             ║
echo ║                   Portable Package Creator                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

:: Set variables
set SOURCE_DIR=%~dp0
set PORTABLE_DIR=%SOURCE_DIR%osmena-chatbot-portable

echo 🚀 Creating final portable package...

:: Remove old portable directory if it exists
if exist "%PORTABLE_DIR%" (
    echo 🗑️  Removing old portable package...
    rmdir /s /q "%PORTABLE_DIR%" 2>nul
)

:: Create new portable directory
mkdir "%PORTABLE_DIR%" 2>nul

echo 📂 Copying project files...

:: Copy frontend
echo    • Frontend files...
xcopy "%SOURCE_DIR%frontend" "%PORTABLE_DIR%\frontend" /E /I /Y /Q >nul 2>&1
echo      ✅ Frontend copied

:: Copy backend
echo    • Backend files...
xcopy "%SOURCE_DIR%backend" "%PORTABLE_DIR%\backend" /E /I /Y /Q >nul 2>&1
echo      ✅ Backend copied

:: Copy important root files
echo    • Configuration files...
if exist "%SOURCE_DIR%package.json" copy "%SOURCE_DIR%package.json" "%PORTABLE_DIR%\" >nul 2>&1
if exist "%SOURCE_DIR%README.md" copy "%SOURCE_DIR%README.md" "%PORTABLE_DIR%\" >nul 2>&1

echo 🛠️  Creating installation scripts...

:: Create INSTALL.bat
(
echo @echo off
echo title Osmeña Colleges Chatbot - Quick Install
echo color 0B
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                     QUICK INSTALLER                           ║
echo ║                   Osmeña Colleges Chatbot                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🔍 Checking system requirements...
echo.
echo Checking Node.js...
node --version ^>nul 2^>^&1
if %%errorlevel%% neq 0 ^(
    echo ❌ Node.js not found!
    echo 📥 Please install Node.js from https://nodejs.org
    echo    Choose the LTS version for Windows
    pause
    exit /b 1
^)
echo ✅ Node.js found
echo.
echo 📦 Installing backend dependencies...
cd backend
npm install --production
if %%errorlevel%% neq 0 ^(
    echo ❌ Backend installation failed
    pause
    exit /b 1
^)
echo.
echo 🎨 Installing frontend dependencies...
cd ../frontend
npm install --production
if %%errorlevel%% neq 0 ^(
    echo ❌ Frontend installation failed
    pause
    exit /b 1
^)
echo.
cd ..
echo ✅ Installation completed successfully!
echo.
echo 🚀 To start the chatbot, run: start-chatbot.bat
pause
) > "%PORTABLE_DIR%\INSTALL.bat"

:: Create start-chatbot.bat
(
echo @echo off
echo title Osmeña Colleges Chatbot - Production Start
echo color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    CHATBOT STARTUP                            ║
echo ║                   Osmeña Colleges Chatbot                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Starting Osmeña Colleges Chatbot...
echo.
echo Checking Node.js...
node --version ^>nul 2^>^&1
if %%errorlevel%% neq 0 ^(
    echo ❌ Node.js not found! Please run INSTALL.bat first.
    pause
    exit /b 1
^)
echo.
echo 🛑 Stopping any existing processes...
taskkill /F /IM node.exe ^>nul 2^>^&1
timeout /t 2 ^>nul
echo.
echo 🌐 Starting backend server...
start "Chatbot Backend" cmd /c "cd backend && npm start"
timeout /t 5 ^>nul
echo.
echo 🎨 Starting frontend server...
start "Chatbot Frontend" cmd /c "cd frontend && npm start"
timeout /t 10 ^>nul
echo.
echo ✅ Chatbot is starting!
echo 🌐 Local access: http://localhost:3000
echo 📱 For mobile access, check the backend window for your IP
echo.
echo 🎯 Opening chatbot in browser...
start http://localhost:3000
echo.
echo 💡 Keep this window open. Close it to stop the servers.
pause
) > "%PORTABLE_DIR%\start-chatbot.bat"

:: Create stop-chatbot.bat
(
echo @echo off
echo title Osmeña Colleges Chatbot - Stop
echo color 0C
echo.
echo 🛑 Stopping Osmeña Colleges Chatbot...
taskkill /F /IM node.exe ^>nul 2^>^&1
echo ✅ Chatbot stopped successfully!
pause
) > "%PORTABLE_DIR%\stop-chatbot.bat"

:: Create README for portable package
(
echo # Osmeña Colleges Chatbot - Portable Edition
echo.
echo ## 🚀 Quick Start
echo.
echo 1. **Install**: Double-click `INSTALL.bat`
echo 2. **Start**: Double-click `start-chatbot.bat`
echo 3. **Access**: Open http://localhost:3000 in your browser
echo 4. **Stop**: Double-click `stop-chatbot.bat` when done
echo.
echo ## 📋 System Requirements
echo.
echo - Windows 10/11 ^(64-bit^)
echo - Node.js 18+ ^(download from https://nodejs.org^)
echo - 4GB RAM minimum
echo - Internet connection for AI features
echo.
echo ## 🌐 Mobile Access
echo.
echo 1. Find your computer's IP address ^(shown during startup^)
echo 2. Connect mobile device to same WiFi network
echo 3. Open browser on mobile: http://YOUR-IP:3000
echo.
echo ## 🔧 Troubleshooting
echo.
echo **Node.js not found**: Install from https://nodejs.org
echo **Port in use**: Run `stop-chatbot.bat` then `start-chatbot.bat`
echo **Dependencies fail**: Ensure internet connection and try again
echo.
echo ## 📱 Features
echo.
echo - AI chatbot with course information
echo - Campus facilities and services
echo - Staff directory
echo - Financial aid information
echo - File upload and analysis
echo - Mobile-responsive design
echo.
echo ---
echo **Osmeña Colleges Chatbot** - Portable Edition
echo Generated: %date% %time%
) > "%PORTABLE_DIR%\README.md"

echo.
echo ✅ Final portable package created successfully!
echo 📁 Location: %PORTABLE_DIR%
echo.
echo 📦 Package Contents:
echo    ✅ Complete chatbot application
echo    ✅ INSTALL.bat - One-click installer
echo    ✅ start-chatbot.bat - Application launcher
echo    ✅ stop-chatbot.bat - Safe shutdown
echo    ✅ README.md - User documentation
echo.
echo 🎯 To deploy on another device:
echo    1. Copy the 'osmena-chatbot-portable' folder
echo    2. Run 'INSTALL.bat' on the target device
echo    3. Run 'start-chatbot.bat' to launch
echo.
pause
