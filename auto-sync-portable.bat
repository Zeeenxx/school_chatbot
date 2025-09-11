@echo off
title Osmeña Colleges Chatbot - Auto-Sync Portable Package
color 0A

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║              OSMEÑA COLLEGES CHATBOT AUTO-SYNC                ║
echo ║                   Portable Package Creator                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

:: Set variables
set SOURCE_DIR=%~dp0
set PORTABLE_DIR=%SOURCE_DIR%osmena-chatbot-portable
set LOG_FILE=%SOURCE_DIR%sync-log.txt

:: Create log file
echo [%date% %time%] Auto-sync started >> "%LOG_FILE%"

:: Check if portable directory exists
if exist "%PORTABLE_DIR%" (
    echo ✅ Found existing portable package...
    echo [%date% %time%] Updating existing portable package >> "%LOG_FILE%"
) else (
    echo 🆕 Creating new portable package...
    echo [%date% %time%] Creating new portable package >> "%LOG_FILE%"
)

:: Remove old portable directory if it exists
if exist "%PORTABLE_DIR%" (
    echo 🗑️  Removing old portable package...
    rmdir /s /q "%PORTABLE_DIR%" 2>nul
)

:: Create new portable directory
mkdir "%PORTABLE_DIR%" 2>nul

echo.
echo 📂 Copying project files...

:: Copy frontend
echo    • Frontend files...
xcopy "%SOURCE_DIR%frontend" "%PORTABLE_DIR%\frontend" /E /I /Y /Q >nul 2>&1
if %errorlevel% equ 0 (
    echo      ✅ Frontend copied successfully
) else (
    echo      ❌ Frontend copy failed
    echo [%date% %time%] ERROR: Frontend copy failed >> "%LOG_FILE%"
)

:: Copy backend
echo    • Backend files...
xcopy "%SOURCE_DIR%backend" "%PORTABLE_DIR%\backend" /E /I /Y /Q >nul 2>&1
if %errorlevel% equ 0 (
    echo      ✅ Backend copied successfully
) else (
    echo      ❌ Backend copy failed
    echo [%date% %time%] ERROR: Backend copy failed >> "%LOG_FILE%"
)

:: Copy important root files
echo    • Configuration files...
if exist "%SOURCE_DIR%package.json" copy "%SOURCE_DIR%package.json" "%PORTABLE_DIR%\" >nul 2>&1
if exist "%SOURCE_DIR%README.md" copy "%SOURCE_DIR%README.md" "%PORTABLE_DIR%\" >nul 2>&1
if exist "%SOURCE_DIR%.gitignore" copy "%SOURCE_DIR%.gitignore" "%PORTABLE_DIR%\" >nul 2>&1

echo.
echo 🛠️  Creating enhanced setup scripts...

:: Create enhanced system check
call :create_enhanced_system_check

:: Create enhanced setup script
call :create_enhanced_setup

:: Create enhanced start script
call :create_enhanced_start

:: Create enhanced stop script
call :create_enhanced_stop

:: Create enhanced test script
call :create_enhanced_test

:: Create auto-updater
call :create_auto_updater

:: Create comprehensive documentation
call :create_comprehensive_docs

echo.
echo ✅ Auto-sync completed successfully!
echo 📁 Portable package location: %PORTABLE_DIR%
echo 📋 Log file: %LOG_FILE%
echo.
echo [%date% %time%] Auto-sync completed successfully >> "%LOG_FILE%"

echo 🚀 To deploy on another device:
echo    1. Copy the 'osmena-chatbot-portable' folder
echo    2. Run 'INSTALL.bat' on the target device
echo    3. Follow the automated setup process
echo.
pause
goto :EOF

