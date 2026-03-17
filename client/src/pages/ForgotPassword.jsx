import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email || !newPassword) {
            setError("Both fields are required");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await resetPassword({ email, newPassword });
            setMessage("Password reset successfully. Redirecting...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-bg">
            <style>{`
                .auth-card-inner { width: 100%; max-width: 440px; }
                .auth-brand { display: flex; flex-direction: column; align-items: center; margin-bottom: 30px; gap: 8px; }
                .auth-brand-icon {
                    width: 48px; height: 48px;
                    background: linear-gradient(135deg, #ec4899, #f472b6);
                    border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px;
                    box-shadow: 0 8px 24px rgba(236,72,153,0.35);
                }
                .auth-title { font-size: 24px; font-weight: 800; color: #fff; letter-spacing: -0.5px; text-align: center; }
                .auth-subtitle { font-size: 13px; color: rgba(255,255,255,0.45); text-align: center; margin-top: 4px; }
                .auth-error {
                    padding: 10px 14px; background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25);
                    border-radius: 10px; color: #fca5a5; font-size: 12px; margin-bottom: 20px;
                }
                .auth-success {
                    padding: 10px 14px; background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25);
                    border-radius: 10px; color: #86efac; font-size: 12px; margin-bottom: 20px;
                }
                .auth-form-group { margin-bottom: 20px; }
                .auth-label { display: block; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.7); margin-bottom: 8px; text-align: left; }
                .auth-input {
                    width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: #fff;
                    font-size: 14px; transition: all 0.2s;
                }
                .auth-input:focus { outline: none; background: rgba(255,255,255,0.08); border-color: #ec4899; box-shadow: 0 0 0 4px rgba(236,72,153,0.15); }
                .auth-submit {
                    width: 100%; padding: 14px; background: linear-gradient(135deg, #ec4899, #f472b6);
                    color: #fff; border: none; border-radius: 999px; font-size: 15px; font-weight: 700;
                    cursor: pointer; box-shadow: 0 6px 20px rgba(236,72,153,0.35); transition: all 0.2s;
                }
                .auth-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(236,72,153,0.45); }
                .auth-submit:disabled { opacity: 0.6; }
                .auth-return { display: block; text-align: center; margin-top: 24px; font-size: 14px; color: rgba(255,255,255,0.45); text-decoration: none; }
                .auth-return:hover { color: #fff; }
            `}</style>
            
            <div className="auth-card auth-card-inner">
                <div className="auth-brand">
                    <div className="auth-brand-icon">🔑</div>
                    <div>
                        <h2 className="auth-title">Forgot Password</h2>
                        <p className="auth-subtitle">Reset your account password directly</p>
                    </div>
                </div>

                {error && <div className="auth-error">⚠️ {error}</div>}
                {message && <div className="auth-success">✓ {message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-form-group">
                        <label className="auth-label">Email Address</label>
                        <input
                            className="auth-input"
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="auth-form-group">
                        <label className="auth-label">New Password</label>
                        <input
                            className="auth-input"
                            type="password"
                            placeholder="Enter a new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <Link to="/login" className="auth-return">Return to Login</Link>
            </div>
        </div>
    );
}
