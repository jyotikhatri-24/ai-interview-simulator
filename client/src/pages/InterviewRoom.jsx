import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

export default function InterviewRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(location.state?.interview || null);
  const [loading, setLoading] = useState(!location.state?.interview);

  const assessment = session?.assessment || session?.assessment;
  const questions = assessment?.interview_questions || session?.questions || [];
  const skillTest = assessment?.skill_test || session?.skillTest || null;

  // Stages: 0 = Briefing, 1 = Questionnaire, 2 = Skill Test
  const [stage, setStage] = useState(0);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionAnswers, setQuestionAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState("");

  const [skillAnswer, setSkillAnswer] = useState("");

  const [timeLeft, setTimeLeft] = useState(1800);
  const [isRecording, setIsRecording] = useState(false);

  // Code execution state
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  useEffect(() => {
    if (!session) {
      const token = localStorage.getItem("token");
      axios.get(`${import.meta.env.VITE_API_URL}/api/interview/session`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (res.data) {
            setSession(res.data);
            setCurrentQuestionIndex(res.data.currentQuestionIndex || 0);
            setQuestionAnswers(res.data.answers || []);
            setSkillAnswer(res.data.skillAnswer || "");
            // Resume from where left off if they were already in questions
            if (res.data.currentQuestionIndex > 0) setStage(1);
          }
        })
        .catch(err => console.error("Error fetching session", err))
        .finally(() => setLoading(false));
    }
  }, [session]);

  const socketRef = useRef();
  const recognitionRef = useRef();

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL.replace("/api", ""));
    if (session) {
      socketRef.current.emit("join_interview", session._id);
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
        if (finalTranscript && stage === 1) {
          setCurrentAnswer((prev) => prev + " " + finalTranscript.trim());
        }
      };
    }

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, [session, stage]);

  useEffect(() => {
    if (!session || stage === 0) return;
    if (timeLeft <= 0) { submitInterview(true); return; }
    const timerObj = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerObj);
  }, [timeLeft, session, stage]);

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
        `${import.meta.env.VITE_API_URL}/api/interview/submit`,
        { sessionId: session._id, answers: finalAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/results", { state: { resultId: response.data.resultId } });
    } catch (error) {
      console.error("Failed to submit answers");
    }
  };

  const handleNextQuestion = async () => {
    if (isRecording) toggleRecording();
    const newAnswers = [...questionAnswers];
    newAnswers[currentQuestionIndex] = currentAnswer;
    setQuestionAnswers(newAnswers);

    // Partially save progress to server
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_API_URL}/api/interview/answer`, {
        sessionId: session._id,
        questionIndex: currentQuestionIndex,
        answer: currentAnswer
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error("Failed to sync answer", err);
    }

    setCurrentAnswer("");

    if (currentQuestionIndex === questions.length - 1) {
      if (skillTest) setStage(2);
      else submitInterview();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  if (loading) {
    return (
      <div style={s.container}>
        <div style={s.emptyCard}>
          <div style={s.spinner} />
          <p style={{ marginTop: "16px" }}>Restoring session...</p>
        </div>
      </div>
    );
  }

  if (!session || !assessment) {
    return (
      <div style={s.container}>
        <div style={s.emptyCard}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎙️</div>
          <p style={{ color: "#64748b", marginBottom: "24px", fontSize: "15px" }}>
            No active interview assessment found. Please start one from the dashboard.
          </p>
          <button onClick={() => navigate("/dashboard")} style={s.btnPrimary}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const sc = seconds % 60;
    return `${m}:${sc < 10 ? "0" : ""}${sc}`;
  };

  const progress = ((currentQuestionIndex) / questions.length) * 100;
  const handleRunCode = async () => {
    if (!skillAnswer.trim()) return;
    setExecuting(true);
    setExecutionResult(null);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/execute`, {
        source_code: skillAnswer
      }, { headers: { Authorization: `Bearer ${token}` } });
      setExecutionResult(response.data);
    } catch (err) {
      setExecutionResult({ error: "Failed to connect to execution engine" });
    } finally {
      setExecuting(false);
    }
  };

  const isUrgent = timeLeft < 300;

  /* ─── STAGE 0: Briefing ─── */
  if (stage === 0) {
    return (
      <div style={s.stageBg}>
        <style>{keyframesCss}</style>
        <div style={s.briefingLayout}>

          {/* Decorative left panel */}
          <div style={s.briefingLeft}>
            <div style={s.briefingLeftInner}>
              <div style={s.briefingBigIcon}>🎙️</div>
              <h2 style={s.briefingLeftTitle}>Your Interview is Ready</h2>
              <p style={s.briefingLeftSub}>AI-powered, personalized to your resume</p>
              <div style={s.briefingStats}>
                <div style={s.bStat}>
                  <span style={s.bStatNum}>{questions.length}</span>
                  <span style={s.bStatLabel}>Questions</span>
                </div>
                {skillTest && (
                  <div style={s.bStat}>
                    <span style={s.bStatNum}>1</span>
                    <span style={s.bStatLabel}>Skill Test</span>
                  </div>
                )}
                <div style={s.bStat}>
                  <span style={s.bStatNum}>30m</span>
                  <span style={s.bStatLabel}>Time Limit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right content panel */}
          <div style={s.briefingRight}>
            <div style={s.briefingRightInner}>
              <div style={s.sectionTag}>📋 Pre-Interview Briefing</div>
              <h1 style={s.briefingTitle}>Let's set you up for success</h1>
              <p style={s.briefingSubtitle}>
                Your resume has been analyzed and your personalized assessment is ready.
              </p>

              {assessment.resume_analysis && (
                <div style={s.analysisBox}>
                  <h3 style={s.analysisTitle}>📄 Resume Analysis</h3>
                  <p style={{ fontSize: "14px", lineHeight: "1.7", color: "#334155", marginBottom: "12px" }}>
                    {assessment.resume_analysis.summary}
                  </p>
                  {assessment.resume_analysis.key_skills_found?.length > 0 && (
                    <div style={s.skillTags}>
                      {assessment.resume_analysis.key_skills_found.map((skill, i) => (
                        <span key={i} style={s.skillTag}>{skill}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={s.infoBox}>
                <p style={{ margin: "0 0 12px 0", fontWeight: "700", color: "#0f172a", fontSize: "15px" }}>
                  📌 This session includes:
                </p>
                <ul style={s.infoList}>
                  <li style={s.infoItem}>
                    <span style={s.infoIcon}>💬</span>
                    {questions.length} conceptual interview questions
                  </li>
                  {skillTest && (
                    <li style={s.infoItem}>
                      <span style={s.infoIcon}>💻</span>
                      1 hands-on {skillTest?.type || "scenario"} assessment
                    </li>
                  )}
                  <li style={{ ...s.infoItem, color: "#b45309" }}>
                    <span style={s.infoIcon}>⏱️</span>
                    30-minute time limit (starts after you click Begin)
                  </li>
                </ul>
              </div>

              <button onClick={() => setStage(1)} style={s.btnBegin}>
                Begin Interview 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── STAGE 1: Questions ─── */
  if (stage === 1) {
    return (
      <div style={s.stageBg}>
        <style>{keyframesCss}</style>

        {/* Top Bar */}
        <div style={s.topBar}>
          <div style={{ ...s.timerPill, ...(isUrgent ? s.timerUrgent : {}) }}>
            ⏱ {formatTime(timeLeft)}
          </div>
          <div style={s.progressInfo}>
            <span style={s.progressLabel}>Question {currentQuestionIndex + 1} of {questions.length}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={s.progressBarTrack}>
          <div style={{ ...s.progressBarFill, width: `${progress}%` }} />
        </div>

        <div style={s.questionCard}>
          <div style={s.questionMeta}>
            <span style={s.qNumBadge}>Q{currentQuestionIndex + 1}</span>
            <span style={s.qLabel}>Interview Question</span>
          </div>

          <p style={s.questionText}>{questions[currentQuestionIndex]}</p>

          <div style={s.textareaWrapper}>
            <textarea
              rows="8"
              placeholder="Type your answer here, or use the microphone below to speak your response..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              style={s.textArea}
            />
            {isRecording && (
              <div style={s.recordingBadge}>
                <span style={s.recordingDot} /> Recording...
              </div>
            )}
          </div>

          <div style={s.actionBar}>
            <button
              onClick={toggleRecording}
              style={{ ...s.micBtn, ...(isRecording ? s.micBtnActive : {}) }}
            >
              {isRecording ? "🔴 Stop Recording" : "🎤 Use Microphone"}
            </button>

            <button onClick={handleNextQuestion} style={s.btnPrimary}>
              {currentQuestionIndex === questions.length - 1
                ? (skillTest ? "Proceed to Skill Test →" : "Submit Interview →")
                : "Next Question →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── STAGE 2: Skill Test ─── */
  if (stage === 2) {
    const p = skillTest.problem;
    return (
      <div style={{ ...s.stageBg, paddingTop: 0 }}>
        <style>{keyframesCss}</style>

        {/* Top Bar */}
        <div style={s.topBarDark}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={s.stageTag}>Final Stage</span>
            <span style={s.stageTitle}>Hands-on Assessment</span>
          </div>
          <div style={{ ...s.timerPill, ...(isUrgent ? s.timerUrgent : {}) }}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        <div style={s.splitLayout}>
          {/* Problem Panel */}
          <div style={{ ...s.splitPanel, flex: "1.1 1 0" }}>
            <div style={s.panelHeader}>
              {p && (
                <>
                  <h2 style={s.problemTitle}>{p.problem_title || skillTest.scenario}</h2>
                  {p.difficulty_level && (
                    <span style={{
                      ...s.diffBadge,
                      background: p.difficulty_level?.toLowerCase() === "easy"
                        ? "#dcfce7" : p.difficulty_level?.toLowerCase() === "medium"
                          ? "#fef3c7" : "#fee2e2",
                      color: p.difficulty_level?.toLowerCase() === "easy"
                        ? "#15803d" : p.difficulty_level?.toLowerCase() === "medium"
                          ? "#b45309" : "#b91c1c",
                    }}>
                      {p.difficulty_level}
                    </span>
                  )}
                </>
              )}
            </div>

            <div style={s.panelBody}>
              {p ? (
                <>
                  <div style={s.contentSection}>
                    <h4 style={s.sectionHead}>📝 Description</h4>
                    <p style={s.sectionBody}>{p.problem_description || skillTest.candidate_task}</p>
                  </div>

                  {p.constraints && (
                    <div style={s.contentSection}>
                      <h4 style={s.sectionHead}>📐 Constraints</h4>
                      <code style={s.codeInline}>
                        {typeof p.constraints === "object" ? JSON.stringify(p.constraints) : p.constraints}
                      </code>
                    </div>
                  )}

                  {(p.example_input || p.example_output) && (
                    <div style={s.exampleBox}>
                      <h4 style={{ ...s.sectionHead, marginBottom: "10px" }}>💡 Example</h4>
                      <p style={s.exampleLine}><strong>Input:</strong> <code>{typeof p.example_input === "object" ? JSON.stringify(p.example_input) : p.example_input}</code></p>
                      <p style={s.exampleLine}><strong>Output:</strong> <code>{typeof p.example_output === "object" ? JSON.stringify(p.example_output) : p.example_output}</code></p>
                      {p.explanation && (
                        <p style={s.exampleLine}><strong>Explanation:</strong> {typeof p.explanation === "object" ? JSON.stringify(p.explanation) : p.explanation}</p>
                      )}
                    </div>
                  )}

                  {skillTest.test_cases && (
                    <div style={{ ...s.contentSection, background: "#f8fafc", borderRadius: "12px", padding: "16px", marginTop: "16px" }}>
                      <h4 style={s.sectionHead}>🧪 Test Cases</h4>
                      <p style={{ fontSize: "13px", color: "#64748b" }}>
                        Your solution will be evaluated against <strong>{skillTest.test_cases.length}</strong> hidden test cases.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p style={s.sectionBody}>Provide a detailed response to the practical scenario.</p>
              )}
            </div>
          </div>

          {/* Editor Panel */}
          <div style={{ ...s.splitPanel, flex: "1.8 1 0", background: "#0f1117", display: "flex", flexDirection: "column" }}>
            <div style={s.editorHeader}>
              <div style={s.editorHeaderLeft}>
                <span style={s.editorDot} />
                <span style={{ ...s.editorDot, background: "#f59e0b" }} />
                <span style={{ ...s.editorDot, background: "#10b981" }} />
                <span style={s.editorTitle}>Solution Workspace</span>
              </div>
              <span style={s.editorBadge}>AI Evaluated</span>
            </div>

            <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
              <textarea
                value={skillAnswer}
                onChange={(e) => setSkillAnswer(e.target.value)}
                placeholder="// Write your code or detailed solution here..."
                style={{ ...s.codeEditor, flex: executionResult ? "0.6" : "1" }}
              />

              {executionResult && (
                <div style={s.outputPanel}>
                  <div style={s.outputHeader}>
                    <span>Terminal / Output</span>
                    <button onClick={() => setExecutionResult(null)} style={s.closeOutput}>×</button>
                  </div>
                  <pre style={s.outputContent}>
                    {executionResult.error ? (
                      <span style={{ color: "#ef4444" }}>{executionResult.error}</span>
                    ) : (
                      <>
                        {executionResult.stdout || <span style={{ color: "#64748b" }}>(No output)</span>}
                        {executionResult.stderr && <div style={{ color: "#ef4444", marginTop: "8px" }}>{executionResult.stderr}</div>}
                        {executionResult.compile_output && <div style={{ color: "#f59e0b", marginTop: "8px" }}>{executionResult.compile_output}</div>}
                        <div style={s.executionMeta}>
                          Status: {executionResult.status?.description} | Time: {executionResult.time}s | Mem: {executionResult.memory}KB
                        </div>
                      </>
                    )}
                  </pre>
                </div>
              )}
            </div>

            <div style={s.editorFooter}>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={handleRunCode}
                  disabled={executing}
                  style={{ ...s.btnRun, opacity: executing ? 0.7 : 1 }}
                >
                  {executing ? "Running..." : "▶ Run Code"}
                </button>
                <span style={s.editorHint}>Use JavaScript. Logic and performance will be evaluated.</span>
              </div>
              <button onClick={() => submitInterview()} style={s.btnSubmit}>
                Submit Assessment →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// ─── Inline keyframes ───────────────────────────────────────────────────
const keyframesCss = `
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
    70%  { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
    100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
`;

// ─── Styles ──────────────────────────────────────────────────────────────
const s = {
  stageBg: {
    minHeight: "100vh",
    background: "#f4f7fa",
    fontFamily: "'Inter', sans-serif",
    paddingBottom: "40px",
  },

  /* Briefing */
  briefingLayout: {
    display: "flex",
    minHeight: "100vh",
  },
  briefingLeft: {
    width: "380px",
    flexShrink: 0,
    background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 40px",
  },
  briefingLeftInner: {
    textAlign: "center",
    color: "#fff",
  },
  briefingBigIcon: {
    fontSize: "64px",
    marginBottom: "24px",
    display: "block",
    filter: "drop-shadow(0 4px 12px rgba(99,102,241,0.5))",
  },
  briefingLeftTitle: {
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "8px",
    letterSpacing: "-0.3px",
  },
  briefingLeftSub: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.5)",
    marginBottom: "40px",
  },
  briefingStats: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
  },
  bStat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "14px",
    padding: "16px 20px",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  bStatNum: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#a5b4fc",
    marginBottom: "4px",
  },
  bStatLabel: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.4)",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  briefingRight: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 50px",
    overflowY: "auto",
  },
  briefingRightInner: {
    maxWidth: "640px",
    width: "100%",
  },
  sectionTag: {
    display: "inline-block",
    padding: "5px 14px",
    background: "rgba(236,72,153,0.08)",
    border: "1px solid rgba(236,72,153,0.2)",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#ec4899",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: "16px",
  },
  briefingTitle: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.5px",
    marginBottom: "10px",
  },
  briefingSubtitle: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "28px",
    lineHeight: "1.6",
  },
  analysisBox: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderLeft: "4px solid #6366f1",
    borderRadius: "14px",
    padding: "20px 24px",
    marginBottom: "20px",
  },
  analysisTitle: {
    fontWeight: "700",
    fontSize: "15px",
    color: "#0f172a",
    marginBottom: "10px",
  },
  skillTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "10px",
  },
  skillTag: {
    padding: "4px 12px",
    background: "#fce7f3",
    color: "#be185d",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },
  infoBox: {
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "14px",
    padding: "20px 24px",
    marginBottom: "28px",
  },
  infoList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    color: "#475569",
    fontWeight: "500",
  },
  infoIcon: {
    width: "28px",
    height: "28px",
    background: "#fff",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    fontSize: "15px",
    flexShrink: 0,
  },
  btnBegin: {
    width: "100%",
    padding: "17px",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 8px 24px rgba(15,23,42,0.25)",
    transition: "all 0.2s",
  },

  /* Q&A Stage top bar */
  topBar: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 32px",
    background: "rgba(245,208,221,0.9)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(236,72,153,0.08)",
  },
  timerPill: {
    padding: "8px 18px",
    background: "#fce7f3",
    color: "#be185d",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "15px",
    letterSpacing: "0.5px",
  },
  timerUrgent: {
    background: "#fee2e2",
    color: "#dc2626",
    animation: "pulse-ring 1.5s infinite",
  },
  progressInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  progressLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#64748b",
  },
  progressBarTrack: {
    height: "3px",
    background: "#e2e8f0",
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #ec4899, #f472b6)",
    borderRadius: "999px",
    transition: "width 0.4s ease",
  },
  questionCard: {
    maxWidth: "820px",
    margin: "40px auto 0 auto",
    background: "#fff",
    borderRadius: "24px",
    padding: "48px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  questionMeta: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "24px",
  },
  qNumBadge: {
    padding: "6px 14px",
    background: "linear-gradient(135deg, #ec4899, #f472b6)",
    color: "#fff",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
  },
  qLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  questionText: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: "1.5",
    marginBottom: "28px",
    letterSpacing: "-0.2px",
  },
  textareaWrapper: {
    position: "relative",
  },
  textArea: {
    width: "100%",
    padding: "20px",
    borderRadius: "14px",
    border: "2px solid #e2e8f0",
    fontSize: "15px",
    lineHeight: "1.7",
    outline: "none",
    resize: "vertical",
    minHeight: "160px",
    fontFamily: "'Inter', sans-serif",
    boxSizing: "border-box",
    color: "#0f172a",
    transition: "border-color 0.2s",
  },
  recordingBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 12px",
    background: "#fee2e2",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#dc2626",
  },
  recordingDot: {
    width: "8px",
    height: "8px",
    background: "#ef4444",
    borderRadius: "50%",
    animation: "blink 1s infinite",
    display: "inline-block",
  },
  actionBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "24px",
    gap: "16px",
  },
  micBtn: {
    padding: "12px 24px",
    background: "#f1f5f9",
    color: "#334155",
    border: "2px solid #e2e8f0",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.2s",
  },
  micBtnActive: {
    background: "#fee2e2",
    color: "#dc2626",
    border: "2px solid rgba(239,68,68,0.3)",
    animation: "pulse-ring 1.5s infinite",
  },
  btnPrimary: {
    padding: "14px 28px",
    background: "linear-gradient(135deg, #be185d, #ec4899)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 6px 18px rgba(236,72,153,0.35)",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },

  /* Skills Stage */
  topBarDark: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
    background: "#1e293b",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  stageTag: {
    padding: "4px 12px",
    background: "rgba(236,72,153,0.2)",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#fbcfe8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  stageTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
  },
  splitLayout: {
    display: "flex",
    height: "calc(100vh - 52px)",
  },
  splitPanel: {
    overflowY: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  panelHeader: {
    padding: "24px 28px 16px 28px",
    borderBottom: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  panelBody: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 28px",
  },
  problemTitle: {
    fontSize: "18px",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0,
  },
  diffBadge: {
    padding: "5px 12px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    flexShrink: 0,
  },
  contentSection: {
    marginBottom: "20px",
  },
  sectionHead: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "8px",
  },
  sectionBody: {
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.7",
    margin: 0,
  },
  codeInline: {
    display: "block",
    background: "#f1f5f9",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    color: "#475569",
    lineHeight: "1.6",
    wordBreak: "break-all",
  },
  exampleBox: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "16px 20px",
    borderLeft: "4px solid #94a3b8",
  },
  exampleLine: {
    margin: "0 0 8px 0",
    fontSize: "13px",
    color: "#334155",
    lineHeight: "1.6",
  },
  editorHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 20px",
    background: "#1a1a2e",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    flexShrink: 0,
  },
  editorHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  editorDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#ef4444",
    display: "inline-block",
  },
  editorTitle: {
    marginLeft: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "rgba(255,255,255,0.4)",
  },
  editorBadge: {
    padding: "4px 12px",
    background: "rgba(13,148,136,0.15)",
    border: "1px solid rgba(13,148,136,0.25)",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    color: "#6ee7b7",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  codeEditor: {
    flex: 1,
    width: "100%",
    padding: "24px",
    border: "none",
    outline: "none",
    resize: "none",
    fontSize: "14px",
    lineHeight: "1.7",
    fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
    background: "#0f1117",
    color: "#e2e8f0",
    boxSizing: "border-box",
  },
  editorFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    background: "#1a1a2e",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    flexShrink: 0,
    gap: "16px",
    flexWrap: "wrap",
  },
  editorHint: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.25)",
  },
  btnSubmit: {
    padding: "12px 28px",
    background: "linear-gradient(135deg, #ec4899, #f472b6)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 4px 14px rgba(236,72,153,0.4)",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  },
  btnRun: {
    padding: "12px 24px",
    background: "#334155",
    color: "#e2e8f0",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  outputPanel: {
    background: "#1a1a2e",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    flex: "0.4",
    overflow: "hidden",
  },
  outputHeader: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.03)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "11px",
    fontWeight: "700",
    color: "rgba(255,255,255,0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  closeOutput: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.5)",
    fontSize: "18px",
    cursor: "pointer",
    padding: "0 5px",
  },
  outputContent: {
    flex: 1,
    margin: 0,
    padding: "16px 20px",
    fontSize: "13px",
    lineHeight: "1.6",
    color: "#6ee7b7",
    fontFamily: "'Fira Code', monospace",
    overflowY: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
  },
  executionMeta: {
    marginTop: "16px",
    paddingTop: "12px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    fontSize: "11px",
    color: "rgba(255,255,255,0.2)",
    fontFamily: "'Inter', sans-serif",
  },

  emptyCard: {
    background: "#fff",
    padding: "60px",
    borderRadius: "24px",
    textAlign: "center",
    maxWidth: "480px",
    margin: "80px auto",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
  },
};