#!/usr/bin/env node
/**
 * Package Creator for School Chatbot
 * Creates a complete portable package ready for any laptop
 */

const fs = require('fs');
const path = require('path');

console.log('📦 Creating Portable School Chatbot Package...\n');

// Create package info file
const packageInfo = {
    name: "Osmeña Colleges Chatbot",
    version: "1.0.0",
    description: "Complete portable school chatbot with AI integration",
    created: new Date().toISOString(),
    requirements: {
        nodejs: "16.0.0 or higher",
        npm: "6.0.0 or higher",
        os: "Windows, macOS, Linux"
    },
    features: [
        "Real-time chat interface",
        "School information database",
        "File upload and analysis",
        "Text-to-speech functionality",
        "Staff directory with photos",
        "AI integration (Gemini API)",
        "Responsive design",
        "No configuration required"
    ],
    installation: {
        windows: "Double-click START_CHATBOT.bat",
        manual: "Run 'node setup.js' then 'npm run dev'",
        url: "http://localhost:3000"
    }
};

fs.writeFileSync('PACKAGE_INFO.json', JSON.stringify(packageInfo, null, 2));

// Create a comprehensive .gitignore to ensure all necessary files are included
const gitignoreContent = `# Only ignore these in the portable package
.git/
*.log
.DS_Store
Thumbs.db

# Keep node_modules in the package for offline installation
# node_modules/

# Keep all uploads and staff images
# uploads/

# Keep environment file template
# backend/.env
`;

fs.writeFileSync('.gitignore', gitignoreContent);

console.log('✅ Package configuration created');
console.log('✅ Files ready for copying to laptop');
console.log('\n📋 Files to copy to the new laptop:');
console.log('====================================');

const filesToCopy = [
    '📁 Complete project folder including:',
    '   ├── 📄 START_CHATBOT.bat (Windows startup)',
    '   ├── 📄 setup.js (Auto-setup script)',
    '   ├── 📄 LAPTOP_SETUP.md (Instructions)',
    '   ├── 📄 package.json (Project config)',
    '   ├── 📁 backend/ (Server code)',
    '   ├── 📁 frontend/ (React app)',
    '   ├── 📁 node_modules/ (Dependencies)',
    '   └── 📄 All other project files'
];

filesToCopy.forEach(file => console.log(file));

console.log('\n🚀 To use on new laptop:');
console.log('1. Copy entire folder to new laptop');
console.log('2. Install Node.js if not present');
console.log('3. Double-click START_CHATBOT.bat');
console.log('4. Done! 🎉');

console.log('\n💡 Pro tip: Create a ZIP file of this entire folder for easy transfer!');
