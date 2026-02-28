import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

export default function InterviewRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const interview = location.state?.interview;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  // Day 5 Features: Timer & Voice
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRecording, setIsRecording] = useState(false);

  const socketRef = useRef();
  const recognitionRef = useRef();

  useEffect(() => {
    // 1. Connect to Socket.io
    socketRef.current = io("http://localhost:8000");
    if (interview) {
      socketRef.current.emit("join_interview", interview._id);
    }

    // 2. Setup Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setCurrentAnswer((prev) => prev + " " + finalTranscript.trim());
        }
      };
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [interview]);

  // Timer Countdown Logic
  useEffect(() => {
    if (!interview) return;

    if (timeLeft === 0) {
      handleNext(); // Auto-submit when timer hits 0
      return;
    }

    const timerObj = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerObj);
  }, [timeLeft, interview, currentQuestionIndex]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  if (!interview || !interview.questions) {
    return (
      <div className="page-container">
        <div className="card">
          <p>No active interview session found. Please start one from the dashboard.</p>
          <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const questions = interview.questions;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleNext = async () => {
    if (isRecording) toggleRecording(); // Stop recording if active

    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setCurrentAnswer("");
    setTimeLeft(60); // Reset timer for next question

    if (isLastQuestion) {
      // Submit all answers
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          "http://localhost:8000/api/interview/submit",
          {
            interviewId: interview._id,
            answers: newAnswers
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        navigate("/results", { state: { resultId: response.data.resultId } });
      } catch (error) {
        console.error("Failed to submit answers");
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Interview Session ({currentQuestionIndex + 1}/{questions.length})</h2>
          <h2 style={{ color: timeLeft < 15 ? "red" : "black" }}>⏳ {timeLeft}s</h2>
        </div>

        <h3>Question:</h3>
        <p>{questions[currentQuestionIndex]}</p>

        <textarea
          rows="6"
          placeholder="Type your answer here or use the microphone..."
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          style={{ width: "100%", padding: "10px", marginTop: "10px" }}
        />

        <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={toggleRecording}
            style={{ backgroundColor: isRecording ? "#ff4c4c" : "#4CAF50" }}
          >
            {isRecording ? "🔴 Stop Recording" : "🎤 Start Recording"}
          </button>

          <button onClick={handleNext}>
            {isLastQuestion ? "Submit Interview" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
}