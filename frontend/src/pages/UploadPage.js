import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import removeMd from 'remove-markdown';
import jsPDF from 'jspdf';
import '../App.css';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(() => localStorage.getItem('summary') || '');
  const [formulas, setFormulas] = useState(() => localStorage.getItem('formulas') || '');
  const [concepts, setConcepts] = useState(() => localStorage.getItem('concepts') || '');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    // Task 7 — reject non-PDF files
    if (!file.name.endsWith('.pdf')) {
      setError('Please upload a PDF file only.');
      return;
    }

    setLoading(true);
    setDone(false);
    setError('');

    try {
      const formData1 = new FormData();
      formData1.append('file', file);
      const formData2 = new FormData();
      formData2.append('file', file);
      const formData3 = new FormData();
      formData3.append('file', file);

      const [summaryRes, formulasRes, conceptsRes] = await Promise.all([
        fetch('https://brieflyai-apuv.onrender.com/summarise', { method: 'POST', body: formData1 }),
        fetch('https://brieflyai-apuv.onrender.com/formulas', { method: 'POST', body: formData2 }),
        fetch('https://brieflyai-apuv.onrender.com/concepts', { method: 'POST', body: formData3 }),
      ]);

      const summaryData = await summaryRes.json();
      const formulasData = await formulasRes.json();
      const conceptsData = await conceptsRes.json();

      setSummary(summaryData.summary);
      setFormulas(formulasData.formulas);
      setConcepts(conceptsData.concepts);
      setDone(true);

      // Save to localStorage
      localStorage.setItem('summary', summaryData.summary);
      localStorage.setItem('formulas', formulasData.formulas);
      localStorage.setItem('concepts', conceptsData.concepts);

    } catch (err) {
      setError('Something went wrong while uploading. Please try again.');
    } finally {
      setLoading(false);
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

    // ── Header band ──────────────────────────────────
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

    y = 54;

    doc.setDrawColor(46, 125, 50);
    doc.setLineWidth(1);
    doc.line(margin, y - 4, pageWidth - margin, y - 4);

    // ── Footer helper ────────────────────────────────
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

    // ── Generic section printer ───────────────────────
    const printSection = (rawText) => {
      const rawLines = rawText.split('\n');

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
    };

    // ── Section label helper ──────────────────────────
    const printSectionLabel = (label) => {
      y += 6;
      if (y + 10 > pageHeight - 20) {
        addFooter();
        doc.addPage();
        y = margin;
      }
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(46, 125, 50);
      doc.text(label, margin, y);
      y += 8;
      doc.setDrawColor(200, 230, 201);
      doc.setLineWidth(0.5);
      doc.line(margin, y - 3, pageWidth - margin, y - 3);
      y += 4;
    };

    // ── Print all three sections ──────────────────────
    printSectionLabel('Summary');
    printSection(summary);

    if (concepts) {
      printSectionLabel('Key Concepts');
      printSection(concepts);
    }

    if (formulas) {
      printSectionLabel('Formulas');
      printSection(formulas);
    }

    // ── Final footer and footer bar ───────────────────
    addFooter();
    doc.setFillColor(46, 125, 50);
    doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');

    doc.save(`${originalName} — Lecture Summary.pdf`);
  };

  return (
    <div className="App">
      <h1>BrieflyAI</h1>
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
  onChange={e => {
  setFile(e.target.files[0]);
  setSummary('');
  setFormulas('');
  setConcepts('');
  setDone(false);
  setError('');
  localStorage.removeItem('summary');
  localStorage.removeItem('formulas');
  localStorage.removeItem('concepts');
}} />
        </label>

        {/* Button text changes based on state */}
        <button className="upload-button" onClick={handleUpload}>
          {loading ? 'Summarising...' : done ? 'Summary Done ✓' : 'Upload PDF'}
        </button>

        {done && (
  <button className="regenerate-button" onClick={handleUpload}>
    🔄 Not satisfied? Regenerate
  </button>
)}

        {/* Loading message — disappears once done */}
        {loading && (
          <p className='loading-message'>
            Analysing your lecture... this may take a few seconds
          </p>
        )}

        {/* Download button — only appears after summary is ready with a disclaimer text beneath it */}
        {summary && (
          <button className="download-button" onClick={handleDownload}>
          Download Summary
            </button>
        )}
        {summary && (
            <p className="disclaimer-text">
        Remember to download your summary — we don't store anything.
         </p>
      )}
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Summary block */}
      {summary && (
        <div className="summary-block">
          <div className="summary-header">Summary</div>
          <div className="summary-content">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {summary}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Key Concepts block */}
      {concepts && (
        <div className='summary-block concepts-block'>
          <div className='summary-header'>Key Concepts</div>
          <div className='summary-content'>
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {concepts}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Formulas block */}
      {formulas && (
        <div className="summary-block">
          <div className="summary-header">Formulas</div>
          <div className="summary-content">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {formulas}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPage;