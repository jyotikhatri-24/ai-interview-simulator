import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);

      fetch("http://localhost:8000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.role === "admin") setIsAdmin(true);
        })
        .catch(err => console.error(err));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <div style={{
      padding: "15px 40px",
      backgroundColor: "#111",
      color: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <h3 style={{ margin: 0, color: "white" }}>🚀 AI Interview Simulator</h3>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {isLoggedIn ? (
          <>
            {isAdmin ? (
              <Link to="/admin" style={{ color: "#4CAF50", textDecoration: "none", fontWeight: "bold" }}>
                Admin Dashboard
              </Link>
            ) : (
              <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>
                Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 14px",
                cursor: "pointer",
                backgroundColor: "#ff4c4c",
                color: "white",
                border: "none",
                borderRadius: "5px"
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white", textDecoration: "none" }}>Login</Link>
            <Link to="/register" style={{ color: "white", textDecoration: "none" }}>Register</Link>
          </>
        )}
      </div>
    </div>
  );
}