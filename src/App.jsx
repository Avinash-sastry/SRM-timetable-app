import { useState, useRef, useEffect } from 'react'; // <-- Import useEffect
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { FiSun, FiMoon, FiTrash2, FiDownload } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import './App.css';
import SubjectCreator from './components/SubjectCreator';
import TimetableGrid from './components/TimetableGrid';
import SubjectItem from './components/SubjectItem';
import TimeHeader from './components/TimeHeader';
import TrashCan from './components/TrashCan';

const initializeGrid = () => {
  const grid = {};
  for (let day = 1; day <= 5; day++) {
    for (let hour = 1; hour <= 12; hour++) {
      grid[`day${day}-hour${hour}`] = null;
    }
  }
  return grid;
};

function App() {
  const [subjects, setSubjects] = useState([]);
  const [gridSlots, setGridSlots] = useState(initializeGrid());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false); // <-- NEW: State for capturing mode
  const timetableRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleAddSubject = (subjectName, subjectColor) => {
    const newSubject = { id: Date.now(), name: subjectName, color: subjectColor };
    setSubjects([...subjects, newSubject]);
  };

  const handleClearGrid = () => {
    if (window.confirm("Are you sure you want to clear the entire timetable?")) {
      setGridSlots(initializeGrid());
    }
  };

  // --- UPDATED Download Handler ---
  // This function now only sets the state to begin the capture process.
  const handleDownloadImage = () => {
    setIsCapturing(true);
  };

  // --- NEW useEffect to handle the actual canvas capture ---
  // This runs AFTER the component re-renders with isCapturing = true
  useEffect(() => {
    if (isCapturing) {
      const element = timetableRef.current;
      if (!element) return;

      html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: isDarkMode ? '#1a202c' : '#ffffff',
      }).then(canvas => {
        const data = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = data;
        link.download = 'my-timetable.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // IMPORTANT: Reset the capturing state after we're done.
        setIsCapturing(false);
      });
    }
  }, [isCapturing, isDarkMode]); // Dependency array ensures this runs when isCapturing changes


  // ... (Keep handleDragStart and handleDragEnd exactly as they were)
  const handleDragStart = (event) => {
    const subject = event.active.data.current?.subject;
    if (subject) {
      setActiveSubject(subject);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveSubject(null);
    if (!over) return;
    const subject = active.data.current?.subject;
    if (!subject) return;
    if (over.id === 'trash-can-droppable') {
      const draggedFromGrid = String(active.id).startsWith('day');
      setGridSlots(prevGrid => {
        const newGrid = { ...prevGrid };
        for (const slotId in newGrid) {
          if (newGrid[slotId] === subject.id) {
            newGrid[slotId] = null;
          }
        }
        return newGrid;
      });
      if (!draggedFromGrid) {
        setSubjects(prevSubjects => prevSubjects.filter(s => s.id !== subject.id));
      }
      return;
    }
    if (String(over.id).startsWith('day')) {
      const targetSlotId = over.id;
      const subjectIdToPlace = subject.id;
      const sourceSlotId = String(active.id).startsWith('day') ? active.id : null;
      if (gridSlots[targetSlotId] !== null && gridSlots[targetSlotId] !== subjectIdToPlace) {
        alert("This slot is already occupied. Please clear it first.");
        return;
      }
      const newGridSlots = { ...gridSlots };
      if (sourceSlotId) {
        newGridSlots[sourceSlotId] = null;
      }
      newGridSlots[targetSlotId] = subjectIdToPlace;
      setGridSlots(newGridSlots);
    }
  };


  // --- UPDATED: Add the 'is-capturing' class dynamically ---
  const appContainerClass = `app-container ${isDarkMode ? 'dark-mode' : ''} ${isCapturing ? 'is-capturing' : ''}`;

  return (
    <DndContext
      // ... (DndContext props remain the same)
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* We pass the new dynamic class here */}
      <div className={appContainerClass}>
        {/* ... (The rest of the JSX structure remains exactly the same) ... */}
        <div className="controls-panel">
          <button onClick={toggleDarkMode} className="toggle-dark-mode icon-button">
            {isDarkMode ? <FiSun /> : <FiMoon />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button onClick={handleClearGrid} className="clear-grid-btn icon-button">
            <FiTrash2 />
            <span>Clear Grid</span>
          </button>
          <h2>My Subjects</h2>
          <SubjectCreator onAddSubject={handleAddSubject} />
          <div className="subject-list">
            <h3>Available Subjects:</h3>
            {subjects.map(subject => (
              <SubjectItem 
                key={subject.id} 
                subject={subject} 
              />
            ))}
          </div>
          <TrashCan isDragging={activeSubject !== null} />
        </div>
        
        <div className="timetable-grid-wrapper" ref={timetableRef}>
          <TimeHeader />
          <div className="timetable-header-toolbar">
            <h1>My Timetable</h1>
            <button onClick={handleDownloadImage} className="download-btn icon-button">
              <FiDownload />
              <span>Save as Image</span>
            </button>
          </div>
          <TimetableGrid gridSlots={gridSlots} subjects={subjects} />
        </div>
      </div>
      
      <DragOverlay>
        {activeSubject ? <SubjectItem subject={activeSubject} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;