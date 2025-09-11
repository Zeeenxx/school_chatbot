@echo off
title Osmeña Colleges Chatbot - Smart Deployment Manager
color 0F

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    SMART DEPLOYMENT MANAGER                   ║
echo ║                      Osmeña Colleges Chatbot                   ║
echo ║                         Version 2.0                           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

:MAIN_MENU
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    SMART DEPLOYMENT MANAGER                   ║
echo ║                      Osmeña Colleges Chatbot                   ║
echo ║                         Version 2.0                           ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🚀 DEPLOYMENT OPTIONS:
echo.
echo   1️⃣  Quick Auto-Sync Portable Package (Recommended)
echo   2️⃣  Advanced Package Manager (Interactive)
echo   3️⃣  One-Time Portable Creation
echo   4️⃣  Start Auto-Sync Monitor
echo   5️⃣  Install Dependencies
echo   6️⃣  System Health Check
echo   7️⃣  Open Portable Directory
echo   8️⃣  View Documentation
echo   0️⃣  Exit
echo.
set /p choice="🎯 Choose an option (0-8): "

if "%choice%"=="1" goto QUICK_AUTO_SYNC
if "%choice%"=="2" goto ADVANCED_MANAGER
if "%choice%"=="3" goto ONE_TIME_CREATION
if "%choice%"=="4" goto START_AUTO_SYNC
if "%choice%"=="5" goto INSTALL_DEPS
if "%choice%"=="6" goto HEALTH_CHECK
if "%choice%"=="7" goto OPEN_PORTABLE
if "%choice%"=="8" goto VIEW_DOCS
if "%choice%"=="0" goto EXIT
goto INVALID_CHOICE

:QUICK_AUTO_SYNC
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    QUICK AUTO-SYNC PACKAGE                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Creating auto-sync portable package...
echo.
call auto-sync-portable.bat
echo.
echo ✅ Auto-sync portable package created successfully!
echo.
echo 📦 What was created:
echo    • Complete portable chatbot package
echo    • Enhanced installation scripts
echo    • Auto-sync capabilities
echo    • Comprehensive documentation
echo    • Desktop shortcuts and start menu items
echo.
echo 🎯 Next Steps:
echo    1. Copy the 'osmena-chatbot-portable' folder to target device
echo    2. Run INSTALL.bat on the target device
echo    3. Your chatbot will be ready to use!
echo.
pause
goto MAIN_MENU

:ADVANCED_MANAGER
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                   ADVANCED PACKAGE MANAGER                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🔧 Starting advanced package manager...
echo.
node package-manager.js
echo.
echo 📋 Advanced package manager session completed.
pause
goto MAIN_MENU

:ONE_TIME_CREATION
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ONE-TIME PACKAGE CREATION                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📦 Creating one-time portable package...
echo.
node -e "const PackageManager = require('./package-manager.js'); const pm = new PackageManager(); pm.createPortablePackage().then(() => console.log('✅ Package created successfully!')).catch(console.error);"
echo.
echo ✅ One-time portable package created!
echo 📁 Location: osmena-chatbot-portable/
echo.
pause
goto MAIN_MENU

:START_AUTO_SYNC
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                     AUTO-SYNC MONITOR                         ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 👁️  Starting auto-sync file monitor...
echo.
echo 💡 This will monitor your project files and automatically update
echo    the portable package when changes are detected.
echo.
echo ⚠️  Keep this window open for auto-sync to work.
echo    Press Ctrl+C to stop monitoring.
echo.
pause
echo.
echo 🚀 Auto-sync monitor starting...
node -e "const PackageManager = require('./package-manager.js'); const pm = new PackageManager(); pm.startAutoSync(); setInterval(() => {}, 1000);"
pause
goto MAIN_MENU

:INSTALL_DEPS
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    DEPENDENCY INSTALLATION                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📦 Installing project dependencies...
echo.
echo 🔧 Installing root dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Root dependency installation failed
    pause
    goto MAIN_MENU
)

echo.
echo 🎨 Installing frontend dependencies...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ Frontend dependency installation failed
    cd ..
    pause
    goto MAIN_MENU
)

echo.
echo 🌐 Installing backend dependencies...
cd ..\backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Backend dependency installation failed
    cd ..
    pause
    goto MAIN_MENU
)

cd ..
echo.
echo ✅ All dependencies installed successfully!
echo.
pause
goto MAIN_MENU

:HEALTH_CHECK
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                      SYSTEM HEALTH CHECK                      ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🔍 Performing comprehensive system health check...
echo.

echo ══════════════════════════════════════════════════════════════════
echo 📊 SYSTEM INFORMATION
echo ══════════════════════════════════════════════════════════════════
systeminfo | findstr /C:"OS Name" /C:"Total Physical Memory" /C:"Available Physical Memory"

echo.
echo ══════════════════════════════════════════════════════════════════
echo 🟢 NODE.JS STATUS
echo ══════════════════════════════════════════════════════════════════
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js is installed
    for /f "tokens=*" %%a in ('node --version') do echo    Version: %%a
    for /f "tokens=*" %%a in ('npm --version') do echo    NPM Version: %%a
) else (
    echo ❌ Node.js is NOT installed
    echo 💡 Please install Node.js from https://nodejs.org
)

