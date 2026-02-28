# AI-Powered Interview Simulator 🚀

The AI Interview Simulator is a full-stack web application designed to help job seekers practice technical interviews. It allows users to upload their resumes, generates customized, relevant interview questions using OpenAI, and provides a real-time interview environment complete with voice-to-text recognition and strict countdown timers. 

After completing the interview, an AI agent evaluates the answers, grades the performance out of 100, and provides personalized feedback highlighting both strengths and weaknesses.

## ✨ Features
- **User Authentication:** Secure registration and login using JWT.
- **Resume Parsing:** Upload PDF resumes which are parsed server-side to extract core skills and experience.
- **AI Question Generation:** Integration with OpenAI to generate dynamic, challenging questions tailored to the candidate's resume.
- **Real-Time Interview Environment:** Uses Socket.io and real-time timers to simulate high-pressure interview environments.
- **Speech-to-Text Integration:** Uses the browser's Web Speech API to allow candidates to speak their answers out loud.
- **AI Performance Evaluation:** Answers are graded by OpenAI, providing a final score, holistic feedback, and bulleted lists of strengths and areas for improvement.
- **Analytics Dashboard:** Visualizes past interview scores using interactive Line and Doughnut charts via Chart.js.
- **Admin Panel:** Separate protected routing for Administrator roles to view platform-wide analytics (Total Users, Total Interviews, System-wide Average Score).

## 🛠 Tech Stack
**Frontend:**
- React (Create React App)
- React Router (Routing/Navigation)
- Chart.js & React-Chartjs-2 (Data Visualization)
- Axios (HTTP Client)
- Web Speech API (Voice-to-text)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose (Database)
- OpenAI API (AI Intelligence)
- Socket.io (Real-time features)
- Multer & PDF-Parse (Resume Handling)
- JSON Web Tokens (JWT) & bcryptjs (Security)

## 📥 Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (local or Atlas)
- OpenAI API Key

### Installation

1. **Clone the repository** (if you haven't already).
2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file inside the `server` directory:
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   OPENAI_API_KEY=your_openai_api_key
   ```
4. **Start the Backend Server:**
   ```bash
   npm run dev
   # or node server.js
   ```

5. **Setup the Frontend:**
   ```bash
   cd ../client
   npm install
   ```
6. **Start the Frontend Client:**
   ```bash
   npm start
   ```

## 🏗 Architecture Flow
1. **User registers/logs in** and receives a JWT.
2. **User uploads a PDF resume**, which is parsed and saved alongside their profile in MongoDB.
3. User navigates to the **Dashboard** and clicks **"Start Interview"**. 
4. The backend pulls the parsed resume text, sends it to **OpenAI**, and receives dynamically generated JSON questions. 
5. The frontend connects to the **Socket.io** WebSocket and guides the user through the questions sequentially, recording their voice answers.
6. Upon completion, answers are POSTed to the backend. The backend constructs a grading rubric prompt and sends the QA pairing to **OpenAI for evaluation**.
7. The evaluation is saved into `InterviewResult` models. The frontend receives the ID and redirects to the **Results page** to display visual charts.