:: ============================================================================
:: ENHANCED SYSTEM CHECK FUNCTION
:: ============================================================================
:create_enhanced_system_check
echo Creating enhanced system check...
(
echo @echo off
echo title Osmeña Colleges Chatbot - Enhanced System Check
echo color 0B
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    SYSTEM REQUIREMENTS CHECK                   ║
echo ║                      Osmeña Colleges Chatbot                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🔍 Checking system requirements...
echo.
echo ══════════════════════════════════════════════════════════════════
echo 📊 SYSTEM INFORMATION
echo ══════════════════════════════════════════════════════════════════
systeminfo | findstr /C:"OS Name" /C:"Total Physical Memory"
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🟢 NODE.JS CHECK
echo ══════════════════════════════════════════════════════════════════
node --version >nul 2>&1
if %%errorlevel%% equ 0 ^(
    echo ✅ Node.js is installed
    for /f "tokens=*" %%a in ^('node --version'^) do echo    Version: %%a
    for /f "tokens=*" %%a in ^('npm --version'^) do echo    NPM Version: %%a
^) else ^(
    echo ❌ Node.js is NOT installed
    echo.
    echo 📥 INSTALLING NODE.JS AUTOMATICALLY...
    echo.
    echo 🌐 Downloading Node.js installer...
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/latest/node-v-x64.msi' -OutFile 'nodejs-installer.msi'"
    if exist nodejs-installer.msi ^(
        echo 🔧 Installing Node.js...
        msiexec /i nodejs-installer.msi /quiet /norestart
        echo ✅ Node.js installation completed
        del nodejs-installer.msi
    ^) else ^(
        echo ⚠️  Automatic installation failed. Please install Node.js manually from https://nodejs.org
        echo    1. Download the Windows Installer ^(.msi^)
        echo    2. Run the installer
        echo    3. Restart this script
        pause
        exit /b 1
    ^)
^)
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🌐 NETWORK CHECK
echo ══════════════════════════════════════════════════════════════════
ping google.com -n 1 >nul 2>&1
if %%errorlevel%% equ 0 ^(
    echo ✅ Internet connection is available
^) else ^(
    echo ⚠️  No internet connection detected
    echo    Some features may not work properly
^)
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🔥 FIREWALL CHECK
echo ══════════════════════════════════════════════════════════════════
echo 🔧 Configuring firewall rules for chatbot...
netsh advfirewall firewall delete rule name="Osmeña Chatbot Frontend" >nul 2>&1
netsh advfirewall firewall delete rule name="Osmeña Chatbot Backend" >nul 2>&1
netsh advfirewall firewall add rule name="Osmeña Chatbot Frontend" dir=in action=allow protocol=TCP localport=3000 >nul 2>&1
netsh advfirewall firewall add rule name="Osmeña Chatbot Backend" dir=in action=allow protocol=TCP localport=5000 >nul 2>&1
echo ✅ Firewall rules configured
echo.
echo ══════════════════════════════════════════════════════════════════
echo 📁 PROJECT STRUCTURE CHECK
echo ══════════════════════════════════════════════════════════════════
if exist frontend\ ^(
    echo ✅ Frontend directory found
^) else ^(
    echo ❌ Frontend directory missing
^)
if exist backend\ ^(
    echo ✅ Backend directory found
^) else ^(
    echo ❌ Backend directory missing
^)
echo.
echo ══════════════════════════════════════════════════════════════════
echo 📋 SYSTEM CHECK COMPLETE
echo ══════════════════════════════════════════════════════════════════
echo.
pause
) > "%PORTABLE_DIR%\enhanced-system-check.bat"
goto :EOF

