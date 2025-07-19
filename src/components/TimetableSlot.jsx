import { useDroppable } from '@dnd-kit/core';
import './TimetableSlot.css';

// This component represents one droppable cell in our grid.
function TimetableSlot({ slotId, subject }) {
  // The useDroppable hook makes this component a valid drop zone.
  const { isOver, setNodeRef } = useDroppable({
    id: slotId, // The unique ID for this droppable area
  });

  // We'll determine the style based on whether a subject is present
  // or if a draggable item is currently hovering over it.
  const style = {
    backgroundColor: subject ? subject.color : (isOver ? '#aaffaa' : '#eee'),
  };

  return (
    <div ref={setNodeRef} className="timetable-slot" style={style}>
      {/* If a subject is assigned to this slot, display its name */}
      {subject ? subject.name : ''}
    </div>
  );
}

export default TimetableSlot;