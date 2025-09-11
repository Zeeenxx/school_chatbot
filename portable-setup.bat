@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Osmena Colleges Chatbot Portable Setup
echo ========================================
echo.

REM Set colors for better visibility
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

echo %BLUE%Running system check first...%NC%
call "%~dp0system-check.bat"
if %errorlevel% neq 0 (
    echo %RED%System check failed. Please fix the issues above.%NC%
    pause
    exit /b 1
)

echo.
echo %YELLOW%Starting installation process...%NC%
echo.

REM Create uploads directory if it doesn't exist
if not exist "%~dp0backend\uploads" (
    echo %YELLOW%Creating uploads directory...%NC%
    mkdir "%~dp0backend\uploads"
    echo. > "%~dp0backend\uploads\.gitkeep"
)

REM Clean any existing node_modules and build folders
echo %YELLOW%Cleaning previous installations...%NC%
if exist "%~dp0backend\node_modules" rmdir /s /q "%~dp0backend\node_modules" 2>nul
if exist "%~dp0frontend\node_modules" rmdir /s /q "%~dp0frontend\node_modules" 2>nul
if exist "%~dp0frontend\build" rmdir /s /q "%~dp0frontend\build" 2>nul

echo.
echo %YELLOW%Installing backend dependencies...%NC%
cd /d "%~dp0backend"
call npm install
if %errorlevel% neq 0 (
    echo %RED%❌ Backend installation failed!%NC%
    echo.
    echo Possible solutions:
    echo 1. Check your internet connection
    echo 2. Run as Administrator
    echo 3. Clear npm cache: npm cache clean --force
    echo.
    pause
    exit /b 1
)
echo %GREEN%✅ Backend dependencies installed successfully%NC%

echo.
echo %YELLOW%Installing frontend dependencies...%NC%
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo %RED%❌ Frontend installation failed!%NC%
    echo.
    echo Possible solutions:
    echo 1. Check your internet connection
    echo 2. Run as Administrator
    echo 3. Clear npm cache: npm cache clean --force
    echo.
    pause
    exit /b 1
)
echo %GREEN%✅ Frontend dependencies installed successfully%NC%

echo.
echo %YELLOW%Building frontend for production...%NC%
call npm run build
if %errorlevel% neq 0 (
    echo %YELLOW%⚠️  Build failed, but you can still run in development mode%NC%
) else (
    echo %GREEN%✅ Frontend build completed successfully%NC%
)

REM Create environment file if it doesn't exist
cd /d "%~dp0backend"
if not exist ".env" (
    echo %YELLOW%Creating environment configuration...%NC%
    echo PORT=5000 > .env
    echo NODE_ENV=production >> .env
    echo FRONTEND_URL=http://localhost:3000 >> .env
)

cd /d "%~dp0"

echo.
echo %GREEN%========================================%NC%
echo %GREEN%🎉 SETUP COMPLETED SUCCESSFULLY! 🎉%NC%
echo %GREEN%========================================%NC%
echo.
echo %BLUE%Next steps:%NC%
echo 1. Double-click %YELLOW%start-chatbot.bat%NC% to start the application
echo 2. Open your browser and go to %YELLOW%http://localhost:3000%NC%
echo 3. To stop the application, double-click %YELLOW%stop-chatbot.bat%NC%
echo.
echo %BLUE%Troubleshooting:%NC%
echo • If you get permission errors, run as Administrator
echo • If ports are busy, run stop-chatbot.bat first
echo • Check PORTABLE-README.md for more help
echo.
echo %GREEN%The Osmena Colleges Chatbot is ready to use!%NC%
echo.
pause
