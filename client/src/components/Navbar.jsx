import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      axios.get("http://localhost:8000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => { if (res.data.role === "admin") setIsAdmin(true); })
        .catch(err => {
          console.error("Navbar profile error:", err);
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
          }
        });
    }
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <style>{`
        .nav-root {
          position: sticky; top: 0; z-index: 100;
          padding: 0 40px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          transition: background 0.3s ease, box-shadow 0.3s ease;
          background: rgba(10, 5, 8, ${scrolled ? '0.88' : '0.65'});
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(236,72,153,${scrolled ? '0.12' : '0.06'});
          box-shadow: ${scrolled ? '0 4px 24px rgba(236,72,153,0.08)' : 'none'};
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #ec4899, #f472b6);
          border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px;
        }
        .nav-logo-text {
          font-size: 16px; font-weight: 800;
          background: linear-gradient(90deg, #fff 0%, #fce7f3 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; letter-spacing: -0.3px;
        }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-link {
          padding: 6px 14px; border-radius: 999px; font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s, background 0.2s;
        }
        .nav-link:hover { color: #fff; background: rgba(236,72,153,0.1); }
        .nav-link-admin {
          padding: 6px 14px; border-radius: 999px; font-size: 14px; font-weight: 600;
          color: #fbcfe8; text-decoration: none;
          background: rgba(236,72,153,0.12); border: 1px solid rgba(236,72,153,0.25); transition: all 0.2s;
        }
        .nav-link-admin:hover { background: rgba(236,72,153,0.2); color: #f9a8d4; }
        .nav-btn-logout {
          padding: 7px 18px; border-radius: 999px; font-size: 14px; font-weight: 600; cursor: pointer;
          background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25); color: #fca5a5;
          font-family: 'Inter', sans-serif; transition: all 0.2s ease;
        }
        .nav-btn-logout:hover { background: rgba(239,68,68,0.22); color: #f87171; transform: translateY(-1px); }
        .nav-btn-register {
          padding: 7px 18px; border-radius: 999px; font-size: 14px; font-weight: 600; cursor: pointer;
          background: linear-gradient(135deg, #ec4899, #f472b6); border: none; color: #fff;
          font-family: 'Inter', sans-serif; box-shadow: 0 4px 12px rgba(236,72,153,0.35);
          transition: all 0.2s; text-decoration: none; display: inline-block;
        }
        .nav-btn-register:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(236,72,153,0.45); }
      `}</style>

      <nav className="nav-root">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">🚀</div>
          <span className="nav-logo-text">AI Interview Simulator</span>
        </Link>
        <div className="nav-links">
          {isLoggedIn ? (
            <>
              {isAdmin
                ? <Link to="/admin" className="nav-link-admin">Admin Dashboard</Link>
                : <Link to="/dashboard" className="nav-link">Dashboard</Link>}
              <button className="nav-btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Sign In</Link>
              <Link to="/register" className="nav-btn-register">Get Started</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}