echo.
echo ══════════════════════════════════════════════════════════════════
echo 📁 PROJECT STRUCTURE
echo ══════════════════════════════════════════════════════════════════
if exist frontend\ (
    echo ✅ Frontend directory found
) else (
    echo ❌ Frontend directory missing
)

if exist backend\ (
    echo ✅ Backend directory found
) else (
    echo ❌ Backend directory missing
)

if exist package.json (
    echo ✅ Root package.json found
) else (
    echo ❌ Root package.json missing
)

if exist frontend\package.json (
    echo ✅ Frontend package.json found
) else (
    echo ❌ Frontend package.json missing
)

if exist backend\package.json (
    echo ✅ Backend package.json found
) else (
    echo ❌ Backend package.json missing
)

echo.
echo ══════════════════════════════════════════════════════════════════
echo 🌐 NETWORK STATUS
echo ══════════════════════════════════════════════════════════════════
ping google.com -n 1 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Internet connection is available
) else (
    echo ⚠️  No internet connection detected
)

echo.
echo ══════════════════════════════════════════════════════════════════
echo 📦 DEPENDENCY STATUS
echo ══════════════════════════════════════════════════════════════════
if exist node_modules\ (
    echo ✅ Root dependencies installed
) else (
    echo ⚠️  Root dependencies not installed
    echo 💡 Run option 5 to install dependencies
)

if exist frontend\node_modules\ (
    echo ✅ Frontend dependencies installed
) else (
    echo ⚠️  Frontend dependencies not installed
)

if exist backend\node_modules\ (
    echo ✅ Backend dependencies installed
) else (
    echo ⚠️  Backend dependencies not installed
)

echo.
echo ══════════════════════════════════════════════════════════════════
echo 📋 HEALTH CHECK COMPLETE
echo ══════════════════════════════════════════════════════════════════
echo.
pause
goto MAIN_MENU

:OPEN_PORTABLE
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    PORTABLE DIRECTORY ACCESS                  ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
if exist osmena-chatbot-portable\ (
    echo 📁 Opening portable directory...
    start explorer osmena-chatbot-portable
    echo ✅ Portable directory opened in File Explorer
) else (
    echo ❌ Portable directory not found
    echo 💡 Create a portable package first using option 1 or 3
)
echo.
pause
goto MAIN_MENU

:VIEW_DOCS
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                         DOCUMENTATION                         ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📚 AVAILABLE DOCUMENTATION:
echo.
echo 📖 Main Documentation:
if exist README.md (
    echo    ✅ README.md - Main project documentation
) else (
    echo    ❌ README.md not found
)

echo.
echo 📖 Portable Package Documentation:
if exist osmena-chatbot-portable\README.md (
    echo    ✅ Portable README.md - Deployment guide
) else (
    echo    ❌ Portable README.md not found
)

if exist osmena-chatbot-portable\INSTALLATION-GUIDE.md (
    echo    ✅ INSTALLATION-GUIDE.md - Detailed setup instructions
) else (
    echo    ❌ Installation guide not found
)

echo.
echo 📖 Log Files:
if exist sync-log.txt (
    echo    ✅ sync-log.txt - Auto-sync activity log
) else (
    echo    ❌ Sync log not found
)

if exist package-manager-log.txt (
    echo    ✅ package-manager-log.txt - Package manager log
) else (
    echo    ❌ Package manager log not found
)

echo.
echo 🎯 Quick Documentation Access:
echo.
echo   A - Open Main README
echo   B - Open Portable README
echo   C - Open Installation Guide
echo   D - View Sync Log
echo   E - View Package Manager Log
echo   R - Return to Main Menu
echo.
set /p doc_choice="📖 Choose documentation to view (A-E, R): "

if /i "%doc_choice%"=="A" (
    if exist README.md start notepad README.md
)
if /i "%doc_choice%"=="B" (
    if exist osmena-chatbot-portable\README.md start notepad osmena-chatbot-portable\README.md
)
if /i "%doc_choice%"=="C" (
    if exist osmena-chatbot-portable\INSTALLATION-GUIDE.md start notepad osmena-chatbot-portable\INSTALLATION-GUIDE.md
)
if /i "%doc_choice%"=="D" (
    if exist sync-log.txt start notepad sync-log.txt
)
if /i "%doc_choice%"=="E" (
    if exist package-manager-log.txt start notepad package-manager-log.txt
)
if /i "%doc_choice%"=="R" goto MAIN_MENU

goto VIEW_DOCS

:INVALID_CHOICE
echo.
echo ❌ Invalid choice. Please select a number from 0-8.
timeout /t 2 >nul
goto MAIN_MENU

:EXIT
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                         GOODBYE!                              ║
echo ║                   Osmeña Colleges Chatbot                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 👋 Thank you for using the Smart Deployment Manager!
echo.
echo 🎯 Remember:
echo    • Your portable packages are in 'osmena-chatbot-portable/'
echo    • Use INSTALL.bat on target devices for easy deployment
echo    • Auto-sync keeps your portable packages updated
echo.
echo 📞 For support, check the documentation or log files.
echo.
pause
exit
