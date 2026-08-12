import { useState } from "react";
import DocumentUpload from "../components/DocumentUpload";
import SymptomChecker from "../components/SymptomChecker";
import Reminders from "../components/Reminders";
import DoctorRecommendation from "../components/DoctorRecommendation";
import ChatBot from "../components/ChatBot";
import ThemeToggle from "../components/ThemeToggle";
import HealthOverview from "../components/HealthOverview";
import HealthRiskAssessment from "../components/HealthRiskAssessment";
import DietPlanner from "../components/DietPlanner";

export default function Dashboard({ userEmail, onLogout, theme, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState("hub"); // "hub" | "overview" | "symptoms" | "risk" | "diet" | "reminders" | "chatbot" | "documents" | "doctors"

  const services = [
    {
      id: "overview",
      title: "Health Dashboard & Records",
      description: "Unified view of your health score, vitals, active reminders, and medical records.",
      icon: "📊",
      badge: "Unified View",
      color: "#2563eb"
    },
    {
      id: "symptoms",
      title: "Symptom Checker",
      description: "Describe your symptoms and receive instant AI guidance and specialist recommendations.",
      icon: "🩺",
      badge: "AI Guidance",
      color: "#3b82f6"
    },
    {
      id: "risk",
      title: "AI Health Risk Assessment",
      description: "Evaluate cardiovascular, metabolic, and lifestyle risks based on vitals and history.",
      icon: "🛡️",
      badge: "Preventive AI",
      color: "#ef4444"
    },
    {
      id: "diet",
      title: "Personalized AI Diet Planner",
      description: "Custom daily meal plans and macros tailored to your health goals and preferences.",
      icon: "🥗",
      badge: "Nutrition AI",
      color: "#10b981"
    },
    {
      id: "reminders",
      title: "Medicine Reminders",
      description: "Set pill schedules with audio chimes and real-time pop-up notification alarms.",
      icon: "💊",
      badge: "Pop-up Alarms",
      color: "#059669"
    },
    {
      id: "chatbot",
      title: "Healthcare Chatbot",
      description: "Discuss general health topics and ask medical questions 24/7 with AI.",
      icon: "💬",
      badge: "AI Assistant",
      color: "#8b5cf6"
    },
    {
      id: "documents",
      title: "Prescription & Report Analyzer",
      description: "Upload prescription images or lab reports for bilingual English & Hindi explanations.",
      icon: "📄",
      badge: "Vision AI",
      color: "#f59e0b"
    },
    {
      id: "doctors",
      title: "Doctor Finder",
      description: "Find top rated specialists, dentists, and clinics in your city.",
      icon: "👨‍⚕️",
      badge: "Directory",
      color: "#ec4899"
    }
  ];

  return (
    <div className="app-shell">
      {/* Top Header */}
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 
            style={{ cursor: "pointer" }} 
            onClick={() => setActiveTab("hub")}
          >
            🩺 Healthcare Assistant
          </h1>
          {activeTab !== "hub" && (
            <button className="secondary" style={{ padding: "4px 10px", fontSize: 13 }} onClick={() => setActiveTab("hub")}>
              ← Back to Hub
            </button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="muted">{userEmail}</span>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="secondary" onClick={onLogout}>Log out</button>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <div className="dashboard-nav-bar">
        <button 
          className={`nav-bar-item ${activeTab === "hub" ? "active" : ""}`}
          onClick={() => setActiveTab("hub")}
        >
          🏠 Home Hub
        </button>
        <button 
          className={`nav-bar-item ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Health Dashboard
        </button>
        <button 
          className={`nav-bar-item ${activeTab === "symptoms" ? "active" : ""}`}
          onClick={() => setActiveTab("symptoms")}
        >
          🩺 Symptom Checker
        </button>
        <button 
          className={`nav-bar-item ${activeTab === "risk" ? "active" : ""}`}
          onClick={() => setActiveTab("risk")}
        >
          🛡️ Risk Assessment
        </button>
        <button 
          className={`nav-bar-item ${activeTab === "diet" ? "active" : ""}`}
          onClick={() => setActiveTab("diet")}
        >
          🥗 AI Diet Planner
        </button>
        <button 
          className={`nav-bar-item ${activeTab === "reminders" ? "active" : ""}`}
          onClick={() => setActiveTab("reminders")}
        >
          💊 Medicine Reminders
        </button>
        <button 
          className={`nav-bar-item ${activeTab === "chatbot" ? "active" : ""}`}
          onClick={() => setActiveTab("chatbot")}
        >
          💬 AI Chatbot
        </button>
        <button 
          className={`nav-bar-item ${activeTab === "documents" ? "active" : ""}`}
          onClick={() => setActiveTab("documents")}
        >
          📄 Prescriptions & Reports
        </button>
        <button 
          className={`nav-bar-item ${activeTab === "doctors" ? "active" : ""}`}
          onClick={() => setActiveTab("doctors")}
        >
          👨‍⚕️ Doctor Finder
        </button>
      </div>

      {/* Main Page Area */}
      <div className="container" style={{ paddingTop: 20 }}>
        {/* HOME HUB SERVICES VIEW */}
        {activeTab === "hub" && (
          <div className="services-hub">
            <div className="hub-header">
              <h2>Welcome to your Healthcare Portal 👋</h2>
              <p className="muted">Select any feature below to launch that dedicated service</p>
            </div>

            <div className="hub-services-grid">
              {services.map((s) => (
                <div 
                  key={s.id} 
                  className="hub-service-card"
                  onClick={() => setActiveTab(s.id)}
                >
                  <div className="hub-card-top">
                    <span className="hub-card-icon">{s.icon}</span>
                    <span className="hub-card-badge" style={{ borderColor: s.color, color: s.color }}>
                      {s.badge}
                    </span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <div className="hub-card-footer">
                    <span>Open Feature Page</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INDIVIDUAL SINGLE PAGE VIEWS */}
        {activeTab === "overview" && (
          <div className="single-feature-view">
            <HealthOverview onNavigate={(target) => setActiveTab(target)} />
          </div>
        )}

        {activeTab === "symptoms" && (
          <div className="single-feature-view">
            <SymptomChecker />
          </div>
        )}

        {activeTab === "risk" && (
          <div className="single-feature-view">
            <HealthRiskAssessment 
              onNavigateToDiet={() => setActiveTab("diet")}
              onNavigateToDoctors={() => setActiveTab("doctors")}
            />
          </div>
        )}

        {activeTab === "diet" && (
          <div className="single-feature-view">
            <DietPlanner />
          </div>
        )}

        {activeTab === "reminders" && (
          <div className="single-feature-view">
            <Reminders />
          </div>
        )}

        {activeTab === "chatbot" && (
          <div className="single-feature-view">
            <ChatBot />
          </div>
        )}

        {activeTab === "documents" && (
          <div className="single-feature-view">
            <DocumentUpload />
          </div>
        )}

        {activeTab === "doctors" && (
          <div className="single-feature-view">
            <DoctorRecommendation />
          </div>
        )}
      </div>
    </div>
  );
}