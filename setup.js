#!/usr/bin/env node
/**
 * Complete School Chatbot Setup Script
 * This script ensures everything is properly installed and configured
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎓 Osmeña Colleges Chatbot - Complete Setup');
console.log('===========================================\n');

// Check if Node.js is installed
function checkNodejs() {
    try {
        const nodeVersion = execSync('node --version', { encoding: 'utf8' });
        console.log('✅ Node.js found:', nodeVersion.trim());
        return true;
    } catch (error) {
        console.log('❌ Node.js not found. Please install Node.js from https://nodejs.org/');
        return false;
    }
}

// Check if npm is available
function checkNpm() {
    try {
        const npmVersion = execSync('npm --version', { encoding: 'utf8' });
        console.log('✅ npm found:', npmVersion.trim());
        return true;
    } catch (error) {
        console.log('❌ npm not found. Please install Node.js from https://nodejs.org/');
        return false;
    }
}

// Install all dependencies
function installDependencies() {
    console.log('\n📦 Installing all dependencies...');
    
    try {
        // Install root dependencies
        console.log('Installing root dependencies...');
        execSync('npm install', { stdio: 'inherit' });
        
        // Install backend dependencies
        console.log('Installing backend dependencies...');
        execSync('cd backend && npm install', { stdio: 'inherit', shell: true });
        
        // Install frontend dependencies
        console.log('Installing frontend dependencies...');
        execSync('cd frontend && npm install', { stdio: 'inherit', shell: true });
        
        console.log('✅ All dependencies installed successfully!');
        return true;
    } catch (error) {
        console.log('❌ Error installing dependencies:', error.message);
        return false;
    }
}

// Create .env file if it doesn't exist
function createEnvFile() {
    const envPath = path.join('backend', '.env');
    
    if (!fs.existsSync(envPath)) {
        console.log('\n⚙️ Creating environment configuration...');
        
        const envContent = `# Environment Variables
PORT=5000

# OpenAI API (Optional)
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini API (Optional but recommended)
GEMINI_API_KEY=your_gemini_api_key_here
# Get your free API key from: https://makersuite.google.com/app/apikey

# Instructions:
# 1. Get a free Gemini API key from Google AI Studio
# 2. Replace 'your_gemini_api_key_here' with your actual key
# 3. Save this file and restart the server
# 4. The chatbot will work without API keys but with limited AI features
`;
        
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Environment file created at backend/.env');
        console.log('📝 You can add your Gemini API key later for AI features');
    } else {
        console.log('✅ Environment file already exists');
    }
}

// Create uploads directory structure
function createDirectories() {
    console.log('\n📁 Creating directory structure...');
    
    const directories = [
        'backend/uploads',
        'backend/uploads/staff'
    ];
    
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Created directory: ${dir}`);
        }
    });
}

// Create a simple start script
function createStartScript() {
    console.log('\n🚀 Creating start scripts...');
    
    // Windows batch file
    const windowsScript = `@echo off
echo Starting Osmena Colleges Chatbot...
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak > nul
start http://localhost:3000
npm run dev
pause`;
    
    fs.writeFileSync('START_CHATBOT.bat', windowsScript);
    
    // Cross-platform script
    const crossPlatformScript = `#!/bin/bash
echo "Starting Osmena Colleges Chatbot..."
echo ""
echo "Opening browser in 5 seconds..."
sleep 5
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v open > /dev/null; then
    open http://localhost:3000
elif command -v start > /dev/null; then
    start http://localhost:3000
fi
npm run dev`;
    
    fs.writeFileSync('start_chatbot.sh', crossPlatformScript);
    
    console.log('✅ Created START_CHATBOT.bat (Windows)');
    console.log('✅ Created start_chatbot.sh (Mac/Linux)');
}

// Main setup function
async function main() {
    console.log('🔍 Checking system requirements...\n');
    
    if (!checkNodejs() || !checkNpm()) {
        console.log('\n❌ Setup failed. Please install Node.js first.');
        process.exit(1);
    }
    
    createDirectories();
    createEnvFile();
    
    if (!installDependencies()) {
        console.log('\n❌ Setup failed during dependency installation.');
        process.exit(1);
    }
    
    createStartScript();
    
    console.log('\n🎉 Setup Complete!');
    console.log('================');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. (Optional) Add Gemini API key to backend/.env for AI features');
    console.log('2. Run: npm run dev  OR  double-click START_CHATBOT.bat');
    console.log('3. Open browser to http://localhost:3000');
    console.log('');
    console.log('✨ Your chatbot is ready to use!');
}

main().catch(console.error);
