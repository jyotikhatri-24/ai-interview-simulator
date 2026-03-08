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
        <div className="page-container">
            <div className="card">
                <h2 style={{ marginBottom: "5px" }}>Forgot Password</h2>
                <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px", marginTop: "0" }}>
                    Reset your account password directly.
                </p>

                {error && <p style={{ color: "red", marginTop: "0" }}>{error}</p>}
                {message && <p style={{ color: "green", marginTop: "0" }}>{message}</p>}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>New Password</label>
                    <input
                        type="password"
                        placeholder="Enter a new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <button type="submit" style={{ width: "100%", marginTop: "10px" }} disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <div style={{ marginTop: "15px", textAlign: "center" }}>
                    <Link to="/login" style={{ fontSize: "14px", color: "#007bff", textDecoration: "none" }}>
                        Return to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
