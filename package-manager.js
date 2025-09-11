#!/usr/bin/env node

/**
 * Osmeña Colleges Chatbot - Enhanced Package Manager
 * Automatically manages portable packages with real-time sync
 */

const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');
const chokidar = require('chokidar');
const readline = require('readline');

class ChatbotPackageManager {
    constructor() {
        this.sourceDir = process.cwd();
        this.portableDir = path.join(this.sourceDir, 'osmena-chatbot-portable');
        this.isWatching = false;
        this.lastSync = null;
        this.logFile = path.join(this.sourceDir, 'package-manager-log.txt');
        this.config = {
            autoSync: false,
            syncDelay: 2000, // 2 seconds
            excludePatterns: ['node_modules', '.git', 'logs', '*.log', '.env'],
            includeDirs: ['frontend', 'backend'],
            requiredFiles: ['package.json', 'README.md']
        };
    }

    log(message) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}`;
        console.log(logMessage);
        
        try {
            fs.appendFileSync(this.logFile, logMessage + '\n');
        } catch (err) {
            console.error('Logging error:', err.message);
        }
    }

    async createPortablePackage() {
        this.log('🚀 Creating enhanced portable package...');
        
        try {
            // Remove existing portable directory
            if (fs.existsSync(this.portableDir)) {
                this.log('🗑️  Removing existing portable directory...');
                await this.removeDirectory(this.portableDir);
            }

            // Create new portable directory
            fs.mkdirSync(this.portableDir, { recursive: true });
            this.log('📁 Created portable directory');

            // Copy project files
            await this.copyProjectFiles();
            
            // Create enhanced scripts
            await this.createEnhancedScripts();
            
            // Create configuration files
            await this.createConfigFiles();
            
            // Generate documentation
            await this.generateDocumentation();
            
            this.log('✅ Portable package created successfully!');
            this.log(`📁 Location: ${this.portableDir}`);
            
            return true;
        } catch (error) {
            this.log(`❌ Error creating portable package: ${error.message}`);
            return false;
        }
    }

    async copyProjectFiles() {
        this.log('📂 Copying project files...');
        
        // Copy main directories
        for (const dir of this.config.includeDirs) {
            const srcPath = path.join(this.sourceDir, dir);
            const destPath = path.join(this.portableDir, dir);
            
            if (fs.existsSync(srcPath)) {
                await this.copyDirectory(srcPath, destPath);
                this.log(`  ✅ Copied ${dir}/`);
            } else {
                this.log(`  ⚠️  Directory ${dir}/ not found`);
            }
        }

        // Copy required files
        for (const file of this.config.requiredFiles) {
            const srcPath = path.join(this.sourceDir, file);
            const destPath = path.join(this.portableDir, file);
            
            if (fs.existsSync(srcPath)) {
                fs.copyFileSync(srcPath, destPath);
                this.log(`  ✅ Copied ${file}`);
            } else {
                this.log(`  ⚠️  File ${file} not found`);
            }
        }
    }

    async copyDirectory(src, dest) {
        const stats = fs.statSync(src);
        
        if (stats.isDirectory()) {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }
            
            const files = fs.readdirSync(src);
            
            for (const file of files) {
                // Skip excluded patterns
                if (this.shouldExclude(file)) continue;
                
                const srcPath = path.join(src, file);
                const destPath = path.join(dest, file);
                
                await this.copyDirectory(srcPath, destPath);
            }
        } else {
            fs.copyFileSync(src, dest);
        }
    }

    shouldExclude(filename) {
        return this.config.excludePatterns.some(pattern => {
            if (pattern.includes('*')) {
                const regex = new RegExp(pattern.replace(/\*/g, '.*'));
                return regex.test(filename);
            }
            return filename === pattern;
        });
    }

    async removeDirectory(dirPath) {
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);
            
            for (const file of files) {
                const filePath = path.join(dirPath, file);
                const stats = fs.statSync(filePath);
                
                if (stats.isDirectory()) {
                    await this.removeDirectory(filePath);
                } else {
                    fs.unlinkSync(filePath);
                }
            }
            
            fs.rmdirSync(dirPath);
        }
    }

    async createEnhancedScripts() {
        this.log('🛠️  Creating enhanced deployment scripts...');
        
        // Create enhanced start script for Windows
        const startScript = `@echo off
title Osmeña Colleges Chatbot - Production Start
color 0A

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    PRODUCTION STARTUP                         ║
echo ║                   Osmeña Colleges Chatbot                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)

:: Stop existing processes
taskkill /F /IM node.exe >nul 2>&1

:: Start backend
echo 🌐 Starting backend server...
start "Chatbot Backend" cmd /c "cd backend && npm start"
timeout /t 5 >nul

:: Start frontend
echo 🎨 Starting frontend server...
start "Chatbot Frontend" cmd /c "cd frontend && npm start"
timeout /t 10 >nul

