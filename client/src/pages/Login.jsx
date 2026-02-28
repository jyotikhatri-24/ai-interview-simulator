import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="page-container">
      <div className="card">
        <h2>Login</h2>

        <label>Email</label>
        <input type="email" placeholder="Enter your email" />

        <label>Password</label>
        <input type="password" placeholder="Enter your password" />

        <button style={{ width: "100%" }}>Login</button>

        {/* New Account Section */}
        <div style={{ marginTop: "15px", textAlign: "center" }}>
          <p>Don't have an account?</p>
          <Link to="/register">
            <button
              style={{
                width: "100%",
                backgroundColor: "#555",
                marginTop: "5px"
              }}
            >
              Create New Account
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}