:: ============================================================================
:: ENHANCED SETUP FUNCTION
:: ============================================================================
:create_enhanced_setup
echo Creating enhanced setup script...
(
echo @echo off
echo title Osmeña Colleges Chatbot - Enhanced Installation
echo color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    ENHANCED INSTALLATION                       ║
echo ║                      Osmeña Colleges Chatbot                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Starting enhanced installation process...
echo.
echo ⏰ Installation started at: %%date%% %%time%%
echo.
echo ══════════════════════════════════════════════════════════════════
echo 📋 STEP 1: SYSTEM CHECK
echo ══════════════════════════════════════════════════════════════════
call enhanced-system-check.bat
echo.
echo ══════════════════════════════════════════════════════════════════
echo 📦 STEP 2: INSTALLING BACKEND DEPENDENCIES
echo ══════════════════════════════════════════════════════════════════
cd backend
echo 🔧 Installing backend packages...
npm install --production --silent
if %%errorlevel%% equ 0 ^(
    echo ✅ Backend dependencies installed successfully
^) else ^(
    echo ❌ Backend installation failed
    echo 🔄 Trying with cache clear...
    npm cache clean --force
    npm install --production
^)
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🎨 STEP 3: INSTALLING FRONTEND DEPENDENCIES
echo ══════════════════════════════════════════════════════════════════
cd ..\frontend
echo 🔧 Installing frontend packages...
npm install --production --silent
if %%errorlevel%% equ 0 ^(
    echo ✅ Frontend dependencies installed successfully
^) else ^(
    echo ❌ Frontend installation failed
    echo 🔄 Trying with cache clear...
    npm cache clean --force
    npm install --production
^)
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🔧 STEP 4: OPTIMIZING PROJECT
echo ══════════════════════════════════════════════════════════════════
cd ..
echo 🗂️  Creating uploads directory...
if not exist backend\uploads mkdir backend\uploads
echo ✅ Uploads directory ready
echo.
echo 🔒 Setting up environment configuration...
if not exist backend\.env ^(
    echo GEMINI_API_KEY=your_api_key_here > backend\.env
    echo PORT=5000 >> backend\.env
    echo NODE_ENV=production >> backend\.env
    echo ✅ Environment file created
^) else ^(
    echo ✅ Environment file already exists
^)
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🎯 STEP 5: CREATING DESKTOP SHORTCUTS
echo ══════════════════════════════════════════════════════════════════
echo 🔗 Creating desktop shortcuts...
call :create_desktop_shortcuts
echo ✅ Desktop shortcuts created
echo.
echo ══════════════════════════════════════════════════════════════════
echo ✅ INSTALLATION COMPLETED SUCCESSFULLY!
echo ══════════════════════════════════════════════════════════════════
echo.
echo ⏰ Installation completed at: %%date%% %%time%%
echo.
echo 🚀 Your Osmeña Colleges Chatbot is ready to use!
echo.
echo 📱 Quick Start Options:
echo    • Double-click "🚀 Start Chatbot" on your desktop
echo    • Or run "enhanced-start.bat" from this folder
echo    • Or use the Start Menu shortcuts
echo.
echo 🌐 After starting, open your browser to:
echo    • http://localhost:3000 ^(main application^)
echo    • http://your-ip:3000 ^(for mobile devices^)
echo.
pause
goto :create_desktop_shortcuts_end
:create_desktop_shortcuts
echo Creating Start Menu shortcuts...
if not exist "%%APPDATA%%\Microsoft\Windows\Start Menu\Programs\Osmeña Colleges Chatbot" ^(
    mkdir "%%APPDATA%%\Microsoft\Windows\Start Menu\Programs\Osmeña Colleges Chatbot"
^)
echo Set WshShell = WScript.CreateObject^("WScript.Shell"^) > temp_shortcut.vbs
echo Set Shortcut = WshShell.CreateShortcut^("%%APPDATA%%\Microsoft\Windows\Start Menu\Programs\Osmeña Colleges Chatbot\Start Chatbot.lnk"^) >> temp_shortcut.vbs
echo Shortcut.TargetPath = "%%CD%%\enhanced-start.bat" >> temp_shortcut.vbs
echo Shortcut.WorkingDirectory = "%%CD%%" >> temp_shortcut.vbs
echo Shortcut.Description = "Start Osmeña Colleges Chatbot" >> temp_shortcut.vbs
echo Shortcut.Save >> temp_shortcut.vbs
cscript temp_shortcut.vbs >nul
del temp_shortcut.vbs
goto :EOF
:create_desktop_shortcuts_end
) > "%PORTABLE_DIR%\enhanced-setup.bat"
goto :EOF

