import { useEffect, useState, useRef } from "react";
import { API_BASE, authHeaders } from "../config";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({
    medicineName: "",
    dosage: "",
    frequency: "",
    reminderTimes: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [createdToast, setCreatedToast] = useState(null);
  const [activePopup, setActivePopup] = useState(null);

  // Track triggered times to prevent multi-triggering in the same minute
  const triggeredTimesRef = useRef(new Set());

  // Request browser Notification permission on load
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Web Audio API chime sound
  function playChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio fallback silent
    }
  }

  async function loadReminders() {
    try {
      const res = await fetch(`${API_BASE}/reminders`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setReminders(data);
      return data;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  useEffect(() => {
    loadReminders();
  }, []);

  // Check reminders every 10 seconds against current HH:mm
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const currentTimeStr = `${hours}:${minutes}`;

      reminders.forEach((rem) => {
        if (!rem.reminderTimes) return;
        const key = `${rem.id}-${currentTimeStr}`;
        if (triggeredTimesRef.current.has(key)) return;

        // Check if reminderTimes contains currentTime (e.g. "08:00, 20:00")
        const times = rem.reminderTimes.split(",").map((t) => t.trim());
        if (times.includes(currentTimeStr)) {
          triggeredTimesRef.current.add(key);
          playChime();

          // Native Browser Popup Notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`💊 Time for ${rem.medicineName}`, {
              body: `Dosage: ${rem.dosage || "Standard"} (${rem.frequency || "Scheduled"})`,
              icon: "/favicon.ico",
            });
          }

          // In-App Modal Popup
          setActivePopup({
            type: "ALARM",
            title: `Time to take ${rem.medicineName}`,
            body: `Dosage: ${rem.dosage || "Not specified"} · Frequency: ${rem.frequency || "Daily"}`,
            time: currentTimeStr,
            medicine: rem,
          });
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [reminders]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.medicineName.trim()) return;
    setLoading(true);
    setCreatedToast(null);

    try {
      const res = await fetch(`${API_BASE}/reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      
      const newMedName = form.medicineName;
      const newTimes = form.reminderTimes || "Scheduled time";
      const newDosage = form.dosage;

      setForm({ medicineName: "", dosage: "", frequency: "", reminderTimes: "", endDate: "" });
      await loadReminders();
      playChime();

      // Show instant confirmation toast banner
      setCreatedToast(`⏰ Medicine reminder set for ${newMedName} at ${newTimes}`);

      // Show confirmation Popup Modal
      setActivePopup({
        type: "CONFIRMATION",
        title: `Reminder Set Successfully! 🔔`,
        body: `You will get a pop-up alert for ${newMedName} ${newDosage ? `(${newDosage})` : ""} at ${newTimes}.`,
        medicineName: newMedName,
        times: newTimes,
      });

      // Browser Desktop Popup Notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`🔔 Reminder Set: ${newMedName}`, {
          body: `Scheduled for ${newTimes}`,
        });
      }
    } catch (err) {
      console.error(err);
      alert("Could not add reminder - check Spring Boot is running.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id) {
    try {
      await fetch(`${API_BASE}/reminders/${id}/deactivate`, { method: "PUT", headers: authHeaders() });
      await loadReminders();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="card">
      <h3>Medicine Reminders</h3>

      <form onSubmit={handleAdd}>
        <input
          placeholder="Medicine name (e.g. Paracetamol)"
          value={form.medicineName}
          onChange={(e) => setForm({ ...form, medicineName: e.target.value })}
          required
        />
        <input
          placeholder="Dosage (e.g. 500mg)"
          value={form.dosage}
          onChange={(e) => setForm({ ...form, dosage: e.target.value })}
        />
        <input
          placeholder="Frequency (e.g. Twice a day)"
          value={form.frequency}
          onChange={(e) => setForm({ ...form, frequency: e.target.value })}
        />
        <input
          placeholder="Times (e.g. 08:00, 20:00)"
          value={form.reminderTimes}
          onChange={(e) => setForm({ ...form, reminderTimes: e.target.value })}
        />
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Setting Reminder..." : "Set Medicine Reminder"}
        </button>
      </form>

      {createdToast && (
        <div className="reminder-toast-banner">
          <span>✅</span>
          <span>{createdToast}</span>
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        {reminders.length === 0 && <p className="muted">No active reminders.</p>}
        {reminders.map((r) => (
          <div className="reminder-item" key={r.id}>
            <div>
              <strong>💊 {r.medicineName}</strong>
              <p className="muted">
                {r.dosage} · {r.frequency} · ⏰ {r.reminderTimes}
              </p>
            </div>
            <button className="danger" onClick={() => handleRemove(r.id)}>Stop</button>
          </div>
        ))}
      </div>

      {/* POPUP NOTIFICATION MODAL */}
      {activePopup && (
        <div className="reminder-popup-overlay">
          <div className="reminder-popup-card">
            <div className="reminder-popup-badge">
              {activePopup.type === "ALARM" ? "🔔 MEDICINE ALARM" : "✅ REMINDER CONFIRMED"}
            </div>
            <div className="reminder-popup-icon">💊</div>
            <h4 className="reminder-popup-title">{activePopup.title}</h4>
            <p className="reminder-popup-body">{activePopup.body}</p>

            <div className="reminder-popup-actions">
              <button
                className="reminder-popup-btn primary"
                onClick={() => setActivePopup(null)}
              >
                {activePopup.type === "ALARM" ? "I took this medicine" : "Got it!"}
              </button>
              {activePopup.type === "ALARM" && (
                <button
                  className="reminder-popup-btn secondary"
                  onClick={() => setActivePopup(null)}
                >
                  Snooze
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

