import { useState } from "react";
import { API_BASE } from "../config";
import ThemeToggle from "../components/ThemeToggle";

export default function Login({ onLogin, theme, onToggleTheme }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function validate() {
    if (!email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return "Please enter a valid email address.";
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (mode === "signup" && password !== confirmPassword)
      return "Passwords do not match.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "signup" ? "/auth/register" : "/auth/login";
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      if (mode === "signup") {
        setSuccess("Account created! Logging you in...");
        setTimeout(() => onLogin(data.email, data.token), 800);
      } else {
        onLogin(data.email, data.token);
      }
    } catch {
      setError("Cannot reach the server. Make sure Spring Boot is running on port 8081.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === "login" ? "signup" : "login");
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="login-page">
      <div className="login-topbar">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="login-hero">
        <div className="login-hero-icon">🩺</div>
        <h1 className="login-hero-title">Healthcare Assistant</h1>
        <p className="login-hero-sub">
          Your personal AI-powered health companion
        </p>
      </div>

      <div className="login-box">
        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => mode !== "login" && switchMode()}
          >
            Log In
          </button>
          <button
            type="button"
            className={`login-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => mode !== "signup" && switchMode()}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="auth-email">Email Address</label>
            <input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              disabled={loading}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
            />
          </div>

          {mode === "signup" && (
            <div className="form-group">
              <label className="form-label" htmlFor="auth-confirm">Confirm Password</label>
              <input
                id="auth-confirm"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                disabled={loading}
                autoComplete="new-password"
                required
              />
            </div>
          )}

          {error && (
            <div className="auth-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              <span>✅</span> {success}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            id="auth-submit"
          >
            {loading ? (
              <span className="btn-loading">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </span>
            ) : mode === "signup" ? "Create Account" : "Log In"}
          </button>
        </form>

        <p className="auth-switch-text">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button type="button" className="link-btn" onClick={switchMode} disabled={loading}>
            {mode === "login" ? "Sign up free" : "Log in"}
          </button>
        </p>

        <div className="auth-features">
          <div className="auth-feature"><span>🔒</span> Passwords are BCrypt-encrypted</div>
          <div className="auth-feature"><span>🪙</span> Session secured with JWT tokens</div>
          <div className="auth-feature"><span>🏥</span> Your data is stored securely</div>
        </div>
      </div>
    </div>
  );
}