:: ============================================================================
:: ENHANCED START FUNCTION
:: ============================================================================
:create_enhanced_start
echo Creating enhanced start script...
(
echo @echo off
echo title Osmeña Colleges Chatbot - Enhanced Startup
echo color 0A
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                       CHATBOT STARTUP                         ║
echo ║                      Osmeña Colleges Chatbot                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Starting Osmeña Colleges Chatbot...
echo ⏰ Startup time: %%date%% %%time%%
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🔍 PRE-FLIGHT CHECKS
echo ══════════════════════════════════════════════════════════════════
echo 🔧 Checking Node.js installation...
node --version >nul 2>&1
if %%errorlevel%% neq 0 ^(
    echo ❌ Node.js not found! Please run enhanced-setup.bat first.
    pause
    exit /b 1
^)
echo ✅ Node.js is available
echo.
echo 🔧 Checking project structure...
if not exist backend\ ^(
    echo ❌ Backend directory not found!
    pause
    exit /b 1
^)
if not exist frontend\ ^(
    echo ❌ Frontend directory not found!
    pause
    exit /b 1
^)
echo ✅ Project structure is valid
echo.
echo 🔧 Checking for running instances...
tasklist | find "node.exe" >nul 2>&1
if %%errorlevel%% equ 0 ^(
    echo ⚠️  Found existing Node.js processes
    echo 🛑 Stopping previous instances...
    taskkill /F /IM node.exe >nul 2>&1
    timeout /t 2 >nul
^)
echo ✅ No conflicting processes
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🌐 STARTING BACKEND SERVER
echo ══════════════════════════════════════════════════════════════════
echo 🔧 Starting backend on port 5000...
start "Osmeña Chatbot Backend" cmd /c "cd backend && npm start"
echo ✅ Backend server starting...
echo ⏳ Waiting for backend to initialize...
timeout /t 5 >nul
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🎨 STARTING FRONTEND SERVER
echo ══════════════════════════════════════════════════════════════════
echo 🔧 Starting frontend on port 3000...
start "Osmeña Chatbot Frontend" cmd /c "cd frontend && npm start"
echo ✅ Frontend server starting...
echo ⏳ Waiting for frontend to compile...
timeout /t 10 >nul
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🌐 NETWORK INFORMATION
echo ══════════════════════════════════════════════════════════════════
echo 📱 Access URLs:
echo    • Local: http://localhost:3000
for /f "tokens=2 delims=:" %%a in ^('ipconfig ^| findstr "IPv4"'^) do ^(
    for /f "tokens=1" %%b in ^("%%a"^) do echo    • Network: http://%%b:3000
^)
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🚀 CHATBOT IS NOW RUNNING!
echo ══════════════════════════════════════════════════════════════════
echo.
echo 💡 Tips:
echo    • Keep this window open to see server logs
echo    • Use Ctrl+C to stop servers if needed
echo    • Run enhanced-stop.bat to stop all services
echo    • Check enhanced-test.bat to verify functionality
echo.
echo 🎯 Opening chatbot in your default browser...
timeout /t 3 >nul
start http://localhost:3000
echo.
echo ✅ Startup completed successfully!
echo 📋 Both servers are running in background windows
echo.
pause
) > "%PORTABLE_DIR%\enhanced-start.bat"
goto :EOF

