import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">

      {/* ── Hero Section ── */}
      <div className="hero">
        <h1 className="hero-title">Lecture Summariser</h1>
        <p className="hero-subtitle">
          Your AI-powered study companion. Upload a lecture PDF and get a clean,
          concise summary in seconds — so you can study smarter, not harder.
        </p>
        <button className="get-started-btn" onClick={() => navigate('/upload')}>
          Get Started
        </button>
      </div>

      {/* ── How It Works ── */}
      <div className="section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Upload Your PDF</h3>
            <p>Select any lecture PDF or slide deck from your device.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>AI Summarises It</h3>
            <p>Our AI reads through the content and extracts the key points for you.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Download & Study</h3>
            <p>Get a clean, formatted summary you can download and keep.</p>
          </div>
        </div>
      </div>

      {/* ── Do's and Don'ts ── */}
      <div className="section alt-section">
        <h2 className="section-title">Do's and Don'ts</h2>
        <div className="dos-donts-grid">
          <div className="dos-card">
            <h3>✅ Do's</h3>
            <ul>
              <li>Upload text-based PDFs for best results</li>
              <li>Download your summary immediately after — we don't save anything</li>
              <li>Use it for lecture notes, study guides, and revision material</li>
              <li>Upload one document at a time</li>
            </ul>
          </div>
          <div className="donts-card">
            <h3>❌ Don'ts</h3>
            <ul>
              <li>Don't upload scanned image PDFs — text can't be extracted from images</li>
              <li>Don't upload files larger than 10MB</li>
              <li>Don't expect the summary to replace reading entirely</li>
              <li>Don't upload sensitive or personal documents</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Why Us ── */}
      <div className="section">
        <h2 className="section-title">Why Lecture Summariser?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast</h3>
            <p>Get your summary in seconds, not hours.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Accurate</h3>
            <p>AI-powered extraction of the most important points.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Built for Students</h3>
            <p>Designed specifically around how students actually study.</p>
          </div>
        </div>
      </div>

      {/* ── Final CTA ── */}
      <div className="cta-section">
        <h2>Ready to study smarter?</h2>
        <p>No sign-up. No cost. Just upload and go.</p>
        <button className="get-started-btn" onClick={() => navigate('/upload')}>
          Get Started Now
        </button>
      </div>

      {/* ── Footer ── */}
      <div className="footer">
        <p>Lecture Summariser © 2025 — Built by Ndivhuwo & Ntando</p>
      </div>

    </div>
  );
}

export default WelcomePage;