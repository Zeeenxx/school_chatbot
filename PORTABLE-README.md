# Osmena Colleges Chatbot - Portable Installation

This is a portable version of the Osmena Colleges Chatbot that can be copied to any Windows computer.

## System Requirements
- Windows 7/8/10/11
- Node.js 16 or higher (must be installed on target computer)

## Installation on New Computer

1. **Copy the entire `school_chatbot` folder** to the new computer
2. **Install Node.js** on the target computer from https://nodejs.org/
3. **Run the setup script**:
   - Double-click `portable-setup.bat`
   - Wait for dependencies to install
4. **Start the application**:
   - Double-click `start-chatbot.bat`

## Usage

### Starting the Chatbot
- Double-click `start-chatbot.bat`
- Two command windows will open (backend and frontend)
- Open your browser and go to `http://localhost:3000`

### Stopping the Chatbot
- Double-click `stop-chatbot.bat`
- Or close the command windows manually

## Files Included
- All source code (frontend & backend)
- Configuration files
- Assets and images
- Setup and start scripts

## What Happens During Setup
1. Checks if Node.js is installed
2. Installs all required npm packages for backend
3. Installs all required npm packages for frontend
4. Builds the frontend for production

## Troubleshooting

### If setup fails:
1. Make sure Node.js is installed
2. Run Command Prompt as Administrator
3. Run `portable-setup.bat` again

### If chatbot won't start:
1. Check if ports 3000 and 5000 are available
2. Run `stop-chatbot.bat` first
3. Try `start-chatbot.bat` again

### If you get permission errors:
1. Right-click the .bat files
2. Select "Run as administrator"

## Technical Details
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: In-memory (no external database required)
- Real-time: Socket.IO for chat functionality

## Contact
For technical support, contact the development team.
