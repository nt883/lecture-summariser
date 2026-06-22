import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import removeMd from 'remove-markdown';
import jsPDF from 'jspdf';
import '../App.css';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [formulas, setFormulas] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');

    try {
  const formData1 = new FormData();
  formData1.append('file', file);
  const formData2 = new FormData();
  formData2.append('file', file);

  const [summaryRes, formulasRes] = await Promise.all([
    fetch('http://127.0.0.1:8000/summarise', { method: 'POST', body: formData1 }),
    fetch('http://127.0.0.1:8000/formulas', { method: 'POST', body: formData2 }),
  ]);

  const summaryData = await summaryRes.json();
  const formulasData = await formulasRes.json();

  setSummary(summaryData.summary);
  setFormulas(formulasData.formulas);
} catch (err) {
  setError('Something went wrong while uploading. Please try again.');
}
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;
    let y = 0;

    const originalName = file.name.replace(/\.[^/.]+$/, '');

    doc.setFillColor(46, 125, 50);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(200, 230, 201);
    doc.text('LECTURE SUMMARY', margin, 14);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    const nameLines = doc.splitTextToSize(originalName, maxWidth);
    doc.text(nameLines, margin, 26);

    y = 40 + 14;

    doc.setDrawColor(46, 125, 50);
    doc.setLineWidth(1);
    doc.line(margin, y - 4, pageWidth - margin, y - 4);

    const addFooter = () => {
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${doc.internal.getCurrentPageInfo().pageNumber}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    };

    const rawLines = summary.split('\n');

    rawLines.forEach(rawLine => {
      let isHeading = false;
      let isSubHeading = false;
      let printLine = rawLine;

      if (rawLine.startsWith('### ')) {
        isSubHeading = true;
        printLine = rawLine.replace(/^###\s*/, '');
      } else if (rawLine.startsWith('## ')) {
        isHeading = true;
        printLine = rawLine.replace(/^##\s*/, '');
      } else {
        printLine = removeMd(rawLine);
      }

      if (printLine.trim() === '') { y += 4; return; }

      if (isHeading) {
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(46, 125, 50);
        y += 4;
      } else if (isSubHeading) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        y += 2;
      } else {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(40, 40, 40);
      }

      const wrappedLines = doc.splitTextToSize(printLine, maxWidth);

      wrappedLines.forEach(line => {
        if (y + 7 > pageHeight - 20) {
          addFooter();
          doc.addPage();
          y = margin;
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(40, 40, 40);
        }
        doc.text(line, margin, y);
        y += 7;
      });
    });

    addFooter();
    doc.setFillColor(46, 125, 50);
    doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

    doc.save(`${originalName} — Lecture Summary.pdf`);
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
      {formulas && (
  <div className="summary-block">
    <div className="summary-header">Formulas</div>
    <div className="summary-content">
      <ReactMarkdown>{formulas}</ReactMarkdown>
    </div>
  </div>
)}
    </div>
  );
}

export default UploadPage;