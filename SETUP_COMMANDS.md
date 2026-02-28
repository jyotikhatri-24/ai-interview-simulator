# AI Interview Simulator - Setup Commands

This document contains a list of commands used to set up the project phase by phase. You can run these commands in your terminal to replicate the environment or install missing dependencies.

## DAY 1: Frontend Setup (React)

Create React app and install core frontend dependencies:
```bash
# Create React app
npx create-react-app client

# Navigate to client directory
cd client

# Install routing and HTTP client
npm install react-router-dom axios

# Optional: Install testing libraries (usually included with create-react-app)
npm install @testing-library/react @testing-library/jest-dom @testing-library/user-event web-vitals
```

## DAY 2: Backend Setup & Authentication (Node.js/Express)

Initialize the backend and install essential packages:
```bash
# Create and navigate to server directory
mkdir server
cd server

# Initialize package.json
npm init -y

# Install core Express, MongoDB driver, and middleware
npm install express mongoose cors dotenv

# Install authentication libraries
npm install bcryptjs jsonwebtoken

# Check installed versions
npm list bcryptjs
npm list jsonwebtoken

# Install nodemon for development auto-restarts (dev dependency)
npm install -D nodemon
```

## DAY 3: Resume Upload & Parsing

Install libraries for handling file uploads (PDF) and extracting text:
```bash
# Navigate to server directory
cd server

# Install file upload and PDF parsing libraries
npm install multer pdf-parse

# Check installed versions
npm list multer
npm list pdf-parse
```

## DAY 4 & 5: AI Integration & WebSockets

Install the OpenAI SDK for question generation/evaluation, and Socket.io for real-time features:
```bash
# In the server directory:
npm install openai socket.io

# In the client directory:
cd ../client
npm install socket.io-client
```

## DAY 6: Performance Dashboard

Install charting library for performance analytics:
```bash
# In the client directory:
npm install chart.js react-chartjs-2
```

## Running the Application

To run both servers during development:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev # assuming "dev": "nodemon server.js" in package.json
```

**Terminal 2 (Frontend):**
```bash
cd client
npm start
```
