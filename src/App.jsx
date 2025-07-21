import { useState } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
// --- Import the icons we need ---
import { FiSun, FiMoon, FiTrash2 } from 'react-icons/fi';
import './App.css';
import SubjectCreator from './components/SubjectCreator';
import TimetableGrid from './components/TimetableGrid';
import SubjectItem from './components/SubjectItem';
import TimeHeader from './components/TimeHeader';
import TrashCan from './components/TrashCan';

// ... (keep the initializeGrid function as is)
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
  // ... (keep all the useState hooks and handler functions as they are)
  const [subjects, setSubjects] = useState([]);
  const [gridSlots, setGridSlots] = useState(initializeGrid());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSubject, setActiveSubject] = useState(null);

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


  const appContainerClass = `app-container ${isDarkMode ? 'dark-mode' : ''}`;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={appContainerClass}>
        <div className="controls-panel">
          {/* --- UPDATED BUTTONS WITH ICONS --- */}
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
        <div className="timetable-grid-wrapper">
          <TimeHeader />
          <h1>My Timetable</h1>
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