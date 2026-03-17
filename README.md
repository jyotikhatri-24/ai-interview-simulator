# 🚀 AI Interview Simulator

🔗 Live Frontend: https://ai-interview-simulator-bgpy-hjr00owj5.vercel.app
⚙️ Backend API: https://ai-interview-simulator-ns0b.onrender.com

**AI Interview Simulator** is an advanced, AI-powered web application designed to help job seekers practice and excel in technical interviews through realistic, personalized interview simulations.

Leveraging cutting-edge Generative AI (**Groq / Llama 3**), the platform analyzes a candidate’s resume and target role to dynamically generate tailored interview experiences. It evaluates both **conceptual understanding** and **hands-on coding ability**, delivering **instant, actionable feedback** and **ATS optimization insights** to improve job readiness.

---

## 📌 Table of Contents
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [⚙️ Functional Requirements](#-functional-requirements)
- [⚠️ Constraints & Challenges](#-constraints--challenges)

---

## ✨ Features

### 🔐 Authentication & Security
- Secure user authentication using **JWT & bcrypt**
- Protected routes and session handling

### 🧠 AI-Powered Interview Generation
- Upload resume + select target role (e.g., Software Engineer, Data Analyst)
- Generates **fully personalized interviews** using AI
- Covers:
  - Behavioral questions  
  - Conceptual questions  
  - Technical/coding challenges  

### 🧩 Multi-Stage Interview Experience
- **Stage 1: Pre-Interview Briefing**
  - Resume analysis with AI-generated insights  

- **Stage 2: Interactive Q&A Round**
  - Timed questions  
  - Optional **Voice-to-Text input**  

- **Stage 3: Coding Assessment**
  - Split-screen IDE  
  - Real-time code execution  
  - AI-generated test cases  

### 📊 Advanced Evaluation System
- Generates structured **JSON-based evaluation reports**
- Includes:
  - 🎯 Overall Score (0–100)
  - 📘 Conceptual Feedback
  - 💻 Coding Performance Analysis
  - ✅ Strengths & Weaknesses
  - 📈 Improvement Suggestions

### 📈 Analytics Dashboard
- Tracks:
  - Total interviews taken  
  - Average performance score  
  - Progress over time  
- Visualized using **Chart.js**

### 📄 ATS Resume Optimization
- AI suggests improvements to resume bullet points  
- Enhances **ATS compatibility + recruiter appeal**

### 🔁 Session Persistence
- Resume interview sessions even after reload  
- Seamless multi-stage navigation  

### ⚡ Secure Code Execution
- Integrated **Judge0 API**
- Real-time code execution with instant output

---

## 🛠 Tech Stack

### Frontend
- React.js  
- Tailwind CSS (UI/UX improvements)  
- JavaScript  
- Chart.js  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB (Mongoose ODM)

### AI & APIs
- Groq SDK (**Llama 3 70B**)  
- Judge0 API (code execution)

### Authentication
- JSON Web Tokens (JWT)  
- bcrypt  

---

## ⚙️ Functional Requirements

- 📂 **Secure Resume Processing**
  - Extract and parse text from uploaded PDFs safely  

- 🧾 **Strict JSON Schema Enforcement**
  - Ensures consistent AI response parsing  
  - Maintains structured evaluation output  

- 📊 **Performance Tracking**
  - Store and visualize user interview history  

- 🛡 **Robust Error Handling**
  - Handles:
    - Empty answers  
    - Invalid code submissions  
  - Prevents crashes with safe fallback responses  

---

## ⚠️ Constraints & Challenges

### 🤖 AI Output Inconsistency
- LLMs often break strict JSON formats  
- Solved using **custom regex-based JSON extraction logic**

### 🔄 Complex State Management
- Multi-stage flow (Briefing → Questions → Coding → Results)
- Managed using efficient React state handling and lifecycle design  

### 📉 AI Scoring Reliability
- AI tends to give overly lenient scores  
- Fixed using:
  - Prompt engineering  
  - Backend validation rules  
  - Forced scoring constraints  

---

## 🚀 Key Highlights

- End-to-end **full-stack AI application**
- Real-world **interview simulation system**
- Combines:
  - AI + Web Development  
  - Analytics + System Design  
- Designed for **scalability, accuracy, and user experience**

---

## 📌 Future Enhancements

- Video-based mock interviews 🎥  
- Company-specific interview modes (Amazon, Google, etc.)  
- Peer comparison analytics  
- Mobile app version  

---

## 👩‍💻 Author

**Jyoti Khatri**

---
