import { useState, useEffect } from "react";
import { API_BASE, authHeaders } from "../config";

const QUICK_SPECIALTIES = [
  "Dentist",
  "Orthodontist (Dentist)",
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Pediatrician",
  "Orthopedic Surgeon",
  "Gynecologist",
];

const MAHARASHTRA_CITIES = [
  "Mumbai",
  "Pune",
  "Nagpur",
  "Thane",
  "Nashik",
  "Chhatrapati Sambhaji Nagar",
  "Solapur",
  "Amravati",
  "Navi Mumbai",
  "Kolhapur",
  "Akola",
  "Latur",
  "Dhule",
  "Ahmednagar",
  "Chandrapur",
  "Parbhani",
  "Jalgaon",
  "Nanded",
  "Sangli",
  "Satara",
  "Ratnagiri",
];

const METRO_CITIES = [
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Surat",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Indore",
  "Bhopal",
  "Gurgaon",
  "Noida",
  "Chandigarh",
  "Kochi",
  "Patna",
];

export default function DoctorRecommendation() {
  const [specialty, setSpecialty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCityFilter, setSelectedCityFilter] = useState("All Cities");

  useEffect(() => {
    fetchDoctors("", "", "");
  }, []);

  async function fetchDoctors(spec, cty, queryText) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (spec) params.append("specialty", spec);
      if (cty && cty !== "All Cities") params.append("city", cty);
      if (queryText) params.append("query", queryText);

      const res = await fetch(`${API_BASE}/doctors/recommend?${params}`, { headers: authHeaders() });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    if (e) e.preventDefault();
    fetchDoctors(specialty, selectedCityFilter, searchQuery);
  }

  function handleQuickSpecialty(spec) {
    const nextSpec = specialty === spec ? "" : spec;
    setSpecialty(nextSpec);
    fetchDoctors(nextSpec, selectedCityFilter, searchQuery);
  }

  function handleCityChange(cty) {
    setSelectedCityFilter(cty);
    fetchDoctors(specialty, cty, searchQuery);
  }

  function resetFilters() {
    setSpecialty("");
    setSearchQuery("");
    setSelectedCityFilter("All Cities");
    fetchDoctors("", "", "");
  }

  return (
    <div className="card card-full">
      <div className="doctor-section-header">
        <div>
          <h3 style={{ margin: 0 }}>👨‍⚕️ Find a Doctor & Specialist (Dentists, Metros & Maharashtra)</h3>
          <span className="muted">Search verified doctors, dentists, clinics & hospitals across India</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span className="badge badge-low" style={{ background: "#2563eb", padding: "6px 12px", fontSize: 12 }}>
            {results.length} Doctors Available
          </span>
          {(specialty || searchQuery || selectedCityFilter !== "All Cities") && (
            <button onClick={resetFilters} className="secondary" style={{ padding: "4px 10px", fontSize: 12 }}>
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <form onSubmit={handleSearch} style={{ marginTop: 14 }}>
        <div className="doctor-filter-bar">
          <input
            placeholder="🔍 Search doctor name, dentist, hospital, condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <input
            placeholder="Specialty (e.g. Dentist, Cardiologist)"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <select
            value={selectedCityFilter}
            onChange={(e) => handleCityChange(e.target.value)}
            style={{ marginBottom: 0 }}
          >
            <option value="All Cities">📍 All Cities</option>
            <optgroup label="Maharashtra Cities">
              {MAHARASHTRA_CITIES.map((c, i) => (
                <option key={`mh-${i}`} value={c}>
                  📍 {c}
                </option>
              ))}
            </optgroup>
            <optgroup label="Big Indian Metros">
              {METRO_CITIES.map((c, i) => (
                <option key={`metro-${i}`} value={c}>
                  📍 {c}
                </option>
              ))}
            </optgroup>
          </select>
          <button type="submit" disabled={loading} style={{ minWidth: 90 }}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Specialty Filter Chips */}
      <div className="prompt-chips" style={{ margin: "14px 0" }}>
        <span className="chips-label">Popular Specialties:</span>
        {QUICK_SPECIALTIES.map((spec, idx) => (
          <button
            key={idx}
            className={`chip-btn ${specialty === spec ? "active-chip" : ""}`}
            onClick={() => handleQuickSpecialty(spec)}
          >
            {spec === "Dentist" ? "🦷 Dentist" : spec}
          </button>
        ))}
      </div>

      {/* Doctor Cards Grid */}
      <div className="doctors-grid">
        {loading && <p className="muted" style={{ gridColumn: "1 / -1" }}>Loading doctors dataset...</p>}
        {!loading && results.length === 0 && (
          <div style={{ textAlign: "center", padding: 24, background: "#f8fafc", borderRadius: 8, gridColumn: "1 / -1" }}>
            <p style={{ margin: 0, fontWeight: 600 }}>No matching doctors found.</p>
            <span className="muted">Try adjusting your specialty or city search criteria.</span>
          </div>
        )}
        {results.map((d) => (
          <div className="doctor-card-item" key={d.id}>
            <div className="doctor-avatar">
              {d.specialty && d.specialty.toLowerCase().includes("dent") ? "🦷" : (d.name ? d.name.replace("Dr. ", "").charAt(0) : "D")}
            </div>
            <div className="doctor-details">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <strong className="doctor-name">{d.name}</strong>
                <span className="rating-badge">⭐ {d.rating}</span>
              </div>
              <span className="specialty-badge">{d.specialty}</span>
              <p className="muted doctor-hospital">🏥 {d.hospital}, {d.city}</p>
              <div className="doctor-actions">
                <a href={`tel:${d.contact}`} className="call-btn">
                  📞 {d.contact}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
