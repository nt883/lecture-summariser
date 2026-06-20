import { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('http://127.0.0.1:8000/extract', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setText(data.text);
    setLoading(false);
  };

  return (
    <div>
      <h1>Lecture Summariser</h1>
      <input type='file' accept='.pdf'
        onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>
        {loading ? 'Extracting...' : 'Upload PDF'}
      </button>
      {text && <pre>{text}</pre>}
    </div>
  );
}

export default App;