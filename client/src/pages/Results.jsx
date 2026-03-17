import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

// Animated counter hook
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return count;
}

export default function Results() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const resultId = location.state?.resultId || new URLSearchParams(location.search).get("id");

  useEffect(() => {
    if (!resultId) { setLoading(false); return; }
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
      <div style={s.page}>
        <style>{css}</style>
        <div style={s.loadingWrapper}>
          <div style={s.spinner} />
          <p style={s.loadingTitle}>Analyzing your performance...</p>
          <p style={s.loadingSubtitle}>Our AI is reviewing your responses</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={s.page}>
        <style>{css}</style>
        <div style={s.emptyCard}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
          <p style={{ fontSize: "16px", color: "#64748b", marginBottom: "24px" }}>
            No result found. Please complete an interview first.
          </p>
          <button onClick={() => navigate("/dashboard")} style={s.btnPrimary}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const score = result.evaluation?.score || result.score || 0;
  const feedback = result.evaluation?.feedback || result.feedback || "No feedback provided.";
  const strengths = result.evaluation?.strengths || result.strengths || [];
  const weaknesses = result.evaluation?.weaknesses || result.weaknesses || [];
  const codingFeedback = result.evaluation?.coding_feedback;
  const conceptualFeedback = result.evaluation?.conceptual_feedback;
  const resumeImprovements = result.interview?.assessment?.resume_improvements || [];

  const scoreColor = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const scoreBg = score >= 75 ? "#dcfce7" : score >= 50 ? "#fef3c7" : "#fee2e2";
  const scoreLabel = score >= 75 ? "Excellent" : score >= 50 ? "Good" : "Needs Work";

  const chartData = {
    datasets: [{
      data: [score, 100 - score],
      backgroundColor: [scoreColor, "#f1f5f9"],
      borderWidth: 0,
    }],
  };

  const chartOptions = {
    cutout: "78%",
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
  };

  return (
    <div style={s.page}>
      <style>{css}</style>

      {/* Hero banner */}
      <div style={{ ...s.heroBanner, background: score >= 75
        ? "linear-gradient(135deg, #065f46, #047857)"
        : score >= 50
        ? "linear-gradient(135deg, #78350f, #b45309)"
        : "linear-gradient(135deg, #7f1d1d, #b91c1c)"
      }}>
        <div style={s.heroContent}>
          <div style={s.heroIcon}>{score >= 75 ? "🏆" : score >= 50 ? "📈" : "💪"}</div>
          <div>
            <h1 style={s.heroTitle}>Interview Complete!</h1>
            <p style={s.heroSubtitle}>Here's your detailed AI performance analysis</p>
          </div>
        </div>
        <div style={{ ...s.scorePill, background: scoreBg, color: scoreColor }}>
          <AnimatedScore target={score} /> / 100
        </div>
      </div>

      <div style={s.container}>
        <div style={s.grid}>

          {/* LEFT COLUMN */}
          <div style={s.leftCol}>

            {/* Score card */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>Overall Performance</h3>

              <div style={s.chartWrapper}>
                <Doughnut data={chartData} options={chartOptions} />
                <div style={s.chartCenter}>
                  <span style={{ ...s.scoreNum, color: scoreColor }}>
                    <AnimatedScore target={score} />
                  </span>
                  <span style={s.scoreUnit}>/ 100</span>
                  <span style={{ ...s.scoreLbl, background: scoreBg, color: scoreColor }}>
                    {scoreLabel}
                  </span>
                </div>
              </div>

              <p style={s.feedbackText}>{feedback}</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>Strengths & Improvements</h3>

              <div style={s.swSection}>
                <div style={s.swHeader}>
                  <span style={s.swIconGreen}>✅</span>
                  <h4 style={{ ...s.swTitle, color: "#047857" }}>Strengths</h4>
                </div>
                <ul style={s.swList}>
                  {strengths.length
                    ? strengths.map((s_, i) => (
                        <li key={i} style={{ ...s.swItem, borderLeft: "3px solid #10b981" }}>
                          {s_}
                        </li>
                      ))
                    : <li style={s.swEmpty}>–</li>
                  }
                </ul>
              </div>

              <div style={{ ...s.swSection, marginBottom: 0 }}>
                <div style={s.swHeader}>
                  <span style={s.swIconRed}>📈</span>
                  <h4 style={{ ...s.swTitle, color: "#b91c1c" }}>Areas to Improve</h4>
                </div>
                <ul style={s.swList}>
                  {weaknesses.length
                    ? weaknesses.map((w, i) => (
                        <li key={i} style={{ ...s.swItem, borderLeft: "3px solid #ef4444" }}>
                          {w}
                        </li>
                      ))
                    : <li style={s.swEmpty}>–</li>
                  }
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={s.rightCol}>

            {/* Detailed Feedback */}
            {(codingFeedback || conceptualFeedback) && (
              <div style={s.card}>
                <h3 style={s.cardTitle}>Detailed Feedback</h3>

                {conceptualFeedback && (
                  <div style={s.feedbackBlock}>
                    <div style={s.fbHeader}>
                      <span style={s.fbDot(scoreColor)} />
                      <h4 style={s.fbTitle}>🧠 Conceptual Understanding</h4>
                    </div>
                    <p style={s.fbBody}>{conceptualFeedback}</p>
                  </div>
                )}

                {codingFeedback && (
                  <div style={{ ...s.feedbackBlock, borderColor: "#6366f1" }}>
                    <div style={s.fbHeader}>
                      <span style={s.fbDot("#6366f1")} />
                      <h4 style={s.fbTitle}>💻 Coding & Practical Skills</h4>
                    </div>
                    <p style={s.fbBody}>{codingFeedback}</p>
                  </div>
                )}
              </div>
            )}

            {/* Resume Improvements */}
            {resumeImprovements.length > 0 && (
              <div style={s.card}>
                <h3 style={s.cardTitle}>Resume Enhancement Suggestions</h3>
                <p style={s.cardSubtitle}>
                  Based on your interview, here are recommendations to strengthen your resume.
                </p>

                <div style={s.impList}>
                  {resumeImprovements.map((imp, idx) => {
                    const isObj = typeof imp === "object" && imp !== null;
                    const category = isObj ? (imp.category || "Suggestion") : "Tip";
                    const suggestion = isObj ? (imp.suggestion || JSON.stringify(imp)) : imp;
                    return (
                      <div key={idx} style={s.impItem}>
                        <span style={s.impTag}>{String(category).toUpperCase()}</span>
                        <p style={s.impText}>{suggestion}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Row */}
        <div style={s.actionRow}>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <button style={s.btnOutline}>← Back to Dashboard</button>
          </Link>
          <button onClick={() => navigate("/dashboard")} style={s.btnPrimary}>
            Start New Interview 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

// Animated score number component
function AnimatedScore({ target }) {
  const count = useCountUp(target, 1000);
  return <>{count}</>;
}

// ─── CSS ────────────────────────────────────────────────────────────────────
const css = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ─── Styles ─────────────────────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    background: "#fdf8fb",
    fontFamily: "'Inter', sans-serif",
    paddingBottom: "60px",
  },
  heroBanner: {
    padding: "32px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },
  heroContent: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  heroIcon: {
    fontSize: "42px",
    filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))",
  },
  heroTitle: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#fff",
    margin: "0 0 4px 0",
    letterSpacing: "-0.3px",
  },
  heroSubtitle: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.65)",
    margin: 0,
  },
  scorePill: {
    padding: "12px 28px",
    borderRadius: "999px",
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "-0.3px",
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.6fr",
    gap: "28px",
    alignItems: "start",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    animation: "fadeUp 0.4s ease both",
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    animation: "fadeUp 0.4s 0.1s ease both",
  },
  card: {
    background: "#fff",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 8px 30px rgba(236,72,153,0.05)",
    border: "1px solid rgba(236,72,153,0.05)",
  },
  cardTitle: {
    fontSize: "17px",
    fontWeight: "800",
    color: "#0f172a",
    margin: "0 0 24px 0",
    paddingBottom: "14px",
    borderBottom: "1px solid #f1f5f9",
    letterSpacing: "-0.2px",
  },
  cardSubtitle: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "-16px",
    marginBottom: "20px",
    lineHeight: "1.6",
  },
  chartWrapper: {
    position: "relative",
    width: "200px",
    height: "200px",
    margin: "0 auto 24px auto",
  },
  chartCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  scoreNum: {
    fontSize: "40px",
    fontWeight: "900",
    lineHeight: "1",
    letterSpacing: "-1px",
  },
  scoreUnit: {
    fontSize: "14px",
    color: "#94a3b8",
    fontWeight: "600",
  },
  scoreLbl: {
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginTop: "4px",
  },
  feedbackText: {
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.7",
    textAlign: "center",
    margin: 0,
  },
  swSection: {
    marginBottom: "24px",
  },
  swHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
  },
  swIconGreen: {
    fontSize: "18px",
  },
  swIconRed: {
    fontSize: "18px",
  },
  swTitle: {
    fontSize: "14px",
    fontWeight: "700",
    margin: 0,
  },
  swList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  swItem: {
    padding: "10px 14px",
    background: "#f8fafc",
    borderRadius: "10px",
    fontSize: "13px",
    color: "#334155",
    lineHeight: "1.5",
    fontWeight: "500",
  },
  swEmpty: {
    fontSize: "13px",
    color: "#94a3b8",
    fontStyle: "italic",
    padding: "8px 0",
  },
  feedbackBlock: {
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "20px",
    marginBottom: "16px",
    borderLeft: "4px solid #ec4899",
  },
  fbHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },
  fbDot: (color) => ({
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: color,
    flexShrink: 0,
  }),
  fbTitle: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  fbBody: {
    fontSize: "14px",
    color: "#475569",
    lineHeight: "1.7",
    margin: 0,
  },
  impList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  impItem: {
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: "14px",
    padding: "16px 20px",
  },
  impTag: {
    display: "inline-block",
    background: "#f59e0b",
    color: "#fff",
    fontSize: "10px",
    fontWeight: "700",
    padding: "3px 10px",
    borderRadius: "999px",
    letterSpacing: "0.5px",
    marginBottom: "10px",
  },
  impText: {
    margin: 0,
    fontSize: "14px",
    color: "#78350f",
    lineHeight: "1.6",
  },
  actionRow: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  btnPrimary: {
    padding: "14px 30px",
    background: "linear-gradient(135deg, #ec4899, #f472b6)",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 6px 18px rgba(236,72,153,0.35)",
    transition: "all 0.2s",
  },
  btnOutline: {
    padding: "14px 28px",
    background: "transparent",
    color: "#64748b",
    border: "2px solid #e2e8f0",
    borderRadius: "999px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.2s",
  },
  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "65vh",
    gap: "16px",
  },
  spinner: {
    width: "44px",
    height: "44px",
    border: "3px solid rgba(236,72,153,0.15)",
    borderTop: "3px solid #ec4899",
    borderRadius: "50%",
    animation: "spin 0.75s linear infinite",
  },
  loadingTitle: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
  },
  loadingSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  emptyCard: {
    background: "#fff",
    padding: "60px",
    borderRadius: "24px",
    textAlign: "center",
    maxWidth: "440px",
    margin: "80px auto",
    boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
  },
};