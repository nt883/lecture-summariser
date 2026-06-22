import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://127.0.0.1:8000/summarise', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setError('Something went wrong while uploading. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'summary.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <h1>Lecture Summariser</h1>
      <p className="welcome-text">
        Welcome! Upload your lecture notes and let us do the heavy lifting.
      </p>
      <p className="description-text">
        Upload a PDF or slide deck and get a concise summary and key concepts in seconds.
      </p>
      <div className="upload-card">
        <label className="file-input-label">
  {file ? file.name : 'Choose a PDF file to upload'}
  <input type='file' accept='.pdf'
    onChange={e => setFile(e.target.files[0])} />
</label>
        <button className="upload-button" onClick={handleUpload}>
          {loading ? 'Summarising...' : 'Upload PDF'}
        </button>
        {summary && (
          <button className="download-button" onClick={handleDownload}>
            Download Summary
          </button>
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
      {summary && (
        <div className="summary-block">
          <div className="summary-header">Summary</div>
          <div className="summary-content">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;