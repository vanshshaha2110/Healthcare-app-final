const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";

export const API_BASE =
  hostname === "localhost" || hostname === "127.0.0.1"
    ? "http://localhost:8081/api"
    : "https://healthcare-spring-backend.onrender.com/api";

export function authHeaders() {
  const token = localStorage.getItem("hc_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}