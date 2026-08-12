import { useState } from "react";
import { API_BASE, authHeaders } from "../config";

const LANG_TITLES = {
  ENGLISH: "English",
  HINDI: "हिंदी (Hindi)",
};

/**
 * Parses the backend's structured summary text into sections so it can be
 * rendered with real headings/bullets instead of one long paragraph.
 *
 * Expected shape (see gemini_service.py prompt):
 *   === ENGLISH ===
 *   Summary:
 *   - point one
 *   - point two
 *
 *   Medicines & Instructions:
 *   - point one
 *   === HINDI ===
 *   ...
 *
 * Falls back gracefully (renders as plain lines) if the AI response doesn't
 * match the expected structure exactly.
 */
function parseSummary(raw) {
  if (!raw) return [];
  const lines = raw.replace(/\r\n/g, "\n").split("\n");

  const sections = [];
  let currentSection = null;
  let currentGroup = null;

  const sectionHeaderRe = /^===\s*(ENGLISH|HINDI)\s*===$/i;

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const sectionMatch = line.match(sectionHeaderRe);
    if (sectionMatch) {
      currentSection = { lang: sectionMatch[1].toUpperCase(), groups: [] };
      sections.push(currentSection);
      currentGroup = null;
      continue;
    }

    // Bullet point
    if (line.startsWith("- ") || line.startsWith("• ")) {
      const text = line.replace(/^[-•]\s*/, "");
      if (!currentSection) {
        currentSection = { lang: "ENGLISH", groups: [] };
        sections.push(currentSection);
      }
      if (!currentGroup) {
        currentGroup = { heading: null, items: [] };
        currentSection.groups.push(currentGroup);
      }
      currentGroup.items.push(text);
      continue;
    }

    // Sub-heading, e.g. "Medicines & Instructions:" or "सारांश:"
    if (/:$/.test(line) && line.length < 60) {
      if (!currentSection) {
        currentSection = { lang: "ENGLISH", groups: [] };
        sections.push(currentSection);
      }
      currentGroup = { heading: line.replace(/:$/, ""), items: [] };
      currentSection.groups.push(currentGroup);
      continue;
    }

    // Plain text line (no bullet/heading) - treat as its own item
    if (!currentSection) {
      currentSection = { lang: "ENGLISH", groups: [] };
      sections.push(currentSection);
    }
    if (!currentGroup) {
      currentGroup = { heading: null, items: [] };
      currentSection.groups.push(currentGroup);
    }
    currentGroup.items.push(line);
  }

  return sections;
}

function SummaryView({ summary }) {
  const sections = parseSummary(summary);

  if (sections.length === 0) {
    return <p className="muted" style={{ fontSize: 13 }}>No summary available.</p>;
  }

  return (
    <div className="doc-summary">
      {sections.map((section, sIdx) => (
        <div className="doc-summary-lang" key={sIdx}>
          <div className="doc-summary-lang-title">
            {LANG_TITLES[section.lang] || section.lang}
          </div>
          {section.groups.map((group, gIdx) => (
            <div className="doc-summary-group" key={gIdx}>
              {group.heading && (
                <div className="doc-summary-heading">{group.heading}</div>
              )}
              {group.items.length === 1 && !group.heading ? (
                <p className="doc-summary-text">{group.items[0]}</p>
              ) : (
                <ul className="doc-summary-list">
                  {group.items.map((item, iIdx) => (
                    <li key={iIdx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function DocumentUpload() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("PRESCRIPTION");
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);

      const res = await fetch(`${API_BASE}/documents/upload`, {
        method: "POST",
        headers: authHeaders(),
        body: formData, // don't set Content-Type manually - browser sets the multipart boundary
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const result = await res.json();
      setDocuments([result, ...documents]);
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + err.message + "\nCheck that Spring Boot (8081) and Python (8000) are both running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Upload Prescription / Report</h3>

      <select value={documentType} onChange={(e) => setDocumentType(e.target.value)}>
        <option value="PRESCRIPTION">Prescription</option>
        <option value="LAB_REPORT">Lab Report</option>
      </select>

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      <div style={{ marginTop: 14 }}>
        {documents.length === 0 && <p className="muted">No documents uploaded yet.</p>}
        {documents.map((doc, idx) => (
          <div className="doc-item" key={doc?.id || idx}>
            <div>
              <strong>{doc?.fileName || "Document"}</strong>
              <p className="muted">
                {(doc?.documentType || "DOCUMENT").replace("_", " ")} · {doc?.uploadedAt ? doc.uploadedAt.split("T")[0] : "Today"}
              </p>
              <SummaryView summary={doc?.aiSummary} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}