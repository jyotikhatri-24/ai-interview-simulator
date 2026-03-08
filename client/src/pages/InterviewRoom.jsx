import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

export default function InterviewRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const interview = location.state?.interview;

  // AI Assessment Object
  const assessment = interview?.assessment;

  // Stages: 0 = Briefing, 1 = Questionnaire, 2 = Skill Test
  const [stage, setStage] = useState(0);

  // Questionnaire State
  const questions = assessment?.interview_questions || [];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");

  // Skill Test State
  const skillTest = assessment?.skill_test || null;
  const [skillAnswer, setSkillAnswer] = useState("");

  // Timer & Voice
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins for the whole interview
  const [isRecording, setIsRecording] = useState(false);

  const socketRef = useRef();
  const recognitionRef = useRef();

  useEffect(() => {
    socketRef.current = io("http://localhost:8000");
    if (interview) {
      socketRef.current.emit("join_interview", interview._id);
    }

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
          if (stage === 1) {
            setCurrentAnswer((prev) => prev + " " + finalTranscript.trim());
          }
        }
      };
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [interview, stage]);

  useEffect(() => {
    if (!interview || stage === 0) return;

    if (timeLeft <= 0) {
      submitInterview(true); // Auto-submit when timer hits 0
      return;
    }

    const timerObj = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerObj);
  }, [timeLeft, interview, stage]);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const submitInterview = async (autoSubmit = false) => {
    if (isRecording) toggleRecording();

    // Final answer array to send to AI
    const finalAnswers = {
      questions: questionAnswers,
      skill_test_answer: skillAnswer
    };

    if (autoSubmit && stage === 1 && currentQuestionIndex < questions.length && currentAnswer) {
      finalAnswers.questions.push(currentAnswer);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/interview/submit",
        {
          interviewId: interview._id,
          answers: finalAnswers
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate("/results", { state: { resultId: response.data.resultId } });
    } catch (error) {
      console.error("Failed to submit answers");
    }
  };

  const handleNextQuestion = () => {
    if (isRecording) toggleRecording();

    const newAnswers = [...questionAnswers, currentAnswer];
    setQuestionAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentQuestionIndex === questions.length - 1) {
      // Move to skill test if exists, else submit
      if (skillTest) {
        setStage(2);
      } else {
        submitInterview();
      }
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  if (!interview || !assessment) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p>No active interview assessment found. Please start one from the dashboard.</p>
          <button onClick={() => navigate("/dashboard")} style={styles.buttonMain}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}: ${s < 10 ? '0' : ''}${s}`;
  };

  // Stage 0: Briefing
  if (stage === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.cardLarge}>
          <h2 style={styles.heading}>Pre-Interview Briefing</h2>
          <p style={styles.subtext}>Your resume has been analyzed and your assessment is ready.</p>

          {assessment.resume_analysis && (
            <div style={styles.sectionBox}>
              <h3 style={styles.sectionTitle}>📄 Resume Analysis Insight</h3>
              <p style={{ fontSize: "14px", lineHeight: "1.6" }}>{assessment.resume_analysis.summary}</p>
              <div style={{ marginTop: "10px" }}>
                <strong>Detected Skills: </strong>
                {assessment.resume_analysis.key_skills_found?.join(", ")}
              </div>
            </div>
          )}

          <div style={styles.infoBox}>
            <p><strong>This interview consists of:</strong></p>
            <ul style={styles.list}>
              <li>{questions.length} conceptual interview questions.</li>
              <li>1 hands-on {skillTest?.type || 'scenario'} assessment.</li>
            </ul>
            <p style={{ marginTop: "10px", color: "#e63946", fontWeight: "600" }}>Total Time Limit: 30 minutes</p>
          </div>

          <button onClick={() => setStage(1)} style={styles.buttonStart}>Begin Interview Setup</button>
        </div>
      </div>
    );
  }

  // Stage 1: Questions
  if (stage === 1) {
    return (
      <div style={styles.container}>
        <div style={styles.headerBar}>
          <div style={styles.timerBadge(timeLeft)}>⏳ {formatTime(timeLeft)}</div>
          <div style={styles.progressText}>Question {currentQuestionIndex + 1} of {questions.length}</div>
        </div>

        <div style={styles.cardLarge}>
          <h3 style={styles.questionHeading}>Question:</h3>
          <p style={styles.questionText}>{questions[currentQuestionIndex]}</p>

          <textarea
            rows="8"
            placeholder="Type your answer here or use the microphone..."
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            style={styles.textArea}
          />

          <div style={styles.actionBar}>
            <button
              onClick={toggleRecording}
              style={{ ...styles.buttonVoice, backgroundColor: isRecording ? "#ef4444" : "#10b981" }}
            >
              {isRecording ? "🔴 Stop Recording" : "🎤 Turn on Microphone"}
            </button>

            <button onClick={handleNextQuestion} style={styles.buttonMain}>
              {currentQuestionIndex === questions.length - 1 ? (skillTest ? "Proceed to Skill Test" : "Submit Interview") : "Next Question"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stage 2: Skill Test (Coding or Practical)
  if (stage === 2) {
    const p = skillTest.problem;
    return (
      <div style={styles.container}>
        <div style={styles.headerBar}>
          <div style={styles.timerBadge(timeLeft)}>⏳ {formatTime(timeLeft)}</div>
          <div style={styles.progressText}>Final Stage: Hands-on Assessment</div>
        </div>

        <div style={styles.twoColLayout}>
          {/* Left: Problem Statement */}
          <div style={{ ...styles.cardPanel, flex: 1.2 }}>
            {p ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={styles.problemTitle}>{p.problem_title || skillTest.scenario}</h2>
                  {p.difficulty_level && (
                    <span style={styles.difficultyBadge}>{p.difficulty_level}</span>
                  )}
                </div>

                <div style={styles.scrollableContent}>
                  <div style={styles.contentBlock}>
                    <h4>Description</h4>
                    <p>{p.problem_description || skillTest.candidate_task}</p>
                  </div>

                  {p.constraints && (
                    <div style={styles.contentBlock}>
                      <h4>Constraints</h4>
                      <code>{typeof p.constraints === 'object' ? JSON.stringify(p.constraints) : p.constraints}</code>
                    </div>
                  )}

                  {(p.example_input || p.example_output) && (
                    <div style={styles.exampleBox}>
                      <p><strong>Input:</strong> <code>{typeof p.example_input === 'object' ? JSON.stringify(p.example_input) : p.example_input}</code></p>
                      <p><strong>Output:</strong> <code>{typeof p.example_output === 'object' ? JSON.stringify(p.example_output) : p.example_output}</code></p>
                      {p.explanation && <p><strong>Explanation:</strong> {typeof p.explanation === 'object' ? JSON.stringify(p.explanation) : p.explanation}</p>}
                    </div>
                  )}

                  {skillTest.test_cases && (
                    <div style={{ marginTop: "20px" }}>
                      <h4>Hidden Test Cases (for Evaluation)</h4>
                      <p style={{ fontSize: "13px", color: "#666" }}>Your code will be evaluated against {skillTest.test_cases.length} strict test cases.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p>Provide a detailed response to the practical scenario.</p>
            )}
          </div>

          {/* Right: Code Editor / Text Area */}
          <div style={{ ...styles.cardPanel, flex: 1.8, display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h3 style={{ margin: 0, fontSize: "16px", color: "#333" }}>Solution Workspace</h3>
              <span style={{ fontSize: "12px", color: "#888", backgroundColor: "#f0f0f0", padding: "4px 10px", borderRadius: "10px" }}>
                Auto-evaluating via AI
              </span>
            </div>

            <textarea
              value={skillAnswer}
              onChange={(e) => setSkillAnswer(e.target.value)}
              placeholder="Write your code or detailed solution here..."
              style={styles.codeEditor}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "15px" }}>
              <button onClick={() => submitInterview()} style={{ ...styles.buttonMain, padding: "14px 30px", fontSize: "16px" }}>
                Submit Final Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px",
    fontFamily: "'Inter', sans-serif",
    minHeight: "100vh",
    backgroundColor: "#f8fafc"
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    textAlign: "center"
  },
  cardLarge: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    maxWidth: "800px",
    margin: "0 auto",
  },
  cardPanel: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    height: "calc(100vh - 150px)",
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  twoColLayout: {
    display: "flex",
    gap: "20px",
    alignItems: "stretch"
  },
  heading: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 10px 0"
  },
  subtext: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "30px"
  },
  sectionBox: {
    backgroundColor: "#f1f5f9",
    borderLeft: "4px solid #3b82f6",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "left"
  },
  sectionTitle: {
    margin: "0 0 10px 0",
    fontSize: "16px",
    color: "#1e293b"
  },
  infoBox: {
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    textAlign: "left"
  },
  list: {
    margin: "10px 0 0 0",
    paddingLeft: "20px",
    lineHeight: "1.8",
    color: "#475569"
  },
  headerBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    padding: "0 10px"
  },
  timerBadge: (time) => ({
    backgroundColor: time < 300 ? "#fee2e2" : "#e0e7ff",
    color: time < 300 ? "#dc2626" : "#4f46e5",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "700",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  }),
  progressText: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#64748b"
  },
  questionHeading: {
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#94a3b8",
    margin: "0 0 10px 0"
  },
  questionText: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#0f172a",
    lineHeight: "1.4",
    marginBottom: "30px"
  },
  textArea: {
    width: "100%",
    padding: "20px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    fontSize: "16px",
    lineHeight: "1.6",
    outline: "none",
    resize: "vertical",
    minHeight: "150px",
    fontFamily: "inherit",
    boxSizing: "border-box"
  },
  codeEditor: {
    flex: 1,
    width: "100%",
    padding: "20px",
    borderRadius: "12px",
    border: "2px solid #e2e8f0",
    fontSize: "15px",
    lineHeight: "1.6",
    outline: "none",
    resize: "none",
    fontFamily: "'Fira Code', 'Courier New', monospace",
    backgroundColor: "#1e1e1e", // Visual cue for code editor
    color: "#d4d4d4",
    boxSizing: "border-box"
  },
  actionBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "30px"
  },
  buttonMain: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s"
  },
  buttonStart: {
    backgroundColor: "#0f172a",
    color: "white",
    border: "none",
    padding: "16px 32px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%"
  },
  buttonVoice: {
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  problemTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0
  },
  difficultyBadge: {
    backgroundColor: "#fef3c7",
    color: "#b45309",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase"
  },
  scrollableContent: {
    overflowY: "auto",
    paddingRight: "10px",
    marginTop: "20px"
  },
  contentBlock: {
    marginBottom: "20px",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#334155"
  },
  exampleBox: {
    backgroundColor: "#f8fafc",
    padding: "15px",
    borderRadius: "8px",
    borderLeft: "4px solid #94a3b8",
    fontSize: "14px",
    lineHeight: "1.6"
  }
};