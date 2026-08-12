import { useState } from "react";
import { API_BASE, authHeaders } from "../config";

const badgeClass = {
  LOW: "badge-low",
  MEDIUM: "badge-medium",
  HIGH: "badge-high",
  EMERGENCY: "badge-emergency",
};

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    if (!symptoms.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/symptom-checker`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ symptoms }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Could not reach the server - check Spring Boot and Python are running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Symptom Checker</h3>
      <textarea
        rows={3}
        placeholder="Describe your symptoms, e.g. 'fever, headache, sore throat for 2 days'"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />
      <button onClick={handleCheck} disabled={loading}>
        {loading ? "Checking..." : "Check Symptoms"}
      </button>

      {result && !result.error && (
        <div style={{ marginTop: 14 }}>
          <span className={`badge ${badgeClass[result.urgency] || "badge-low"}`}>
            Urgency: {result.urgency || "LOW"}
          </span>
          <h4 style={{ marginBottom: 4 }}>Possible conditions</h4>
          <ul style={{ marginTop: 0 }}>
            {(result.possible_conditions || []).map((c, i) => <li key={i}>{c}</li>)}
          </ul>
          <p><strong>Advice:</strong> {result.advice || "No advice provided."}</p>
          <p><strong>Recommended specialist:</strong> {result.recommended_specialist || "General Physician"}</p>
          <p className="muted">{result.disclaimer || "This is not a medical diagnosis."}</p>
        </div>
      )}

      {result?.error && (
        <p style={{ color: "red", marginTop: 10 }}>
          The AI response couldn't be parsed. Try again or check the Python service logs.
        </p>
      )}
    </div>
  );
}