:: Show access information
echo.
echo ✅ Chatbot is starting!
echo 🌐 Local access: http://localhost:3000
for /f "tokens=2 delims=:" %%a in ('ipconfig | findstr "IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do echo 📱 Mobile access: http://%%b:3000
)

:: Open browser
start http://localhost:3000

echo.
echo 💡 Keep this window open. Press Ctrl+C to stop servers.
pause`;

        fs.writeFileSync(path.join(this.portableDir, 'start-production.bat'), startScript);
        
        // Create installation script
        const installScript = `@echo off
title Osmeña Colleges Chatbot - Quick Install
color 0B

echo ╔════════════════════════════════════════════════════════════════╗
echo ║                     QUICK INSTALLER                           ║
echo ║                   Osmeña Colleges Chatbot                     ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo 🔍 Checking system requirements...

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo 📥 Please install Node.js from https://nodejs.org
    echo    Choose the LTS version for Windows
    pause
    exit /b 1
)
echo ✅ Node.js found

:: Install backend dependencies
echo.
echo 📦 Installing backend dependencies...
cd backend
npm install --production
if %errorlevel% neq 0 (
    echo ❌ Backend installation failed
    pause
    exit /b 1
)

:: Install frontend dependencies
echo.
echo 🎨 Installing frontend dependencies...
cd ../frontend
npm install --production
if %errorlevel% neq 0 (
    echo ❌ Frontend installation failed
    pause
    exit /b 1
)

:: Setup completion
cd ..
echo.
echo ✅ Installation completed successfully!
echo.
echo 🚀 To start the chatbot:
echo    • Run start-production.bat
echo    • Or double-click the Start Chatbot desktop shortcut
echo.
pause`;

        fs.writeFileSync(path.join(this.portableDir, 'quick-install.bat'), installScript);
        
        this.log('  ✅ Enhanced scripts created');
    }

    async createConfigFiles() {
        this.log('⚙️  Creating configuration files...');
        
        // Create package.json for portable version
        const packageJson = {
            name: "osmena-colleges-chatbot-portable",
            version: "1.0.0",
            description: "Osmeña Colleges Chatbot - Portable Edition",
            main: "backend/server.js",
            scripts: {
                "start": "node backend/server.js",
                "install-all": "cd backend && npm install && cd ../frontend && npm install",
                "dev": "concurrently \"npm run start\" \"cd frontend && npm start\""
            },
            keywords: ["chatbot", "education", "react", "nodejs"],
            author: "Osmeña Colleges",
            license: "MIT"
        };
        
        fs.writeFileSync(
            path.join(this.portableDir, 'package.json'), 
            JSON.stringify(packageJson, null, 2)
        );
        
        // Create environment template
        const envTemplate = `# Osmeña Colleges Chatbot Configuration
# Copy this file to .env and update with your values

# Gemini AI API Key (get from Google AI Studio)
GEMINI_API_KEY=your_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=production

# Optional: Custom branding
SCHOOL_NAME=Osmeña Colleges
SCHOOL_WEBSITE=https://osmena.edu.ph

# Optional: File upload limits
MAX_FILE_SIZE=10MB
ALLOWED_FILE_TYPES=pdf,doc,docx,txt,jpg,png`;

        fs.writeFileSync(path.join(this.portableDir, 'backend', '.env.template'), envTemplate);
        
        this.log('  ✅ Configuration files created');
    }

    async generateDocumentation() {
        this.log('📝 Generating documentation...');
        
        const readmeContent = `# Osmeña Colleges Chatbot - Portable Edition

## 🚀 Quick Start

