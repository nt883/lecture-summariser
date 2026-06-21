import { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('http://127.0.0.1:8000/extract', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      setText(data.text);
    } catch (err) {
      setError('Something went wrong while uploading. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <input type='file' accept='.pdf'
          onChange={e => setFile(e.target.files[0])} />
        <button className="upload-button" onClick={handleUpload}>
          {loading ? 'Extracting...' : 'Upload PDF'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
      {text && <pre className="extracted-text">{text}</pre>}
    </div>
  );
}

export default App;