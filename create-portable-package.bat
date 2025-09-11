@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Osmena Colleges Chatbot Package Creator
echo ========================================
echo.

set "source_dir=%~dp0"
set "package_name=osmena-chatbot-portable"
set "dest_dir=%source_dir%%package_name%"

echo Creating portable package...
echo Source: %source_dir%
echo Destination: %dest_dir%
echo.

REM Create destination directory
if exist "%dest_dir%" (
    echo Removing existing package directory...
    rmdir /s /q "%dest_dir%"
)
mkdir "%dest_dir%"

echo Copying project files...

REM Create exclude list first
echo Creating exclusion list...
echo node_modules > "%source_dir%exclude-list.txt"
echo .git >> "%source_dir%exclude-list.txt"
echo build >> "%source_dir%exclude-list.txt"
echo dist >> "%source_dir%exclude-list.txt"
echo .env >> "%source_dir%exclude-list.txt"
echo *.log >> "%source_dir%exclude-list.txt"

REM Copy main directories and files
echo • Copying frontend...
xcopy "%source_dir%frontend" "%dest_dir%\frontend\" /E /I /H /Y /Q
echo • Copying backend...
xcopy "%source_dir%backend" "%dest_dir%\backend\" /E /I /H /Y /Q

REM Copy root files
echo • Copying setup files...
copy "%source_dir%*.md" "%dest_dir%\" >nul 2>&1
copy "%source_dir%*.json" "%dest_dir%\" >nul 2>&1
copy "%source_dir%*.bat" "%dest_dir%\" >nul 2>&1
copy "%source_dir%.gitignore" "%dest_dir%\" >nul 2>&1

REM Remove unwanted directories from copy
echo • Cleaning unwanted files...
if exist "%dest_dir%\frontend\node_modules" (
    echo   - Removing frontend node_modules...
    rmdir /s /q "%dest_dir%\frontend\node_modules"
)
if exist "%dest_dir%\backend\node_modules" (
    echo   - Removing backend node_modules...
    rmdir /s /q "%dest_dir%\backend\node_modules"
)
if exist "%dest_dir%\frontend\build" (
    echo   - Removing frontend build...
    rmdir /s /q "%dest_dir%\frontend\build"
)
if exist "%dest_dir%\.git" (
    echo   - Removing .git directory...
    rmdir /s /q "%dest_dir%\.git"
)

REM Ensure uploads directory exists
if not exist "%dest_dir%\backend\uploads" mkdir "%dest_dir%\backend\uploads"
echo. > "%dest_dir%\backend\uploads\.gitkeep"

REM Create package verification file
echo.
echo Creating package verification...
echo OSMENA_CHATBOT_PACKAGE_VERSION=1.0 > "%dest_dir%\package-info.txt"
echo CREATED_DATE=%date% %time% >> "%dest_dir%\package-info.txt"
echo SOURCE_COMPUTER=%computername% >> "%dest_dir%\package-info.txt"
echo PACKAGED_BY=%username% >> "%dest_dir%\package-info.txt"
echo. >> "%dest_dir%\package-info.txt"
echo === INSTALLATION INSTRUCTIONS === >> "%dest_dir%\package-info.txt"
echo 1. Copy this entire folder to target computer >> "%dest_dir%\package-info.txt"
echo 2. Install Node.js 16+ from https://nodejs.org/ >> "%dest_dir%\package-info.txt"
echo 3. Run system-check.bat to verify system >> "%dest_dir%\package-info.txt"
echo 4. Run portable-setup.bat to install dependencies >> "%dest_dir%\package-info.txt"
echo 5. Run start-chatbot.bat to start the application >> "%dest_dir%\package-info.txt"
echo 6. Open browser to http://localhost:3000 >> "%dest_dir%\package-info.txt"

REM Create a comprehensive README for the package
echo # OSMENA COLLEGES CHATBOT - PORTABLE PACKAGE > "%dest_dir%\INSTALLATION-GUIDE.md"
echo. >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo ## 📦 Package Contents >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo - Complete source code (frontend + backend) >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo - Automated setup scripts >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo - All necessary configuration files >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo - Assets and images >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo. >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo ## 🚀 Quick Start Guide >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo 1. **Install Node.js** from https://nodejs.org/ (version 16 or higher) >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo 2. **Run system-check.bat** - Verifies your system is ready >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo 3. **Run portable-setup.bat** - Installs all dependencies automatically >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo 4. **Run start-chatbot.bat** - Starts both servers >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo 5. **Open browser** to http://localhost:3000 >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo. >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo ## 🛠️ Available Commands >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo - **system-check.bat** - Check system requirements >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo - **portable-setup.bat** - Install dependencies >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo - **start-chatbot.bat** - Start the application >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo - **stop-chatbot.bat** - Stop the application >> "%dest_dir%\INSTALLATION-GUIDE.md"
echo - **test-chatbot.bat** - Test if servers are running >> "%dest_dir%\INSTALLATION-GUIDE.md"

REM Clean up
del "%source_dir%exclude-list.txt" >nul 2>&1

echo.
echo ========================================
echo ✅ PACKAGE CREATED SUCCESSFULLY!
echo ========================================
echo.
echo 📁 Package location: %dest_dir%
echo.
echo 📋 What's included:
echo • ✅ Complete source code
echo • ✅ Automated setup scripts
echo • ✅ System compatibility checker
echo • ✅ Detailed installation guide
echo • ✅ All necessary configuration files
echo.
echo 🎯 Ready to copy to any Windows computer!
echo.
echo 📊 Package statistics:
for /f "tokens=3" %%a in ('dir "%dest_dir%" /-c ^| find "File(s)"') do echo • Total files: %%a
for /f "tokens=1,2" %%a in ('dir "%dest_dir%" /-c ^| find "bytes"') do echo • Total size: %%a %%b
echo.
echo 🚀 Next steps:
echo 1. Copy the '%package_name%' folder to target computer
echo 2. Follow INSTALLATION-GUIDE.md on the target computer
echo.
pause
