import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../../api/apiClient";
import "../styles/Auth.css";

export default function InstructorSignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post(
        "/auth/instructor/login",
        {
          email,
          password,
        }
      );

      // Store token and user data
      const { token, instructor } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(instructor));
      localStorage.setItem("userRole", "INSTRUCTOR");

      // Navigate to instructor dashboard
      navigate("/instructor/dashboard");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Invalid email or password";
      setError(errorMsg);
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
          <h1 className="auth-title">Instructor Sign In</h1>
          <p className="auth-subtitle">
            Welcome back! Continue inspiring students
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="instructor@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-footer">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link
              to="/forgot-password?role=INSTRUCTOR"
              className="forgot-password"
            >
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-switch">
          Don't have an account? <Link to="/instructor/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
