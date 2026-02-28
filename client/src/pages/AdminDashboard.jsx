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
        if (err.response?.status === 401) {
          setError("Not authorized as an admin");
        } else {
          setError("Failed to load admin statistics");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading Analytics...</div>;

  if (error) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: "center" }}>
          <h2 style={{ color: "red" }}>Access Denied</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/dashboard")} style={{ marginTop: "15px" }}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: "600px", textAlign: "center" }}>
        <h2>Admin Analytics</h2>
        <p style={{ color: "gray", marginBottom: "30px" }}>System-wide performance overview</p>

        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "20px" }}>

          <div style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px", minWidth: "150px" }}>
            <h3 style={{ fontSize: "2rem", margin: "0", color: "#007BFF" }}>{stats.totalUsers}</h3>
            <p style={{ margin: "5px 0 0 0" }}>Total Users</p>
          </div>

          <div style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px", minWidth: "150px" }}>
            <h3 style={{ fontSize: "2rem", margin: "0", color: "#007BFF" }}>{stats.totalInterviews}</h3>
            <p style={{ margin: "5px 0 0 0" }}>Interviews Taken</p>
          </div>

          <div style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px", minWidth: "150px" }}>
            <h3 style={{ fontSize: "2rem", margin: "0", color: "#4CAF50" }}>{stats.averageScore}</h3>
            <p style={{ margin: "5px 0 0 0" }}>Average Score</p>
          </div>

        </div>
      </div>
    </div>
  );
}