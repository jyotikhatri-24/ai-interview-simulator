import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirm) { setError("All fields are required"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true);
    try {
      const data = await registerUser({ name, email, password });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("registration error", err);
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-bg">
      <style>{`
        .reg-card { width: 100%; max-width: 480px; }
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
        .reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .auth-form-group { margin-bottom: 18px; }
        .auth-submit {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #ec4899, #f472b6);
          color: #fff; border: none; border-radius: 999px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 6px 20px rgba(236,72,153,0.35);
          transition: all 0.2s; margin-bottom: 24px; margin-top: 4px;
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

      <div className="auth-card reg-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">🚀</div>
          <div>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Start mastering technical interviews today</p>
          </div>
        </div>

        {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">Full name</label>
            <input className="auth-input" type="text" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="auth-form-group">
            <label className="auth-label">Email address</label>
            <input className="auth-input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="reg-row">
            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <input className="auth-input" type="password" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="auth-form-group">
              <label className="auth-label">Confirm</label>
              <input className="auth-input" type="password" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">Already have an account?</span>
          <div className="auth-divider-line" />
        </div>
        <Link to="/login" className="auth-alt-btn">Sign in instead</Link>
      </div>
    </div>
  );
}