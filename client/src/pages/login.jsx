import { Link } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Both fields are required"); return; }
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem("token", data.token);
      if (data.role === "admin") window.location.href = "/admin";
      else window.location.href = "/dashboard";
    } catch (err) {
      console.error("login error", err);
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-bg">
      <style>{`
        .auth-card-inner { width: 100%; max-width: 440px; }
        .auth-brand { display: flex; flex-direction: column; align-items: center; margin-bottom: 36px; gap: 12px; }
        .auth-brand-icon {
          width: 56px; height: 56px;
          background: linear-gradient(135deg, #ec4899, #f472b6);
          border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px;
          box-shadow: 0 8px 24px rgba(236,72,153,0.35);
        }
        .auth-title { font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.5px; text-align: center; }
        .auth-subtitle { font-size: 14px; color: rgba(255,255,255,0.45); text-align: center; margin-top: 4px; }
        .auth-error {
          display: flex; align-items: center; gap: 10px; padding: 12px 16px;
          background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25);
          border-radius: 12px; color: #fca5a5; font-size: 13px; font-weight: 500;
          margin-bottom: 20px; animation: authFadeIn 0.3s ease both;
        }
        .auth-form-group { margin-bottom: 20px; }
        .auth-forgot {
          display: block; text-align: right; font-size: 13px;
          color: rgba(255,255,255,0.45); text-decoration: none;
          margin-top: -12px; margin-bottom: 20px; transition: color 0.2s;
        }
        .auth-forgot:hover { color: #f9a8d4; }
        .auth-submit {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #ec4899, #f472b6);
          color: #fff; border: none; border-radius: 999px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 6px 20px rgba(236,72,153,0.35);
          transition: all 0.2s; margin-bottom: 24px;
        }
        .auth-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(236,72,153,0.45); }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .auth-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .auth-divider-text { font-size: 12px; color: rgba(255,255,255,0.25); white-space: nowrap; }
        .auth-alt-btn {
          display: block; width: 100%; padding: 14px;
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 999px; font-size: 15px; font-weight: 600;
          color: rgba(255,255,255,0.7); cursor: pointer; font-family: 'Inter', sans-serif;
          text-align: center; text-decoration: none; transition: all 0.2s;
        }
        .auth-alt-btn:hover { background: rgba(236,72,153,0.08); color: #fff; }
        .auth-label { display: block; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7); margin-bottom: 8px; text-align: left; }
        .auth-input {
          width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff;
          font-size: 14px; transition: all 0.2s;
        }
        .auth-input:focus { outline: none; background: rgba(255,255,255,0.08); border-color: #ec4899; box-shadow: 0 0 0 4px rgba(236,72,153,0.15); }
      `}</style>

      <div className="auth-card auth-card-inner">
        <div className="auth-brand">
          <div className="auth-brand-icon">🚀</div>
          <div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to continue your interview prep</p>
          </div>
        </div>

        {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Email address</label>
            <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <input className="auth-input" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">Don't have an account?</span>
          <div className="auth-divider-line" />
        </div>
        <Link to="/register" className="auth-alt-btn">Create a free account</Link>
      </div>
    </div>
  );
}