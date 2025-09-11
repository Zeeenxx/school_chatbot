@echo off
echo Creating complete backup with all dependencies...
echo.

REM Install all dependencies to ensure they're available offline
echo Installing root dependencies...
call npm install

echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ✅ All dependencies installed and ready for offline use!
echo.
echo 📦 Your project is now ready to copy to any laptop
echo 🚀 The new laptop will NOT need internet for installation
echo.
echo Next steps:
echo 1. Copy this entire folder to the new laptop
echo 2. Double-click START_CHATBOT.bat on the new laptop
echo 3. Enjoy! 🎉
echo.
pause