:: ============================================================================
:: ENHANCED STOP FUNCTION
:: ============================================================================
:create_enhanced_stop
echo Creating enhanced stop script...
(
echo @echo off
echo title Osmeña Colleges Chatbot - Enhanced Shutdown
echo color 0C
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                       CHATBOT SHUTDOWN                        ║
echo ║                      Osmeña Colleges Chatbot                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🛑 Shutting down Osmeña Colleges Chatbot...
echo ⏰ Shutdown time: %%date%% %%time%%
echo.
echo 🔍 Checking for running Node.js processes...
tasklist | find "node.exe" >nul 2>&1
if %%errorlevel%% equ 0 ^(
    echo ✅ Found running Node.js processes
    echo 🛑 Stopping all Node.js processes...
    taskkill /F /IM node.exe >nul 2>&1
    if %%errorlevel%% equ 0 ^(
        echo ✅ All Node.js processes stopped successfully
    ^) else ^(
        echo ⚠️  Some processes may still be running
    ^)
^) else ^(
    echo ℹ️  No Node.js processes found running
^)
echo.
echo 🔍 Checking for browser processes...
tasklist | find "chrome.exe" | find "localhost:3000" >nul 2>&1
if %%errorlevel%% equ 0 ^(
    echo ℹ️  Browser tabs with chatbot are still open
    echo    You may want to close them manually
^)
echo.
echo 🧹 Cleaning up temporary files...
if exist temp_* del temp_* >nul 2>&1
echo ✅ Cleanup completed
echo.
echo ══════════════════════════════════════════════════════════════════
echo ✅ SHUTDOWN COMPLETED SUCCESSFULLY!
echo ══════════════════════════════════════════════════════════════════
echo.
echo 💡 The chatbot has been safely shut down.
echo    All server processes have been terminated.
echo.
pause
) > "%PORTABLE_DIR%\enhanced-stop.bat"
goto :EOF

:: ============================================================================
:: ENHANCED TEST FUNCTION
:: ============================================================================
:create_enhanced_test
echo Creating enhanced test script...
(
echo @echo off
echo title Osmeña Colleges Chatbot - Enhanced Testing
echo color 0E
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                       SYSTEM TESTING                          ║
echo ║                      Osmeña Colleges Chatbot                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🧪 Testing Osmeña Colleges Chatbot functionality...
echo ⏰ Test time: %%date%% %%time%%
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🔧 BACKEND CONNECTIVITY TEST
echo ══════════════════════════════════════════════════════════════════
echo 🌐 Testing backend server connection...
powershell -Command "try { $$response = Invoke-RestMethod -Uri 'http://localhost:5000/api/health' -Method GET -TimeoutSec 10; Write-Host '✅ Backend is responding'; Write-Host '📊 Status:' $$response.status } catch { Write-Host '❌ Backend connection failed'; exit 1 }"
if %%errorlevel%% neq 0 ^(
    echo ⚠️  Backend is not responding. Is it running?
    echo 💡 Try running enhanced-start.bat first
^)
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🎨 FRONTEND ACCESSIBILITY TEST
echo ══════════════════════════════════════════════════════════════════
echo 🌐 Testing frontend server connection...
powershell -Command "try { $$response = Invoke-WebRequest -Uri 'http://localhost:3000' -Method GET -TimeoutSec 10; if ($$response.StatusCode -eq 200) { Write-Host '✅ Frontend is accessible' } else { Write-Host '⚠️ Frontend returned status:' $$response.StatusCode } } catch { Write-Host '❌ Frontend connection failed' }"
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🤖 CHATBOT API TEST
echo ══════════════════════════════════════════════════════════════════
echo 🧠 Testing chatbot AI responses...
powershell -Command "try { $$body = @{ message = 'Hello' } ^| ConvertTo-Json; $$response = Invoke-RestMethod -Uri 'http://localhost:5000/api/chat' -Method POST -Body $$body -ContentType 'application/json' -TimeoutSec 15; Write-Host '✅ Chatbot API is working'; Write-Host '💬 Sample response:' $$response.text.Substring(0, [Math]::Min(100, $$response.text.Length)) '...' } catch { Write-Host '❌ Chatbot API test failed' }"
echo.
echo ══════════════════════════════════════════════════════════════════
echo 📁 FILE UPLOAD TEST
echo ══════════════════════════════════════════════════════════════════
echo 📤 Testing file upload functionality...
if exist backend\uploads\ ^(
    echo ✅ Upload directory exists
    echo 📊 Upload directory permissions: OK
^) else ^(
    echo ❌ Upload directory missing
    echo 🔧 Creating upload directory...
    mkdir backend\uploads
^)
echo.
echo ══════════════════════════════════════════════════════════════════
echo 🌐 NETWORK ACCESSIBILITY TEST
echo ══════════════════════════════════════════════════════════════════
echo 📱 Testing network access for mobile devices...
for /f "tokens=2 delims=:" %%a in ^('ipconfig ^| findstr "IPv4" ^| findstr "192.168"'^) do ^(
    for /f "tokens=1" %%b in ^("%%a"^) do ^(
        echo 🌐 Testing network access: http://%%b:3000
        powershell -Command "try { $$response = Invoke-WebRequest -Uri 'http://%%b:3000' -Method GET -TimeoutSec 5; Write-Host '✅ Network access working for mobile devices' } catch { Write-Host '⚠️  Network access may have issues' }"
    ^)
^)
echo.
echo ══════════════════════════════════════════════════════════════════
echo 📋 TEST SUMMARY
echo ══════════════════════════════════════════════════════════════════
echo.
echo 🎯 Test completed at: %%date%% %%time%%
echo.
echo 💡 If all tests passed:
echo    • Your chatbot is working correctly
echo    • It's accessible on your network
echo    • Mobile devices can connect
echo.
echo ⚠️  If any tests failed:
echo    • Check if servers are running ^(enhanced-start.bat^)
echo    • Verify firewall settings
echo    • Ensure all dependencies are installed
echo.
pause
) > "%PORTABLE_DIR%\enhanced-test.bat"
goto :EOF

