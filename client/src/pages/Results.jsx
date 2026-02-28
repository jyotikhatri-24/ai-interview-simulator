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

  // We can either pass resultId through state from InterviewRoom, or as a URL param.
  // We added resultId to the submission response in the previous step, so we'll expect it in state.
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

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading your results...</div>;

  if (!result) {
    return (
      <div className="page-container">
        <div className="card">
          <p>No result found. Please complete an interview first.</p>
          <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: ["Score", "Room for Improvement"],
    datasets: [
      {
        data: [result.score, 100 - result.score],
        backgroundColor: ["#4CAF50", "#e0e0e0"],
        hoverBackgroundColor: ["#45a049", "#d0d0d0"],
      },
    ],
  };

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: "800px" }}>
        <h2>Interview Results</h2>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>

          <div style={{ width: "200px", height: "200px", margin: "0 auto" }}>
            <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
            <h3 style={{ textAlign: "center", marginTop: "10px" }}>{result.score} / 100</h3>
          </div>

          <div style={{ flex: 1, minWidth: "300px", paddingLeft: "20px" }}>
            <h4>Overall Feedback:</h4>
            <p>{result.feedback}</p>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
              <div style={{ flex: 1, marginRight: "10px" }}>
                <h4 style={{ color: "green" }}>Strengths</h4>
                <ul style={{ paddingLeft: "20px" }}>
                  {result.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: "red" }}>Areas for Improvement</h4>
                <ul style={{ paddingLeft: "20px" }}>
                  {result.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <Link to="/dashboard">
            <button>Back to Dashboard</button>
          </Link>
        </div>
      </div>
    </div>
  );
}