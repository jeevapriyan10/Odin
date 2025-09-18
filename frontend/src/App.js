import React, { useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("text"); // 'text' | 'url' | 'file'
  const [textValue, setTextValue] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const onSelectTab = (tab) => {
    setActiveTab(tab);
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  const handleAnalyze = async () => {
    setResult(null);
    // basic validation per tab
    if (activeTab === "text" && !textValue.trim()) return alert("Enter text to analyze");
    if (activeTab === "url" && !urlValue.trim()) return alert("Paste a URL to analyze");
    if (activeTab === "file" && !file) return alert("Attach a file to analyze");

    // Simulated API call
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setResult({
      verdict: Math.random() > 0.5 ? "Likely Real" : "Potential Misinformation",
      confidence: Math.floor(60 + Math.random() * 40),
      notes:
        activeTab === "text"
          ? "Heuristic analysis of claims and sensational language."
          : activeTab === "url"
          ? "Checked headline structure and domain reputation."
          : "Read EXIF and ran image forensics heuristics."
    });
    setLoading(false);
  };

  return (
    <div className="page">
      <header className="hero">
        <h1 className="title">Analyze Content for Misinformation</h1>
        <p className="subtitle">
          Upload text, paste a URL, or drag a file to get instant analysis and learn how to spot misinformation patterns.
        </p>
        <div className="description">
          <div className="feature-grid">
            <div className="feature-item">
              <span className="feature-icon"></span>
              <h3>Advanced Analysis</h3>
              <p>Uses AI-powered algorithms to detect potential misinformation in content</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon"></span>
              <h3>Multiple Formats</h3>
              <p>Analyze text, URLs, images, and documents for comprehensive verification</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon"></span>
              <h3>Instant Results</h3>
              <p>Get quick analysis with confidence scores and detailed insights</p>
            </div>
          </div>
        </div>
      </header>

      <section className="card">
        {/* Tab selector */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "text" ? "active" : ""}`}
            onClick={() => onSelectTab("text")}
            aria-pressed={activeTab === "text"}
          >
            Text
          </button>
          <button
            className={`tab ${activeTab === "url" ? "active" : ""}`}
            onClick={() => onSelectTab("url")}
            aria-pressed={activeTab === "url"}
          >
            URL
          </button>
          <button
            className={`tab ${activeTab === "file" ? "active" : ""}`}
            onClick={() => onSelectTab("file")}
            aria-pressed={activeTab === "file"}
          >
            File
          </button>
        </div>

        {/* Content area */}
        <div className="content">
          {activeTab === "text" && (
            <textarea
              className="textarea"
              placeholder="Paste or type the content you want to analyze..."
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              rows={8}
            />
          )}

          {activeTab === "url" && (
            <input
              className="input"
              type="url"
              placeholder="Paste the article or media URL to analyze..."
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
            />
          )}

          {activeTab === "file" && (
            <div
              className={`dropzone ${dragOver ? "drag" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              {file ? (
                <div className="fileRow">
                  <span className="fileName">{file.name}</span>
                  <button
                    className="clearBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="dropzoneHint">
                  <span className="dzIcon">📎</span>
                  <div>
                    <strong>Drag & drop</strong> a file here, or click to browse
                  </div>
                  <div className="muted">Images, PDFs, or text files up to 10MB</div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.txt,.md"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFile(f);
                }}
              />
            </div>
          )}

          <button className="primaryBtn" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Content"}
          </button>

          {result && (
            <div className="result">
              <div className={`badge ${result.verdict.includes("Potential") ? "warn" : "ok"}`}>
                {result.verdict} • {result.confidence}% confidence
              </div>
              <p className="notes">{result.notes}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}