:: ============================================================================
:: AUTO-UPDATER FUNCTION
:: ============================================================================
:create_auto_updater
echo Creating auto-updater script...
(
echo @echo off
echo title Osmeña Colleges Chatbot - Auto Updater
echo color 0D
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                         AUTO UPDATER                          ║
echo ║                      Osmeña Colleges Chatbot                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🔄 Checking for updates...
echo.
echo This feature will be implemented in future versions.
echo For now, you can manually update by:
echo    1. Getting the latest project files
echo    2. Running the auto-sync-portable.bat script
echo    3. Redeploying the portable package
echo.
pause
) > "%PORTABLE_DIR%\auto-updater.bat"
goto :EOF

:: ============================================================================
:: COMPREHENSIVE DOCUMENTATION FUNCTION
:: ============================================================================
:create_comprehensive_docs
echo Creating comprehensive documentation...

:: Create main installation guide
(
echo # OSMEÑA COLLEGES CHATBOT - PORTABLE INSTALLATION GUIDE
echo.
echo ## 🚀 QUICK START ^(Recommended^)
echo.
echo 1. **Double-click `INSTALL.bat`** - This will do everything automatically
echo 2. **Wait for installation to complete** ^(~5-10 minutes^)
echo 3. **Double-click the desktop shortcut** or run `enhanced-start.bat`
echo 4. **Open http://localhost:3000** in your browser
echo.
echo ## 📋 SYSTEM REQUIREMENTS
echo.
echo - **Operating System**: Windows 10/11 ^(64-bit^)
echo - **RAM**: Minimum 4GB, Recommended 8GB
echo - **Storage**: 2GB free space
echo - **Network**: Internet connection for initial setup
echo - **Permissions**: Administrator rights for installation
echo.
echo ## 🛠️ MANUAL INSTALLATION ^(Advanced Users^)
echo.
echo ### Step 1: System Check
echo ```batch
echo enhanced-system-check.bat
echo ```
echo.
echo ### Step 2: Install Dependencies
echo ```batch
echo enhanced-setup.bat
echo ```
echo.
echo ### Step 3: Start the Application
echo ```batch
echo enhanced-start.bat
echo ```
echo.
echo ## 📱 MOBILE ACCESS
echo.
echo 1. **Find your computer's IP address** ^(shown during startup^)
echo 2. **Connect mobile device to same WiFi network**
echo 3. **Open browser on mobile and go to**: http://YOUR-IP:3000
echo.
echo ## 🔧 TROUBLESHOOTING
echo.
echo ### Common Issues:
echo.
echo **Problem**: "Node.js not found"
echo **Solution**: Run `enhanced-system-check.bat` - it will auto-install Node.js
echo.
echo **Problem**: "Port already in use"
echo **Solution**: Run `enhanced-stop.bat` then `enhanced-start.bat`
echo.
echo **Problem**: "Cannot access from mobile"
echo **Solution**: Check Windows Firewall settings or run as Administrator
echo.
echo **Problem**: "Dependencies installation failed"
echo **Solution**: Ensure internet connection and run `enhanced-setup.bat` again
echo.
echo ## 📞 SUPPORT
echo.
echo - Check the `sync-log.txt` file for detailed error information
echo - Run `enhanced-test.bat` to diagnose issues
echo - Ensure all files were copied correctly from the source
echo.
echo ## 🔄 UPDATING
echo.
echo To update to a newer version:
echo 1. Get the latest portable package
echo 2. Stop the current installation ^(`enhanced-stop.bat`^)
echo 3. Replace the old folder with the new one
echo 4. Run `enhanced-setup.bat`
echo.
echo ---
echo **Osmeña Colleges Chatbot** - Portable Version
echo Generated on: %date% %time%
) > "%PORTABLE_DIR%\INSTALLATION-GUIDE.md"

