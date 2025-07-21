import { useState } from 'react';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { parseCourseList, parseTimetableGrid } from '../utils/parser';
import './FileProcessor.css';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function FileProcessor({ onParseComplete }) {
  const [courseListFile, setCourseListFile] = useState(null);
  const [gridFile, setGridFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');

  // This is the correct way to handle file uploads in a functional component
  const handleFileUpload = (event, fileType) => {
    const file = event.target.files[0];
    if (!file) return;

    if (fileType === 'courseList') {
      setCourseListFile(file); // Use the setter from useState
    } else if (fileType === 'grid') {
      setGridFile(file); // Use the setter from useState
    }
  };

  const processFile = async (file) => {
    let rawText = '';
    if (file.type.startsWith('image/')) {
      const result = await Tesseract.recognize(file, 'eng', { logger: m => console.log(m) });
      rawText = result.data.text;
    } else if (file.type === 'application/pdf') {
      const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport: viewport }).promise;
        const result = await Tesseract.recognize(canvas, 'eng');
        rawText += result.data.text + '\n';
      }
    }
    return rawText;
  };

  const handleGenerate = async () => {
    if (!courseListFile || !gridFile) {
      alert("Please upload both the Course List and the Timetable Grid files.");
      return;
    }
    setIsProcessing(true);
    try {
      setStatusText("Processing Course List file...");
      const coursesRawText = await processFile(courseListFile);
      const parsedCourses = parseCourseList(coursesRawText);
      if (parsedCourses.length === 0) throw new Error("Could not find any subjects in the course list file. Please check the document quality.");
      
      setStatusText(`Found ${parsedCourses.length} subjects. Now processing timetable grid...`);
      const gridRawText = await processFile(gridFile);
      const parsedGridMap = parseTimetableGrid(gridRawText);
      if (Object.keys(parsedGridMap).length === 0) throw new Error("Could not parse the timetable grid structure.");

      onParseComplete(parsedCourses, parsedGridMap);
      setStatusText("Success! Timetable has been generated.");

    } catch (err) {
      console.error(err);
      setStatusText(`An error occurred: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="file-processor-container">
      <h3>Automatic Timetable Importer (Beta)</h3>
      <div className="uploader-section">
        <label>1. Upload Course List</label>
        <span>(My time table 20xx.pdf)</span>
        <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, 'courseList')} />
        {courseListFile && <p className="file-name-display">{courseListFile.name}</p>}
      </div>
      <div className="uploader-section">
        <label>2. Upload Timetable Grid</label>
        <span>(Unified time table 20xx.pdf)</span>
        <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, 'grid')} />
        {gridFile && <p className="file-name-display">{gridFile.name}</p>}
      </div>
      <button onClick={handleGenerate} disabled={isProcessing} className="parse-btn">
        {isProcessing ? 'Working...' : 'Generate Timetable'}
      </button>
      {statusText && <p className="status-text">{statusText}</p>}
    </div>
  );
}

export default FileProcessor;