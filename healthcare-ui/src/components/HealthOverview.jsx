import { useEffect, useState } from "react";
import { API_BASE, authHeaders } from "../config";

export default function HealthOverview({ onNavigate }) {
  const [reminders, setReminders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [vitals, setVitals] = useState({
    sysBP: "120",
    diaBP: "80",
    bloodSugar: "95",
    heartRate: "72",
    weight: "68",
    height: "172"
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchReminders();
    fetchDocuments();
    const saved = localStorage.getItem("hc_user_vitals");
    if (saved) {
      try { setVitals(JSON.parse(saved)); } catch {}
    }
  }, []);

  async function fetchReminders() {
    try {
      const res = await fetch(`${API_BASE}/reminders`, { headers: authHeaders() });
      if (res.ok) setReminders(await res.json());
    } catch {}
  }

  async function fetchDocuments() {
    try {
      const res = await fetch(`${API_BASE}/documents`, { headers: authHeaders() });
      if (res.ok) setDocuments(await res.json());
    } catch {}
  }

  function handleSaveVitals(e) {
    e.preventDefault();
    localStorage.setItem("hc_user_vitals", JSON.stringify(vitals));
    setIsEditing(false);
  }

  const heightM = (parseFloat(vitals.height) || 170) / 100;
  const weightKg = parseFloat(vitals.weight) || 70;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);

  let bmiCategory = "Normal";
  let bmiColor = "var(--success)";
  if (bmi < 18.5) { bmiCategory = "Underweight"; bmiColor = "var(--warning)"; }
  else if (bmi >= 25 && bmi < 30) { bmiCategory = "Overweight"; bmiColor = "var(--warning)"; }
  else if (bmi >= 30) { bmiCategory = "Obese"; bmiColor = "var(--danger)"; }

  return (
    <div className="health-overview-container">
      {/* Top Welcome Banner & Score */}
      <div className="card overview-hero-card">
        <div className="hero-left">
          <div className="hero-avatar">👤</div>
          <div>
            <h3>Personal Health Records & Vitals</h3>
            <p className="muted">Your unified health metrics and activity records at a glance.</p>
          </div>
        </div>

        <div className="health-score-badge">
          <div className="score-ring">
            <span className="score-num">88</span>
            <span className="score-label">/100</span>
          </div>
          <span className="score-title">Health Score</span>
        </div>
      </div>

      {/* Quick Actions Shortcuts */}
      <div className="overview-shortcuts">
        <button className="shortcut-btn" onClick={() => onNavigate("risk")}>
          <span>🛡️</span>
          <div>
            <strong>Risk Assessment</strong>
            <small>Evaluate health risks</small>
          </div>
        </button>

        <button className="shortcut-btn" onClick={() => onNavigate("diet")}>
          <span>🥗</span>
          <div>
            <strong>AI Diet Planner</strong>
            <small>Custom daily meal plan</small>
          </div>
        </button>

        <button className="shortcut-btn" onClick={() => onNavigate("symptoms")}>
          <span>🩺</span>
          <div>
            <strong>Symptom Checker</strong>
            <small>Instant AI guidance</small>
          </div>
        </button>

        <button className="shortcut-btn" onClick={() => onNavigate("doctors")}>
          <span>👨‍⚕️</span>
          <div>
            <strong>Find Specialists</strong>
            <small>Book appointment</small>
          </div>
        </button>
      </div>

      {/* Vitals Summary Grid */}
      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0 }}>💓 My Vitals & Body Metrics</h3>
          <button className="secondary" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "✏️ Update Vitals"}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveVitals} className="vitals-edit-form">
            <div className="vitals-form-grid">
              <div>
                <label>Systolic BP (mmHg)</label>
                <input value={vitals.sysBP} onChange={(e) => setVitals({ ...vitals, sysBP: e.target.value })} />
              </div>
              <div>
                <label>Diastolic BP (mmHg)</label>
                <input value={vitals.diaBP} onChange={(e) => setVitals({ ...vitals, diaBP: e.target.value })} />
              </div>
              <div>
                <label>Fasting Blood Sugar (mg/dL)</label>
                <input value={vitals.bloodSugar} onChange={(e) => setVitals({ ...vitals, bloodSugar: e.target.value })} />
              </div>
              <div>
                <label>Heart Rate (bpm)</label>
                <input value={vitals.heartRate} onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })} />
              </div>
              <div>
                <label>Weight (kg)</label>
                <input value={vitals.weight} onChange={(e) => setVitals({ ...vitals, weight: e.target.value })} />
              </div>
              <div>
                <label>Height (cm)</label>
                <input value={vitals.height} onChange={(e) => setVitals({ ...vitals, height: e.target.value })} />
              </div>
            </div>
            <button type="submit" style={{ marginTop: 12 }}>Save Vitals</button>
          </form>
        ) : (
          <div className="vitals-cards-grid">
            <div className="vital-card">
              <span className="vital-icon">🩸</span>
              <div className="vital-info">
                <span className="vital-label">Blood Pressure</span>
                <strong className="vital-value">{vitals.sysBP}/{vitals.diaBP} <small>mmHg</small></strong>
                <span className="vital-status good">Normal</span>
              </div>
            </div>

            <div className="vital-card">
              <span className="vital-icon">🍬</span>
              <div className="vital-info">
                <span className="vital-label">Fasting Sugar</span>
                <strong className="vital-value">{vitals.bloodSugar} <small>mg/dL</small></strong>
                <span className="vital-status good">Optimal</span>
              </div>
            </div>

            <div className="vital-card">
              <span className="vital-icon">💓</span>
              <div className="vital-info">
                <span className="vital-label">Resting Heart Rate</span>
                <strong className="vital-value">{vitals.heartRate} <small>bpm</small></strong>
                <span className="vital-status good">Healthy</span>
              </div>
            </div>

            <div className="vital-card">
              <span className="vital-icon">⚖️</span>
              <div className="vital-info">
                <span className="vital-label">BMI Index</span>
                <strong className="vital-value">{bmi} <small>kg/m²</small></strong>
                <span className="vital-status" style={{ color: bmiColor }}>{bmiCategory}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Two Column Grid for Active Records */}
      <div className="grid" style={{ marginTop: 16 }}>
        {/* Active Reminders */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>💊 Active Reminders</h3>
            <button className="secondary" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => onNavigate("reminders")}>
              Manage →
            </button>
          </div>
          {reminders.length === 0 ? (
            <p className="muted" style={{ fontSize: 13 }}>No active medicine reminders set.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {reminders.slice(0, 3).map((r) => (
                <div key={r.id} className="overview-record-item">
                  <strong>💊 {r.medicineName}</strong>
                  <span className="muted" style={{ fontSize: 12 }}>⏰ {r.reminderTimes} · {r.dosage}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Uploaded Medical Reports */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>📄 Health Records & Reports</h3>
            <button className="secondary" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => onNavigate("documents")}>
              Upload New →
            </button>
          </div>
          {documents.length === 0 ? (
            <p className="muted" style={{ fontSize: 13 }}>No prescriptions or reports uploaded yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {documents.slice(0, 3).map((d) => (
                <div key={d.id} className="overview-record-item">
                  <strong>📋 {d.documentType} ({d.fileName || "Report"})</strong>
                  <span className="muted" style={{ fontSize: 12 }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
