# 🚀 AI Interview Simulator

**AI Interview Simulator** is a powerful web-based application designed to provide job seekers with realistic, AI-driven interview practice. Leveraging the power of Google's advanced Generative AI (Groq / Llama 3), the platform analyzes a candidate's resume and target role to generate a dynamic, fully tailored interview experience. 

The application evaluates candidates across both conceptual knowledge and hands-on coding skills, providing instant, highly detailed feedback and resume improvement strategies to help individuals land their dream jobs.

## Table of Contents
- [Features](#features)
- [Technical Requirements](#technical-requirements)
- [Functional Requirements](#functional-requirements)
- [Constraints & Challenges](#constraints--challenges)

## ✨ Features
- **User Authentication:** Secure registration and login using JWT.
- **Dynamic Assessment Generation:** Upload a resume and select a role (e.g., Software Engineer, Data Scientist) to generate a personalized behavioral, conceptual, and technical interview.
- **Multi-Stage Interview Room:** 
  - **Stage 1:** Pre-Interview Briefing based on resume analysis.
  - **Stage 2:** Interactive Questionnaire with timed conceptual/behavioral questions and optional Voice-to-Text inputs.
  - **Stage 3:** Hands-on Skill Test featuring a split-screen IDE for real-time coding challenges with AI-generated test cases.
- **Comprehensive Evaluation JSON Reports:** Detailed breakdowns of:
  - Overall Performance Score (0-100)
  - Specific Conceptual Feedback
  - Specific Coding/Technical Feedback
  - Top Strengths & Areas for Improvement
- **ATS Optimization:** Intelligent, AI-driven suggestions to rewrite and enhance specific bullet points on the candidate's resume based on their test performance.

## 🛠 Technical Requirements
- **Frontend:** React.js, HTML, CSS, JavaScript, Chart.js (for analytics)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **APIs & AI:** Groq SDK (Llama 3 70B Versatile model for fast inference)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt

## ⚙️ Functional Requirements
- **Secure File Handling:** Securely parse and extract text from uploaded user resumes (PDFs) before passing them to the LLM.
- **Strict Data Formatting:** Enforce structured JSON schemas during interactions with Generative AI to ensure the UI can consistently parse multi-dimensional grading logic.
- **Dashboard Tracking:** Track historical scores and render dynamic performance charts over time.
- **Robust Error Handling:** Ensure the application elegantly falls back to a 0 score and provides safe error feedback rather than crashing if the candidate submits empty answers or malformed code.

## ⚠️ Constraints & Challenges
- **AI Schema Hallucinations:** Large Language Models inherently struggle with strict boundary formatting (e.g., prepending conversational text to JSON objects). This required writing a highly resilient backend regex parser to extract valid JSON blocks from unpredictable inputs.
- **State Management:** Managing a complex multi-stage fluid UI (Briefing -> Questions -> Code Editor -> Results) without data loss required careful React state lifting and lifecycle management.
- **AI Math Logic:** Enforcing strict numerical grading constraints (e.g., forcing the AI to give a 0 instead of a default passing score for totally blank answers) required highly specific prompt engineering and manual backend verification overrides to prevent AI leniency.

