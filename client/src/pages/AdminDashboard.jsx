import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        setError(err.response?.status === 401 ? "Not authorized as an admin" : "Failed to load admin statistics");
      } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={s.page}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={s.loadingWrapper}>
          <div style={s.spinner} />
          <p style={s.loadingText}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={s.page}>
        <div style={s.errorCard}>
          <div style={s.errorIcon}>🔒</div>
          <h2 style={s.errorTitle}>Access Denied</h2>
          <p style={s.errorMsg}>{error}</p>
          <button onClick={() => navigate("/dashboard")} style={s.backBtn}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const statItems = [
    { label: "Total Users", value: stats.totalUsers, icon: "👥", gradient: "linear-gradient(135deg, #fce7f3, #fbcfe8)", color: "#be185d" },
    { label: "Interviews Taken", value: stats.totalInterviews, icon: "🎯", gradient: "linear-gradient(135deg, #fce7f3, #fecdd3)", color: "#ec4899" },
    { label: "Average Score", value: `${stats.averageScore}%`, icon: "📊", gradient: "linear-gradient(135deg, #dcfce7, #bbf7d0)", color: "#15803d" },
  ];

  return (
    <div style={s.page}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .admin-stat-card {
          background: #fff; border-radius: 24px; padding: 32px;
          display: flex; align-items: center; gap: 24px;
          box-shadow: 0 8px 24px rgba(236,72,153,0.06);
          border: 1px solid rgba(236,72,153,0.07);
          animation: fadeUp 0.4s ease both; flex: 1; min-width: 200px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .admin-stat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(236,72,153,0.1); }
      `}</style>

      <div style={s.container}>
        <div style={s.header}>
          <div style={s.adminBadge}>⚙️ Admin</div>
          <h1 style={s.title}>Analytics Overview</h1>
          <p style={s.subtitle}>System-wide performance metrics for the AI Interview Simulator</p>
        </div>

        <div style={s.statsRow}>
          {statItems.map((item, i) => (
            <div key={i} className="admin-stat-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div style={{ ...s.iconWrapper, background: item.gradient }}>
                <span style={{ fontSize: "28px" }}>{item.icon}</span>
              </div>
              <div>
                <p style={{ ...s.statValue, color: item.color }}>{item.value}</p>
                <p style={s.statLabel}>{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={s.infoStrip}>
          <span style={{ fontSize: "16px" }}>ℹ️</span>
          <p style={s.infoText}>All metrics are computed in real-time from the database. Scores reflect the AI evaluation average across all completed interview sessions.</p>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#fdf8fb", fontFamily: "'Inter', sans-serif", paddingBottom: "60px" },
  container: { maxWidth: "1000px", margin: "0 auto", padding: "50px 24px" },
  header: { marginBottom: "48px" },
  adminBadge: {
    display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 14px",
    background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.2)",
    borderRadius: "999px", fontSize: "12px", fontWeight: "700", color: "#ec4899",
    letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "16px",
  },
  title: { fontSize: "2.25rem", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 8px 0" },
  subtitle: { fontSize: "15px", color: "#64748b", fontWeight: "500" },
  statsRow: { display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "32px" },
  iconWrapper: { width: "68px", height: "68px", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statValue: { fontSize: "2.25rem", fontWeight: "800", lineHeight: "1", marginBottom: "6px" },
  statLabel: { fontSize: "14px", color: "#64748b", fontWeight: "500", margin: 0 },
  infoStrip: { display: "flex", alignItems: "flex-start", gap: "14px", background: "#fff", border: "1px solid #fce7f3", borderRadius: "16px", padding: "20px 24px", boxShadow: "0 2px 8px rgba(236,72,153,0.04)" },
  infoText: { fontSize: "14px", color: "#64748b", lineHeight: "1.6", margin: 0 },
  loadingWrapper: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "16px" },
  spinner: { width: "40px", height: "40px", border: "3px solid rgba(236,72,153,0.15)", borderTop: "3px solid #ec4899", borderRadius: "50%", animation: "spin 0.75s linear infinite" },
  loadingText: { fontSize: "15px", color: "#64748b", fontWeight: "500" },
  errorCard: { background: "#fff", borderRadius: "24px", padding: "56px 40px", textAlign: "center", maxWidth: "440px", margin: "80px auto", boxShadow: "0 8px 30px rgba(236,72,153,0.08)", border: "1px solid #fce7f3" },
  errorIcon: { fontSize: "48px", marginBottom: "20px" },
  errorTitle: { fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "10px" },
  errorMsg: { fontSize: "14px", color: "#64748b", marginBottom: "28px" },
  backBtn: { padding: "12px 28px", background: "linear-gradient(135deg, #ec4899, #f472b6)", color: "#fff", border: "none", borderRadius: "999px", fontWeight: "600", fontSize: "14px", fontFamily: "'Inter', sans-serif", cursor: "pointer", boxShadow: "0 4px 14px rgba(236,72,153,0.3)", transition: "all 0.2s" },
};