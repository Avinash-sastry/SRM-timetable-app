import { useState } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'; 
import './App.css';
import SubjectCreator from './components/SubjectCreator';
import TimetableGrid from './components/TimetableGrid';
import SubjectItem from './components/SubjectItem';
import TimeHeader from './components/TimeHeader'; // Import the new component

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
    const { active } = event;
    const subject = subjects.find(s => s.id === active.id);
    setActiveSubject(subject);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over) {
      const subjectId = active.id;
      const slotId = over.id;
      setGridSlots(prev => ({ ...prev, [slotId]: subjectId }));
    }
    setActiveSubject(null); 
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
              <SubjectItem key={subject.id} subject={subject} />
            ))}
          </div>
        </div>
        
        {/* We renamed the class here for clarity */}
        <div className="timetable-grid-wrapper">
          <TimeHeader /> {/* Add the new TimeHeader component */}
          <h1>My Timetable</h1>
          <TimetableGrid gridSlots={gridSlots} subjects={subjects} />
        </div>
      </div>

      <DragOverlay>
        {activeSubject ? (
          <SubjectItem subject={activeSubject} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;