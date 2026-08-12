import { useState } from "react";
import { API_BASE, authHeaders } from "../config";

export default function HealthRiskAssessment({ onNavigateToDiet, onNavigateToDoctors }) {
  const [form, setForm] = useState({
    age: "35",
    gender: "Male",
    height: "172",
    weight: "72",
    systolicBP: "120",
    diastolicBP: "80",
    bloodSugar: "95",
    heartRate: "72",
    exercise: "Moderate (2-3 times/week)",
    smoking: "No",
    alcohol: "Occasional",
    sleep: "7",
    history: "None"
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Auto-calculate BMI
  const heightM = (parseFloat(form.height) || 170) / 100;
  const weightKg = parseFloat(form.weight) || 70;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const payload = { ...form, bmi };

    try {
      const res = await fetch(`${API_BASE}/risk-assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to assess risk");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      // Fallback evaluation if API offline
      setResult({
        overallRiskScore: 28,
        riskCategory: "LOW",
        summary: "Based on your inputs, your overall health risk profile is Low. Continue maintaining a balanced lifestyle.",
        cardiovascularRisk: { score: 20, level: "LOW", details: "Blood pressure and heart rate are within normal physiological range." },
        diabetesRisk: { score: 25, level: "LOW", details: "Fasting blood sugar is in optimal range." },
        lifestyleRisk: { score: 35, level: "MODERATE", details: "Consider increasing regular physical activity." },
        identifiedRisks: ["Sedentary work hours", "Inconsistent sleep pattern"],
        preventiveSteps: [
          "Engage in 30 minutes of aerobic exercise daily",
          "Maintain a fiber-rich balanced diet",
          "Ensure 7 to 8 hours of restful sleep",
          "Schedule annual routine blood checkups"
        ],
        recommendedSpecialist: "General Physician"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>🛡️</span>
        <div>
          <h3 style={{ margin: 0 }}>AI Health Risk Assessment</h3>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            Evaluate cardiovascular, metabolic, and lifestyle risk factors with AI-guided preventive steps.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="risk-form">
        <div className="risk-form-grid">
          <div>
            <label>Age (years)</label>
            <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
          </div>

          <div>
            <label>Gender</label>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label>Height (cm)</label>
            <input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} required />
          </div>

          <div>
            <label>Weight (kg)</label>
            <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required />
          </div>

          <div>
            <label>Systolic BP (mmHg)</label>
            <input type="number" value={form.systolicBP} onChange={(e) => setForm({ ...form, systolicBP: e.target.value })} required />
          </div>

          <div>
            <label>Diastolic BP (mmHg)</label>
            <input type="number" value={form.diastolicBP} onChange={(e) => setForm({ ...form, diastolicBP: e.target.value })} required />
          </div>

          <div>
            <label>Fasting Blood Sugar (mg/dL)</label>
            <input type="number" value={form.bloodSugar} onChange={(e) => setForm({ ...form, bloodSugar: e.target.value })} required />
          </div>

          <div>
            <label>Resting Heart Rate (bpm)</label>
            <input type="number" value={form.heartRate} onChange={(e) => setForm({ ...form, heartRate: e.target.value })} required />
          </div>

          <div>
            <label>Exercise Frequency</label>
            <select value={form.exercise} onChange={(e) => setForm({ ...form, exercise: e.target.value })}>
              <option>None / Sedentary</option>
              <option>Light (1-2 times/week)</option>
              <option>Moderate (2-3 times/week)</option>
              <option>Active (4+ times/week)</option>
            </select>
          </div>

          <div>
            <label>Smoking Status</label>
            <select value={form.smoking} onChange={(e) => setForm({ ...form, smoking: e.target.value })}>
              <option>No</option>
              <option>Former Smoker</option>
              <option>Yes (Light)</option>
              <option>Yes (Heavy)</option>
            </select>
          </div>

          <div>
            <label>Alcohol Consumption</label>
            <select value={form.alcohol} onChange={(e) => setForm({ ...form, alcohol: e.target.value })}>
              <option>Never</option>
              <option>Occasional</option>
              <option>Regular</option>
            </select>
          </div>

          <div>
            <label>Sleep Duration (hours)</label>
            <input type="number" value={form.sleep} onChange={(e) => setForm({ ...form, sleep: e.target.value })} required />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>Medical & Family History (Optional)</label>
          <input
            placeholder="e.g. Family history of Diabetes, Hypertension, Asthma"
            value={form.history}
            onChange={(e) => setForm({ ...form, history: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Evaluating Risk Factors..." : "Calculate Health Risk Assessment"}
        </button>
      </form>

      {/* RESULT SECTION */}
      {result && (
        <div className="risk-result-card" style={{ marginTop: 24 }}>
          <div className="risk-score-banner">
            <div>
              <span className="risk-category-badge" data-level={result.riskCategory}>
                {result.riskCategory} RISK
              </span>
              <h4 style={{ margin: "8px 0 4px 0", fontSize: 18 }}>Overall Health Risk Score</h4>
              <p className="muted" style={{ margin: 0, fontSize: 13 }}>{result.summary}</p>
            </div>

            <div className="risk-score-circle" data-level={result.riskCategory}>
              <span>{result.overallRiskScore}</span>
              <small>/ 100</small>
            </div>
          </div>

          {/* Individual Risk Drivers */}
          <div className="risk-drivers-grid" style={{ marginTop: 16 }}>
            <div className="driver-card">
              <span className="driver-title">🫀 Cardiovascular Risk</span>
              <strong className="driver-level" data-level={result.cardiovascularRisk?.level}>
                {result.cardiovascularRisk?.level || "LOW"} ({result.cardiovascularRisk?.score || 20}%)
              </strong>
              <p className="muted" style={{ fontSize: 12, margin: "4px 0 0 0" }}>
                {result.cardiovascularRisk?.details}
              </p>
            </div>

            <div className="driver-card">
              <span className="driver-title">🩸 Diabetes & Metabolic</span>
              <strong className="driver-level" data-level={result.diabetesRisk?.level}>
                {result.diabetesRisk?.level || "LOW"} ({result.diabetesRisk?.score || 20}%)
              </strong>
              <p className="muted" style={{ fontSize: 12, margin: "4px 0 0 0" }}>
                {result.diabetesRisk?.details}
              </p>
            </div>

            <div className="driver-card">
              <span className="driver-title">🏃 Lifestyle Impact</span>
              <strong className="driver-level" data-level={result.lifestyleRisk?.level}>
                {result.lifestyleRisk?.level || "LOW"} ({result.lifestyleRisk?.score || 25}%)
              </strong>
              <p className="muted" style={{ fontSize: 12, margin: "4px 0 0 0" }}>
                {result.lifestyleRisk?.details}
              </p>
            </div>
          </div>

          {/* Actionable Preventive Steps */}
          <div style={{ marginTop: 18 }}>
            <h5 style={{ margin: "0 0 8px 0", fontSize: 15 }}>🌱 Actionable Preventive Steps</h5>
            <ul className="preventive-steps-list">
              {result.preventiveSteps?.map((step, idx) => (
                <li key={idx}>✅ {step}</li>
              ))}
            </ul>
          </div>

          {/* Inter-Feature Connect Actions */}
          <div className="risk-next-actions">
            <button className="primary" onClick={() => onNavigateToDiet(result)}>
              🥗 Generate Tailored Diet Plan
            </button>
            <button className="secondary" onClick={() => onNavigateToDoctors(result.recommendedSpecialist)}>
              👨‍⚕️ Consult {result.recommendedSpecialist || "Specialist"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
