@echo off
echo ========================================
echo Osmena Colleges Chatbot - Simple Packager
echo ========================================
echo.

REM Get the current directory
set "source_dir=%~dp0"
set "package_name=osmena-chatbot-portable"
set "dest_dir=%source_dir%%package_name%"

echo Creating portable package...
echo Source: %source_dir%
echo Destination: %dest_dir%
echo.

REM Remove existing package if it exists
if exist "%dest_dir%" (
    echo Removing existing package...
    rmdir /s /q "%dest_dir%" 2>nul
)

REM Create destination directory
echo Creating package directory...
mkdir "%dest_dir%"

REM Copy frontend directory
if exist "%source_dir%frontend" (
    echo Copying frontend...
    xcopy "%source_dir%frontend" "%dest_dir%\frontend\" /E /I /Y /Q
    echo Frontend copied.
) else (
    echo WARNING: Frontend directory not found!
)

REM Copy backend directory
if exist "%source_dir%backend" (
    echo Copying backend...
    xcopy "%source_dir%backend" "%dest_dir%\backend\" /E /I /Y /Q
    echo Backend copied.
) else (
    echo WARNING: Backend directory not found!
)

REM Copy batch files
echo Copying setup files...
copy "%source_dir%*.bat" "%dest_dir%\" >nul 2>&1
copy "%source_dir%*.md" "%dest_dir%\" >nul 2>&1

REM Remove node_modules if they exist
if exist "%dest_dir%\frontend\node_modules" (
    echo Removing frontend node_modules...
    rmdir /s /q "%dest_dir%\frontend\node_modules"
)

if exist "%dest_dir%\backend\node_modules" (
    echo Removing backend node_modules...
    rmdir /s /q "%dest_dir%\backend\node_modules"
)

REM Create uploads directory
if not exist "%dest_dir%\backend\uploads" (
    mkdir "%dest_dir%\backend\uploads"
    echo. > "%dest_dir%\backend\uploads\.gitkeep"
)

REM Create simple instructions file
echo Creating instructions...
echo OSMENA COLLEGES CHATBOT - PORTABLE PACKAGE > "%dest_dir%\QUICK-START.txt"
echo. >> "%dest_dir%\QUICK-START.txt"
echo 1. Install Node.js from https://nodejs.org/ >> "%dest_dir%\QUICK-START.txt"
echo 2. Run system-check.bat >> "%dest_dir%\QUICK-START.txt"
echo 3. Run portable-setup.bat >> "%dest_dir%\QUICK-START.txt"
echo 4. Run start-chatbot.bat >> "%dest_dir%\QUICK-START.txt"
echo 5. Open browser to http://localhost:3000 >> "%dest_dir%\QUICK-START.txt"

echo.
echo ========================================
echo ✅ PACKAGE CREATED SUCCESSFULLY!
echo ========================================
echo.
echo Package location: %dest_dir%
echo.
echo Contents:
dir "%dest_dir%" /B

echo.
echo Ready to copy to other computers!
echo.
pause
