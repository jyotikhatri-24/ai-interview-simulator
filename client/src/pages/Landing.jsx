import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="page-container">
      <div className="card" style={{ textAlign: "center" }}>
        <h1>AI Powered Interview Simulator 🚀</h1>
        <p> Hi there,  welcome to our AI Interview Simulator! 
          Upload your resume and practice AI-generated mock interviews
          with real-time evaluation and performance analytics.
        </p>

        <div style={{ marginTop: "20px" }}>
          <Link to="/dashboard">
            <button style={{ marginRight: "10px" }}>
              Start Interview
            </button>
          </Link>

          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}