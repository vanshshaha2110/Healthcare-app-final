import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function getInitialTheme() {
  const saved = localStorage.getItem("hc_theme");
  if (saved === "light" || saved === "dark") return saved;
  // No saved preference yet — respect the device's system setting
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply the theme to the whole document and remember the choice
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("hc_theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  // On first load, restore session from localStorage if token exists
  useEffect(() => {
    const token = localStorage.getItem("hc_token");
    const email = localStorage.getItem("hc_email");
    if (token && email) {
      // Quick check: JWT not expired (decode payload, check exp)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUserEmail(email);
        } else {
          // Token expired — clear storage
          localStorage.removeItem("hc_token");
          localStorage.removeItem("hc_email");
        }
      } catch {
        localStorage.removeItem("hc_token");
        localStorage.removeItem("hc_email");
      }
    }
    setLoading(false);
  }, []);

  function handleLogin(email, token) {
    localStorage.setItem("hc_token", token);
    localStorage.setItem("hc_email", email);
    setUserEmail(email);
  }

  function handleLogout() {
    localStorage.removeItem("hc_token");
    localStorage.removeItem("hc_email");
    setUserEmail(null);
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="typing-bubble">
          <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
        </div>
      </div>
    );
  }

  if (!userEmail) {
    return <Login onLogin={handleLogin} theme={theme} onToggleTheme={toggleTheme} />;
  }

  return (
    <Dashboard
      userEmail={userEmail}
      onLogout={handleLogout}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}