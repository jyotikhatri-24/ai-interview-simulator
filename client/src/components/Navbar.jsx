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
      try {
        // Decode JWT payload (Base64Url encoded)
        const payload = JSON.parse(atob(token.split(".")[1]));
        // Note: Our current JWT only stores the ID. To check role on frontend without an extra API call, 
        // we'd ideally put the role in the JWT. For now, we'll fetch profile if logged in.
      } catch (e) {
        console.error("Invalid token");
      }

      // Fetch user profile to check role
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
    window.location.reload(); // Quick way to reset state
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
      <h3 style={{ margin: 0 }}>AI Interview</h3>
      <div>
        <Link to="/" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>Home</Link>

        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>Dashboard</Link>
            {isAdmin && (
              <Link to="/admin" style={{ color: "#4CAF50", marginRight: "20px", textDecoration: "none", fontWeight: "bold" }}>Admin</Link>
            )}
            <button onClick={handleLogout} style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "#ff4c4c", color: "white", border: "none", borderRadius: "5px" }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "white", marginRight: "20px", textDecoration: "none" }}>Login</Link>
            <Link to="/register" style={{ color: "white", textDecoration: "none" }}>Register</Link>
          </>
        )}
      </div>
    </div>
  );
}