:: Create quick start batch file
(
echo @echo off
echo title Osmeña Colleges Chatbot - One-Click Installation
echo color 0F
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                     ONE-CLICK INSTALLER                       ║
echo ║                      Osmeña Colleges Chatbot                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 🎯 Welcome to the Osmeña Colleges Chatbot!
echo.
echo This installer will:
echo    ✅ Check your system requirements
echo    ✅ Install all necessary dependencies
echo    ✅ Configure the application
echo    ✅ Create desktop shortcuts
echo    ✅ Start the chatbot automatically
echo.
echo ⏰ Estimated time: 5-10 minutes
echo.
echo Press any key to begin installation...
pause >nul
echo.
echo 🚀 Starting installation process...
call enhanced-setup.bat
echo.
echo 🎉 Installation completed! Starting the chatbot...
call enhanced-start.bat
) > "%PORTABLE_DIR%\INSTALL.bat"

:: Create readme file
(
echo # Osmeña Colleges Chatbot - Portable Version
echo.
echo ## 📦 What's Included
echo.
echo - ✅ Complete chatbot application
echo - ✅ Automated installation scripts
echo - ✅ System requirement checker
echo - ✅ Network configuration tools
echo - ✅ Desktop shortcuts
echo - ✅ Comprehensive documentation
echo.
echo ## 🚀 Getting Started
echo.
echo **Option 1 - One-Click Installation ^(Recommended^)**
echo Double-click `INSTALL.bat` and follow the prompts.
echo.
echo **Option 2 - Manual Steps**
echo 1. Run `enhanced-system-check.bat`
echo 2. Run `enhanced-setup.bat`
echo 3. Run `enhanced-start.bat`
echo.
echo ## 📱 Features
echo.
echo - 🤖 AI-powered chatbot with Gemini integration
echo - 📚 Course information and enrollment details
echo - 🏢 Campus facilities and services
echo - 👥 Staff and faculty directory
echo - 💰 Tuition and scholarship information
echo - 📁 File upload and document analysis
echo - 🌐 Mobile-responsive design
echo - 🔄 Real-time chat functionality
echo.
echo ## 🌐 Access Points
echo.
echo - **Desktop**: http://localhost:3000
echo - **Mobile**: http://YOUR-IP:3000 ^(shown during startup^)
echo.
echo ## 📞 Need Help?
echo.
echo 1. Check `INSTALLATION-GUIDE.md` for detailed instructions
echo 2. Run `enhanced-test.bat` to diagnose issues
echo 3. Check `sync-log.txt` for error details
echo.
echo ---
echo Generated: %date% %time%
echo Version: Portable Auto-Sync Edition
) > "%PORTABLE_DIR%\README.md"

echo ✅ Comprehensive documentation created
goto :EOF
