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
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/results/history/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };
    fetchHistory();
  }, []);

  const handleStartInterview = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/interview/generate",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const interview = response.data;
      navigate("/interviewroom", { state: { interview } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to generate interview. Did you upload a resume?");
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    // Reverse so chronological order left to right
    labels: [...history].reverse().map((_, i) => `Interview ${i + 1}`),
    datasets: [
      {
        label: "Interview Scores",
        data: [...history].reverse().map((h) => h.score),
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.5)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: "800px" }}>
        <h2>Dashboard</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/uploadresume">
            <button>Upload Target Resume</button>
          </Link>

          <button onClick={handleStartInterview} disabled={loading} style={{ backgroundColor: "#007BFF" }}>
            {loading ? "Generating Questions..." : "Start New AI Interview"}
          </button>
        </div>

        {history.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h3>Your Performance Progress</h3>
            <div style={{ height: "300px", marginTop: "20px" }}>
              <Line
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  scales: { y: { min: 0, max: 100 } }
                }}
              />
            </div>

            <h3 style={{ marginTop: "30px" }}>Past Interviews</h3>
            <ul style={{ textAlign: "left" }}>
              {history.map((item) => (
                <li key={item._id} style={{ marginBottom: "10px" }}>
                  <span>{new Date(item.createdAt).toLocaleDateString()} - Score: <strong>{item.score}</strong></span>
                  <Link to={`/results?id=${item._id}`} style={{ marginLeft: "10px", color: "#007BFF" }}>
                    View Feedback
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}