import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Results() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const resultId = location.state?.resultId || new URLSearchParams(location.search).get("id");

  useEffect(() => {
    if (!resultId) {
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:8000/api/results/${resultId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResult(res.data);
      } catch (error) {
        console.error("Failed to fetch result", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [resultId]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p>Analyzing your performance...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={{ fontSize: "16px", color: "#64748b" }}>No result found. Please complete an interview first.</p>
          <button onClick={() => navigate("/dashboard")} style={styles.buttonMain}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  // Handle both the new AI schema (result.evaluation) and the old simple schema (result)
  const score = result.evaluation?.score || result.score || 0;
  const feedback = result.evaluation?.feedback || result.feedback || "No feedback provided.";
  const strengths = result.evaluation?.strengths || result.strengths || [];
  const weaknesses = result.evaluation?.weaknesses || result.weaknesses || [];

  // New specific feedbacks
  const codingFeedback = result.evaluation?.coding_feedback;
  const conceptualFeedback = result.evaluation?.conceptual_feedback;

  // Improvements from assessment
  const resumeImprovements = result.interview?.assessment?.resume_improvements || [];

  const chartData = {
    labels: ["Score", "Room for Improvement"],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444", "#f1f5f9"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: "75%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>Evaluation Result</h1>
          <p style={styles.pageSubtitle}>Here is your detailed AI assessment breakdown.</p>
        </div>

        <div style={styles.grid}>
          {/* LEFT COLUMN: Score & Overview */}
          <div style={styles.leftCol}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Overall Performance</h3>
              <div style={styles.chartContainer}>
                <Doughnut data={chartData} options={chartOptions} />
                <div style={styles.scoreOverlay}>
                  <span style={styles.scoreText}>{score}</span>
                  <span style={styles.scoreSub}>/ 100</span>
                </div>
              </div>
              <p style={styles.feedbackText}>{feedback}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div style={styles.card}>
              <div style={styles.bulletSection}>
                <h4 style={{ color: "#10b981", margin: "0 0 10px 0" }}>✅ Top Strengths</h4>
                <ul style={styles.list}>
                  {strengths.length ? strengths.map((s, i) => <li key={i}>{s}</li>) : <li>N/A</li>}
                </ul>
              </div>
              <div style={styles.bulletSection}>
                <h4 style={{ color: "#ef4444", margin: "0 0 10px 0" }}>📈 Areas for Improvement</h4>
                <ul style={styles.list}>
                  {weaknesses.length ? weaknesses.map((w, i) => <li key={i}>{w}</li>) : <li>N/A</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Detailed Feedback & Resume Improvements */}
          <div style={styles.rightCol}>
            {/* Detailed Feedback Cards */}
            {(codingFeedback || conceptualFeedback) && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Specific Feedback</h3>

                {conceptualFeedback && (
                  <div style={styles.feedbackBlock}>
                    <h4 style={styles.subHeading}>🧠 Conceptual Understanding</h4>
                    <p>{conceptualFeedback}</p>
                  </div>
                )}

                {codingFeedback && (
                  <div style={styles.feedbackBlock}>
                    <h4 style={styles.subHeading}>💻 Coding & Practical Skills</h4>
                    <p>{codingFeedback}</p>
                  </div>
                )}
              </div>
            )}

            {/* Resume Improvements */}
            {resumeImprovements.length > 0 && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Resume Enhancement Suggestions</h3>
                <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "20px" }}>
                  Based on our analysis, here are recommendations to improve your resume before applying.
                </p>

                <div style={styles.improvementList}>
                  {resumeImprovements.map((imp, idx) => {
                    const isObj = typeof imp === 'object' && imp !== null;
                    const category = isObj ? (imp.category || 'SUGGESTION') : 'TIP';
                    const suggestion = isObj ? (imp.suggestion || JSON.stringify(imp)) : imp;
                    return (
                      <div key={idx} style={styles.improvementItem}>
                        <span style={styles.impCategory}>{String(category).toUpperCase()}</span>
                        <p style={styles.impSuggestion}>{suggestion}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.actionRow}>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <button style={styles.buttonOutline}>← Back to Dashboard</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    paddingBottom: "50px"
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    textAlign: "center",
    marginBottom: "40px"
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 10px 0"
  },
  pageSubtitle: {
    fontSize: "16px",
    color: "#64748b"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.6fr",
    gap: "24px",
    alignItems: "start"
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
    boxBorder: "border-box",
    margin: "0 0 20px 0",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "10px"
  },
  chartContainer: {
    position: "relative",
    width: "180px",
    height: "180px",
    margin: "0 auto 20px auto"
  },
  scoreOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  scoreText: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: "1"
  },
  scoreSub: {
    fontSize: "14px",
    color: "#94a3b8",
    fontWeight: "600"
  },
  feedbackText: {
    fontSize: "15px",
    color: "#334155",
    lineHeight: "1.6",
    textAlign: "center"
  },
  bulletSection: {
    marginBottom: "20px"
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
    color: "#475569",
    lineHeight: "1.6",
    fontSize: "14px"
  },
  feedbackBlock: {
    backgroundColor: "#f8fafc",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "15px",
    borderLeft: "4px solid #3b82f6"
  },
  subHeading: {
    margin: "0 0 8px 0",
    fontSize: "15px",
    color: "#1e293b"
  },
  improvementList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  improvementItem: {
    backgroundColor: "#fffbeb",
    border: "1px solid #fde68a",
    padding: "16px",
    borderRadius: "8px"
  },
  impCategory: {
    display: "inline-block",
    backgroundColor: "#f59e0b",
    color: "white",
    fontSize: "10px",
    fontWeight: "700",
    padding: "4px 8px",
    borderRadius: "20px",
    marginBottom: "8px"
  },
  impSuggestion: {
    margin: 0,
    fontSize: "14px",
    color: "#78350f",
    lineHeight: "1.5"
  },
  actionRow: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center"
  },
  buttonOutline: {
    backgroundColor: "transparent",
    color: "#64748b",
    border: "2px solid #cbd5e1",
    padding: "12px 30px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  buttonMain: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer"
  },
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    color: "#64748b"
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px"
  }
};

// Add standard css for spinner since objects can't include keyframes cleanly
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);
}