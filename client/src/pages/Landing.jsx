import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Landing() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div style={styles.container}>
      {/* Dynamic Background */}
      <div style={styles.gradientBg}></div>
      <div style={{ ...styles.glowOrb, top: "20%", left: "15%", backgroundColor: "rgba(100, 100, 255, 0.4)" }}></div>
      <div style={{ ...styles.glowOrb, bottom: "20%", right: "15%", backgroundColor: "rgba(255, 100, 200, 0.4)" }}></div>

      <div style={{
        ...styles.heroContent,
        transform: `translate(${mousePos.x}px, ${mousePos.y}px)`
      }}>
        <div style={styles.glassCard}>
          <div style={styles.badge}>✨ Next-Gen Interview Prep</div>
          <h1 style={styles.title}>
            Master Your Next <br />
            <span style={styles.gradientText}>Technical Interview</span>
          </h1>
          <p style={styles.subtitle}>
            Upload your resume, configure your target role, and let our advanced AI simulate real-world technical and coding interviews to elevate your career.
          </p>

          <div style={styles.buttonContainer}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button style={styles.primaryButton}>
                Get Started Free <span style={styles.arrow}>→</span>
              </button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={styles.secondaryButton}>
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div style={styles.featuresContainer}>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>📄</div>
            <p style={styles.featureText}>Resume Parsing</p>
          </div>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>🤖</div>
            <p style={styles.featureText}>AI Avatars</p>
          </div>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>💻</div>
            <p style={styles.featureText}>Coding Tests</p>
          </div>
          <div style={styles.featureItem}>
            <div style={styles.featureIcon}>📊</div>
            <p style={styles.featureText}>Deep Analytics</p>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          @keyframes bgGlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .hover-scale {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .hover-scale:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 10px 25px rgba(0, 123, 255, 0.4);
          }
          .secondary-hover:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
            border-color: rgba(255, 255, 255, 0.5) !important;
          }
        `}
      </style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#0a0a0f",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: "#fff",
  },
  gradientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, #0a0a0f 0%, #171124 50%, #0d1b2a 100%)",
    backgroundSize: "200% 200%",
    animation: "bgGlow 15s ease infinite",
    zIndex: 0,
  },
  glowOrb: {
    position: "absolute",
    width: "40vw",
    height: "40vw",
    borderRadius: "50%",
    filter: "blur(120px)",
    zIndex: 0,
    opacity: 0.6,
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 20px",
    maxWidth: "800px",
    transition: "transform 0.1s ease-out",
  },
  glassCard: {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "60px 40px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
    animation: "float 6s ease-in-out infinite",
  },
  badge: {
    display: "inline-block",
    padding: "8px 16px",
    background: "rgba(0, 123, 255, 0.15)",
    color: "#4da3ff",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    marginBottom: "20px",
    border: "1px solid rgba(0, 123, 255, 0.3)",
  },
  title: {
    fontSize: "clamp(2.5rem, 5vw, 4rem)",
    fontWeight: "800",
    lineHeight: "1.1",
    margin: "0 0 20px 0",
    color: "#ffffff",
  },
  gradientText: {
    background: "linear-gradient(90deg, #007BFF 0%, #00d2ff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "clamp(1rem, 2vw, 1.15rem)",
    lineHeight: "1.6",
    color: "#a0aabf",
    marginBottom: "40px",
    maxWidth: "600px",
    margin: "0 auto 40px auto",
  },
  buttonContainer: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "16px 32px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)",
  },
  arrow: {
    transition: "transform 0.2s ease",
    display: "inline-block",
  },
  secondaryButton: {
    padding: "16px 32px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "transparent",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  featuresContainer: {
    display: "flex",
    gap: "30px",
    marginTop: "50px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  featureItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "20px 25px",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    minWidth: "120px",
    transition: "transform 0.3s ease",
  },
  featureIcon: {
    fontSize: "2rem",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
  },
  featureText: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "500",
    color: "#b0b8c9",
  }
};