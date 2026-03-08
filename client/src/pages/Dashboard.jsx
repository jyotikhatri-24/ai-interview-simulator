import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("Software Engineer");
  const [testRequired, setTestRequired] = useState(false);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(null);
  const [showResumeOptions, setShowResumeOptions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch user profile
    fetch("http://localhost:8000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err));

    // Fetch interview history
    axios.get("http://localhost:8000/api/results/history/all", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setHistory(res.data))
      .catch(err => console.error("Failed to fetch history", err));

    // Fetch uploaded resume info
    axios.get("http://localhost:8000/api/resume/current", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setResume(res.data))
      .catch(() => setResume(null));
  }, []);

  const handleStartInterview = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:8000/api/interview/generate",
        { role, testRequired },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/interviewroom", { state: { interview: response.data } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate interview. Did you upload a resume?");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: [...history].reverse().map((_, i) => `Intv ${i + 1}`),
    datasets: [
      {
        label: "Score",
        data: [...history].reverse().map((h) => h.evaluation?.score || h.score || 0),
        borderColor: "#6a5acd", // Slate blue
        backgroundColor: "rgba(106, 90, 205, 0.2)",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#6a5acd",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const avgScore = history.length
    ? Math.round(history.reduce((a, b) => a + (b.evaluation?.score || b.score || 0), 0) / history.length)
    : 0;

  const bestScore = history.length ? Math.max(...history.map(h => h.evaluation?.score || h.score || 0)) : 0;

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.greeting}>
              {user ? `Welcome back, ${user.name}` : "Dashboard"} <span style={styles.waveHand}>👋</span>
            </h1>
            <p style={styles.subGreeting}>Here's an overview of your interview journey.</p>
          </div>
          <div style={styles.profileBadge}>
            <div style={styles.avatar}>
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span style={{ marginRight: "10px" }}>⚠️</span> {error}
          </div>
        )}

        {/* Top Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIconWrapper(styles.iconBlue)}>
              <span style={styles.statIcon}>🎯</span>
            </div>
            <div>
              <p style={styles.statValue}>{history.length}</p>
              <p style={styles.statLabel}>Interviews Done</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIconWrapper(styles.iconGreen)}>
              <span style={styles.statIcon}>📈</span>
            </div>
            <div>
              <p style={styles.statValue}>{avgScore}</p>
              <p style={styles.statLabel}>Avg Score</p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIconWrapper(styles.iconOrange)}>
              <span style={styles.statIcon}>🏆</span>
            </div>
            <div>
              <p style={styles.statValue}>{bestScore}</p>
              <p style={styles.statLabel}>Best Score</p>
            </div>
          </div>
        </div>

        <div style={styles.mainGrid}>
          {/* Left Column */}
          <div style={styles.leftCol}>

            {/* Start New Interview Card (Hero style) */}
            <div style={styles.startHeroCard}>
              <div style={styles.heroGlow}></div>
              <div style={styles.heroContent}>
                <h2 style={styles.heroTitle}>Ready to Level Up?</h2>
                <p style={styles.heroSubtitle}>Configure your target role and start a hyper-realistic AI mock interview immediately.</p>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Target Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    style={styles.textInput}
                  />
                </div>

                <div style={styles.checkboxGroup}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={testRequired}
                      onChange={(e) => setTestRequired(e.target.checked)}
                      style={styles.checkbox}
                    />
                    <span style={styles.checkboxText}>Include Coding/Practical Problem</span>
                  </label>
                </div>

                <button
                  onClick={handleStartInterview}
                  disabled={loading}
                  style={styles.primaryActionButton}
                  onMouseOver={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseOut={(e) => e.target.style.transform = "translateY(0)"}
                >
                  {loading ? "Initializing Simulation..." : "Launch Interview Simulator"}
                  {!loading && <span style={{ marginLeft: "8px" }}>🚀</span>}
                </button>
              </div>
            </div>

            {/* Resume Card */}
            <div style={styles.glassCardDark}>
              <div style={styles.cardHeaderFlex}>
                <div>
                  <h3 style={styles.cardTitle}>📄 Resume Profile</h3>
                  <p style={styles.cardSubtitle}>
                    {resume ? resume.filename : "No active resume profile"}
                  </p>
                </div>
                <button
                  onClick={() => setShowResumeOptions(!showResumeOptions)}
                  style={styles.outlineBtn}
                >
                  {resume ? "Manage" : "Upload"}
                </button>
              </div>

              {showResumeOptions && resume && (
                <div style={styles.resumeOptionsContainer}>
                  <p style={styles.resumeTip}>Your current resume will be used to contextualize your interview questions.</p>
                  <div style={styles.resumeActions}>
                    <Link to="/uploadresume" style={{ textDecoration: 'none' }}>
                      <button style={styles.secondaryBtn}>Upload New Version</button>
                    </Link>
                  </div>
                </div>
              )}

              {!resume && (
                <div style={{ marginTop: "15px" }}>
                  <Link to="/uploadresume" style={{ textDecoration: 'none' }}>
                    <button style={styles.primaryBtnSmall}>Upload Now</button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div style={styles.rightCol}>

            {/* Chart */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitleLight}>Performance History</h3>
              {history.length > 0 ? (
                <div style={{ height: "240px", marginTop: "20px" }}>
                  <Line
                    data={chartData}
                    options={{
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false }, tooltip: { backgroundColor: "rgba(0,0,0,0.8)", padding: 10, borderRadius: 8 } },
                      scales: {
                        y: {
                          min: 0,
                          max: 100,
                          grid: { color: "rgba(0,0,0,0.04)" },
                          border: { display: false },
                          ticks: { color: "#8a94a6", font: { family: "Inter", size: 11 } }
                        },
                        x: {
                          grid: { display: false },
                          border: { display: false },
                          ticks: { color: "#8a94a6", font: { family: "Inter", size: 11 } }
                        }
                      }
                    }}
                  />
                </div>
              ) : (
                <div style={styles.emptyChart}>
                  No data to track yet. Take your first interview!
                </div>
              )}
            </div>

            {/* Recent History List */}
            <div style={styles.glassCard}>
              <h3 style={styles.cardTitleLight}>Recent Interviews</h3>
              <div style={styles.historyList}>
                {history.length > 0 ? history.slice(0, 5).map((item) => (
                  <div key={item._id} style={styles.historyItemHover}>
                    <div style={styles.historyRow}>
                      <div style={styles.dateCol}>
                        <div style={styles.calendarIcon}>
                          🗓️
                        </div>
                        <div>
                          <p style={styles.historyDate}>
                            {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                          <p style={styles.historyTime}>
                            {new Date(item.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <div style={styles.scoreCol}>
                        <div style={{
                          ...styles.scoreBadge,
                          backgroundColor: (item.evaluation?.score || item.score || 0) >= 75 ? "#e6f4ea" : (item.evaluation?.score || item.score || 0) >= 50 ? "#fef7e0" : "#fce8e6",
                          color: (item.evaluation?.score || item.score || 0) >= 75 ? "#137333" : (item.evaluation?.score || item.score || 0) >= 50 ? "#b06000" : "#c5221f"
                        }}>
                          {(item.evaluation?.score || item.score || 0)}%
                        </div>
                        <Link to={`/results?id=${item._id}`} style={styles.viewLink}>
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div style={styles.emptyState}>
                    <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🎤</div>
                    <p>Your journey begins here.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          
          * {
            box-sizing: border-box;
          }
          
          @keyframes wave {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(14deg); }
            20% { transform: rotate(-8deg); }
            30% { transform: rotate(14deg); }
            40% { transform: rotate(-4deg); }
            50% { transform: rotate(10deg); }
            60% { transform: rotate(0deg); }
            100% { transform: rotate(0deg); }
          }
        `}
      </style>
    </div>
  );
}

// Design System & Styles
const styles = {
  pageBackground: {
    minHeight: "100vh",
    backgroundColor: "#f4f7fa", // Soft, premium light grey/blue
    fontFamily: "'Inter', sans-serif",
    paddingBottom: "60px",
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  greeting: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.5px",
  },
  waveHand: {
    display: "inline-block",
    animation: "wave 2.5s infinite",
    transformOrigin: "70% 70%",
  },
  subGreeting: {
    margin: "8px 0 0 0",
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "500",
  },
  profileBadge: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6a5acd 0%, #4169e1 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(106, 90, 205, 0.3)",
  },
  avatar: {
    color: "white",
    fontSize: "20px",
    fontWeight: "700",
  },
  errorBanner: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "16px 20px",
    borderRadius: "12px",
    marginBottom: "24px",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(220, 38, 38, 0.1)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
    marginBottom: "36px",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "20px",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  iconBlue: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
  iconGreen: "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
  iconOrange: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
  statIconWrapper: (bg) => ({
    width: "64px",
    height: "64px",
    borderRadius: "16px",
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  statIcon: {
    fontSize: "28px",
  },
  statValue: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: "1",
    marginBottom: "4px",
  },
  statLabel: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
    fontWeight: "500",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  startHeroCard: {
    position: "relative",
    background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    borderRadius: "24px",
    padding: "40px",
    color: "white",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.2)",
  },
  heroGlow: {
    position: "absolute",
    top: "-50px",
    right: "-50px",
    width: "200px",
    height: "200px",
    background: "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(0,0,0,0) 70%)",
    borderRadius: "50%",
    zIndex: 0,
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
  },
  heroTitle: {
    margin: "0 0 12px 0",
    fontSize: "1.75rem",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },
  heroSubtitle: {
    margin: "0 0 30px 0",
    color: "#94a3b8",
    fontSize: "15px",
    lineHeight: "1.5",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  inputLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#cbd5e1",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  textInput: {
    width: "100%",
    padding: "16px 18px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "white",
    fontSize: "15px",
    outline: "none",
    transition: "all 0.2s",
  },
  checkboxGroup: {
    marginBottom: "30px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  checkbox: {
    width: "20px",
    height: "20px",
    marginRight: "12px",
    accentColor: "#6366f1", // Modern indigo
    cursor: "pointer",
  },
  checkboxText: {
    fontSize: "15px",
    color: "#e2e8f0",
    fontWeight: "500",
  },
  primaryActionButton: {
    width: "100%",
    padding: "18px",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "transform 0.2s, background-color 0.2s",
    boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)",
  },
  glassCardDark: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: "24px",
    padding: "30px",
    border: "1px solid rgba(255, 255, 255, 1)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
  },
  cardHeaderFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    margin: "0 0 6px 0",
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#0f172a",
  },
  cardTitleLight: {
    margin: "0 0 20px 0",
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#0f172a",
  },
  cardSubtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#64748b",
  },
  outlineBtn: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    color: "#475569",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  secondaryBtn: {
    padding: "10px 20px",
    backgroundColor: "#f1f5f9",
    border: "none",
    borderRadius: "10px",
    color: "#334155",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  primaryBtnSmall: {
    padding: "12px 24px",
    backgroundColor: "#0f172a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
  resumeOptionsContainer: {
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  resumeTip: {
    margin: "0 0 16px 0",
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.5",
  },
  resumeActions: {
    display: "flex",
    gap: "12px",
  },
  glassCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
    display: "flex",
    flexDirection: "column",
  },
  emptyChart: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "200px",
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: "#f8fafc",
    borderRadius: "16px",
    border: "2px dashed #e2e8f0",
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  historyItemHover: {
    padding: "16px",
    borderRadius: "16px",
    backgroundColor: "#f8fafc",
    border: "1px solid transparent",
    transition: "all 0.2s",
    cursor: "default",
  },
  historyRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateCol: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  calendarIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  historyDate: {
    margin: "0 0 4px 0",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },
  historyTime: {
    margin: 0,
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "500",
  },
  scoreCol: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  scoreBadge: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "700",
  },
  viewLink: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#6366f1",
    textDecoration: "none",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#94a3b8",
    fontSize: "15px",
  }
};

/* Responsive adjustments (could be put in a CSS file, but done via inline media queries logic or ignored for simple demo) */
// Adding a small responsive hack
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 900px) {
      div[style*="mainGrid"] {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  document.head.appendChild(style);
}