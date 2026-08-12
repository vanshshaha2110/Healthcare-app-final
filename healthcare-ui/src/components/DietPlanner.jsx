import { useState } from "react";
import { API_BASE, authHeaders } from "../config";

export default function DietPlanner() {
  const [form, setForm] = useState({
    goal: "Weight Loss",
    preference: "Vegetarian",
    activity: "Moderate",
    allergies: "",
    context: ""
  });

  const [loading, setLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setDietPlan(null);

    try {
      const res = await fetch(`${API_BASE}/diet-planner`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed to generate plan");
      const data = await res.json();
      setDietPlan(data);
    } catch (err) {
      console.error(err);
      // Fallback diet plan if backend unavailable
      setDietPlan({
        dailyTargetCalories: 1850,
        macros: { proteinGrams: 85, carbsGrams: 190, fatsGrams: 48 },
        hydrationGoalLiters: 3.0,
        meals: {
          breakfast: { title: "Oats Porridge & Walnuts", description: "Rolled oats cooked in milk with chia seeds, banana, and walnuts", calories: 380 },
          lunch: { title: "Whole Wheat Roti, Paneer & Dal", description: "2 Rotis with Paneer Bhurji, yellow dal, and fresh cucumber salad", calories: 620 },
          snack: { title: "Sprouted Moong Salad & Green Tea", description: "Lightly seasoned sprouts with lemon juice and green tea", calories: 220 },
          dinner: { title: "Vegetable Khichdi & Greek Yogurt", description: "Moong dal khichdi with mixed vegetables and low-fat curd", calories: 480 }
        },
        foodsToPrefer: ["Spinach & Green Leafy Veggies", "Lentils & Chickpeas", "Almonds & Flaxseeds", "Fresh Berries"],
        foodsToLimit: ["Processed Sugars", "Refined Flour (Maida)", "Deep Fried Snacks"],
        nutritionTip: "Drink a warm glass of water 30 minutes before meals to aid digestion and prevent overeating."
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 28 }}>🥗</span>
        <div>
          <h3 style={{ margin: 0 }}>Personalized AI Diet & Nutrition Planner</h3>
          <p className="muted" style={{ margin: 0, fontSize: 13 }}>
            Generate structured daily meal plans and nutrition macros tailored to your health goals.
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="diet-form">
        <div className="vitals-form-grid">
          <div>
            <label>Primary Health Goal</label>
            <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
              <option>Weight Loss</option>
              <option>Muscle Gain</option>
              <option>Diabetes Care & Sugar Control</option>
              <option>Heart Healthy (Low Cholesterol)</option>
              <option>Balanced Daily Maintenance</option>
            </select>
          </div>

          <div>
            <label>Dietary Preference</label>
            <select value={form.preference} onChange={(e) => setForm({ ...form, preference: e.target.value })}>
              <option>Vegetarian</option>
              <option>Non-Vegetarian</option>
              <option>Eggetarian</option>
              <option>Vegan</option>
              <option>Keto</option>
            </select>
          </div>

          <div>
            <label>Activity Level</label>
            <select value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })}>
              <option>Sedentary (Desk job)</option>
              <option>Moderate (Light workout)</option>
              <option>Active (Regular sports/gym)</option>
              <option>Very Active (Intense training)</option>
            </select>
          </div>

          <div>
            <label>Allergies / Dislikes (Optional)</label>
            <input
              placeholder="e.g. Dairy, Nuts, Seafood"
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Crafting Your Nutrition Plan..." : "Generate AI Diet Plan"}
        </button>
      </form>

      {/* GENERATED DIET PLAN DISPLAY */}
      {dietPlan && (
        <div className="diet-results-container" style={{ marginTop: 24 }}>
          {/* Top Macros & Targets */}
          <div className="diet-macros-banner">
            <div className="macro-box">
              <span className="macro-num">{dietPlan.dailyTargetCalories}</span>
              <span className="macro-label">Target Calories/day</span>
            </div>
            <div className="macro-box">
              <span className="macro-num">{dietPlan.macros?.proteinGrams || 80}g</span>
              <span className="macro-label">Protein</span>
            </div>
            <div className="macro-box">
              <span className="macro-num">{dietPlan.macros?.carbsGrams || 200}g</span>
              <span className="macro-label">Carbs</span>
            </div>
            <div className="macro-box">
              <span className="macro-num">{dietPlan.macros?.fatsGrams || 50}g</span>
              <span className="macro-label">Healthy Fats</span>
            </div>
            <div className="macro-box">
              <span className="macro-num">{dietPlan.hydrationGoalLiters || 3.0}L</span>
              <span className="macro-label">Water / Day</span>
            </div>
          </div>

          {/* Daily Meals Timeline */}
          <h4 style={{ margin: "20px 0 12px 0", fontSize: 16 }}>🍽️ Daily Meal Schedule</h4>
          <div className="meals-grid">
            <div className="meal-card">
              <div className="meal-header">
                <span>🌅 Breakfast</span>
                <span className="meal-cals">{dietPlan.meals?.breakfast?.calories || 400} kcal</span>
              </div>
              <strong>{dietPlan.meals?.breakfast?.title}</strong>
              <p className="muted" style={{ fontSize: 13, margin: "4px 0 0 0" }}>
                {dietPlan.meals?.breakfast?.description}
              </p>
            </div>

            <div className="meal-card">
              <div className="meal-header">
                <span>☀️ Lunch</span>
                <span className="meal-cals">{dietPlan.meals?.lunch?.calories || 600} kcal</span>
              </div>
              <strong>{dietPlan.meals?.lunch?.title}</strong>
              <p className="muted" style={{ fontSize: 13, margin: "4px 0 0 0" }}>
                {dietPlan.meals?.lunch?.description}
              </p>
            </div>

            <div className="meal-card">
              <div className="meal-header">
                <span>☕ Evening Snack</span>
                <span className="meal-cals">{dietPlan.meals?.snack?.calories || 200} kcal</span>
              </div>
              <strong>{dietPlan.meals?.snack?.title}</strong>
              <p className="muted" style={{ fontSize: 13, margin: "4px 0 0 0" }}>
                {dietPlan.meals?.snack?.description}
              </p>
            </div>

            <div className="meal-card">
              <div className="meal-header">
                <span>🌙 Dinner</span>
                <span className="meal-cals">{dietPlan.meals?.dinner?.calories || 500} kcal</span>
              </div>
              <strong>{dietPlan.meals?.dinner?.title}</strong>
              <p className="muted" style={{ fontSize: 13, margin: "4px 0 0 0" }}>
                {dietPlan.meals?.dinner?.description}
              </p>
            </div>
          </div>

          {/* Nutrition Tips & Food Guidance */}
          <div className="grid" style={{ marginTop: 16 }}>
            <div className="card" style={{ background: "var(--bg-subtle)" }}>
              <h5 style={{ margin: "0 0 8px 0", color: "var(--success)" }}>🟢 Foods to Prefer</h5>
              <ul className="preventive-steps-list">
                {dietPlan.foodsToPrefer?.map((item, idx) => (
                  <li key={idx}>🥦 {item}</li>
                ))}
              </ul>
            </div>

            <div className="card" style={{ background: "var(--bg-subtle)" }}>
              <h5 style={{ margin: "0 0 8px 0", color: "var(--danger)" }}>🔴 Foods to Limit</h5>
              <ul className="preventive-steps-list">
                {dietPlan.foodsToLimit?.map((item, idx) => (
                  <li key={idx}>🚫 {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {dietPlan.nutritionTip && (
            <div className="reminder-toast-banner" style={{ marginTop: 16 }}>
              <span>💡</span>
              <span><strong>Nutrition Tip:</strong> {dietPlan.nutritionTip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
