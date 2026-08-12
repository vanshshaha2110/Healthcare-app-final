// Central place for the backend URL so you only change it in one spot.
const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";
export const API_BASE = (hostname === "localhost" || hostname === "127.0.0.1")
  ? "http://localhost:8081/api"
  : `http://${hostname}:8081/api`;

/** Returns Authorization header with stored JWT, or empty object if not logged in. */
export function authHeaders() {
  const token = localStorage.getItem("hc_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