1. **Install Dependencies**: Double-click \`quick-install.bat\`
2. **Start Application**: Double-click \`start-production.bat\`
3. **Access Chatbot**: Open http://localhost:3000 in your browser

## 📋 System Requirements

- Windows 10/11 (64-bit)
- Node.js 18+ (LTS recommended)
- 4GB RAM minimum
- 2GB free disk space
- Internet connection for AI features

## 🛠️ Manual Installation

\`\`\`bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start the application
cd ..
npm start
\`\`\`

## 🌐 Network Access

- **Local**: http://localhost:3000
- **Mobile/Network**: http://YOUR-IP:3000 (shown during startup)

## ⚙️ Configuration

1. Copy \`backend/.env.template\` to \`backend/.env\`
2. Add your Gemini AI API key
3. Customize other settings as needed

## 🔧 Troubleshooting

**Node.js not found**
- Download and install from https://nodejs.org

**Port already in use**
- Close existing Node.js processes
- Or change PORT in .env file

**Dependencies fail to install**
- Ensure internet connection
- Try running as Administrator
- Clear npm cache: \`npm cache clean --force\`

## 📱 Features

- ✅ AI-powered chatbot with Gemini integration
- ✅ Course information and enrollment
- ✅ Campus facilities and services
- ✅ Staff directory
- ✅ Financial aid information
- ✅ File upload and analysis
- ✅ Mobile-responsive design
- ✅ Real-time messaging

## 📞 Support

For technical support or questions:
- Check the logs in the console windows
- Verify all files are present
- Ensure Node.js is properly installed

---
**Osmeña Colleges Chatbot** - Portable Edition v1.0  
Generated: ${new Date().toISOString()}`;

        fs.writeFileSync(path.join(this.portableDir, 'README.md'), readmeContent);
        
        this.log('  ✅ Documentation generated');
    }

    startAutoSync() {
        if (this.isWatching) {
            this.log('⚠️  Auto-sync is already running');
            return;
        }

        this.log('👁️  Starting auto-sync monitoring...');
        this.isWatching = true;

        const watcher = chokidar.watch([
            path.join(this.sourceDir, 'frontend'),
            path.join(this.sourceDir, 'backend'),
            path.join(this.sourceDir, 'package.json'),
            path.join(this.sourceDir, 'README.md')
        ], {
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true,
            ignoreInitial: true
        });

        let syncTimeout;

        watcher.on('change', (filePath) => {
            this.log(`📝 File changed: ${path.relative(this.sourceDir, filePath)}`);
            
            // Debounce sync operations
            clearTimeout(syncTimeout);
            syncTimeout = setTimeout(() => {
                this.syncChanges();
            }, this.config.syncDelay);
        });

        watcher.on('add', (filePath) => {
            this.log(`➕ File added: ${path.relative(this.sourceDir, filePath)}`);
            clearTimeout(syncTimeout);
            syncTimeout = setTimeout(() => {
                this.syncChanges();
            }, this.config.syncDelay);
        });

        watcher.on('unlink', (filePath) => {
            this.log(`➖ File removed: ${path.relative(this.sourceDir, filePath)}`);
            clearTimeout(syncTimeout);
            syncTimeout = setTimeout(() => {
                this.syncChanges();
            }, this.config.syncDelay);
        });

        this.log('✅ Auto-sync started successfully');
        this.log('💡 Changes will be automatically synced to portable package');
    }

    async syncChanges() {
        if (!fs.existsSync(this.portableDir)) {
            this.log('📦 Portable package not found, creating new one...');
            await this.createPortablePackage();
            return;
        }

        this.log('🔄 Syncing changes to portable package...');
        
        try {
            // Copy updated files
            await this.copyProjectFiles();
            this.lastSync = new Date();
            this.log(`✅ Sync completed at ${this.lastSync.toLocaleString()}`);
        } catch (error) {
            this.log(`❌ Sync failed: ${error.message}`);
        }
    }

    async showMenu() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log('\n╔════════════════════════════════════════════════════════════════╗');
        console.log('║              OSMEÑA COLLEGES CHATBOT MANAGER                   ║');
        console.log('║                  Enhanced Package Manager                      ║');
        console.log('╚════════════════════════════════════════════════════════════════╝\n');

        console.log('📦 Available Actions:');
        console.log('  1️⃣  Create Portable Package');
        console.log('  2️⃣  Start Auto-Sync');
        console.log('  3️⃣  Sync Changes Now');
        console.log('  4️⃣  View Log File');
        console.log('  5️⃣  Open Portable Directory');
        console.log('  0️⃣  Exit');
        console.log('');

        return new Promise((resolve) => {
            rl.question('🎯 Choose an action (0-5): ', (answer) => {
                rl.close();
                resolve(answer.trim());
            });
        });
    }

    async run() {
        console.clear();
        
        while (true) {
            const choice = await this.showMenu();

            switch (choice) {
                case '1':
                    await this.createPortablePackage();
                    break;
                
                case '2':
                    this.startAutoSync();
                    break;
                
                case '3':
                    await this.syncChanges();
                    break;
                
                case '4':
                    this.showLogFile();
                    break;
                
                case '5':
                    this.openPortableDirectory();
                    break;
                
                case '0':
                    this.log('👋 Goodbye!');
                    process.exit(0);
                    break;
                
                default:
                    console.log('❌ Invalid choice. Please try again.');
            }

            if (choice !== '2') {
                console.log('\nPress Enter to continue...');
                await new Promise(resolve => {
                    const rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    rl.question('', () => {
                        rl.close();
                        resolve();
                    });
                });
            }
        }
    }

    showLogFile() {
        if (fs.existsSync(this.logFile)) {
            const logs = fs.readFileSync(this.logFile, 'utf8');
            console.log('\n📋 Recent Log Entries:');
            console.log('═'.repeat(60));
            console.log(logs.split('\n').slice(-20).join('\n'));
        } else {
            console.log('📋 No log file found.');
        }
    }

    openPortableDirectory() {
        if (fs.existsSync(this.portableDir)) {
            this.log(`📁 Opening: ${this.portableDir}`);
            exec(`explorer "${this.portableDir}"`);
        } else {
            console.log('📁 Portable directory not found. Create it first.');
        }
    }
}

// Run the package manager
if (require.main === module) {
    const manager = new ChatbotPackageManager();
    manager.run().catch(console.error);
}

module.exports = ChatbotPackageManager;
