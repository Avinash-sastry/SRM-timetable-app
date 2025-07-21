import { useState } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
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

    // --- NEW LOGIC FOR HANDLING DROPS ON THE GRID ---
    if (String(over.id).startsWith('day')) {
      const targetSlotId = over.id;
      const subjectIdToPlace = subject.id;
      const sourceSlotId = String(active.id).startsWith('day') ? active.id : null;

      // Check if the target slot is already occupied by a DIFFERENT subject
      if (gridSlots[targetSlotId] !== null && gridSlots[targetSlotId] !== subjectIdToPlace) {
        alert("This slot is already occupied. Please clear it first.");
        return; // Block the drop
      }

      // If we are moving from one slot to another, we need to clear the source slot
      const newGridSlots = { ...gridSlots };
      if (sourceSlotId) {
        newGridSlots[sourceSlotId] = null;
      }

      // Place the subject in the new slot
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
          <button onClick={toggleDarkMode} className="toggle-dark-mode">
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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