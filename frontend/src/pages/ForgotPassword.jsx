import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import "./styles/Auth.css";

export default function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const r = (searchParams.get("role") || "STUDENT").toUpperCase();
    if (r === "INSTRUCTOR" || r === "STUDENT") setRole(r);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const path =
        role === "INSTRUCTOR"
          ? "/auth/instructor/forgot-password"
          : "/auth/student/forgot-password";
      await apiClient.post(
        path,
        { email },
        { headers: { Authorization: undefined } },
      );
      setMessage("If the email exists, a reset link has been sent.");
    } catch (_) {
      setMessage("If the email exists, a reset link has been sent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">LearnHub</span>
          </div>
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">We’ll email you a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="STUDENT">Student</option>
              <option value="INSTRUCTOR">Instructor</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <div className="success-message">{message}</div>}

        <div className="auth-switch">
          Remembered your password?{" "}
          {role === "INSTRUCTOR" ? (
            <Link to="/instructor/signin">Sign in</Link>
          ) : (
            <Link to="/student/signin">Sign in</Link>
          )}
        </div>
      </div>
    </div>
  );
}
