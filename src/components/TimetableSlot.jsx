import { useDroppable } from '@dnd-kit/core';
import SubjectItem from './SubjectItem';
import './TimetableSlot.css';

function TimetableSlot({ slotId, subject }) {
  const { isOver, setNodeRef } = useDroppable({
    id: slotId,
  });

  const style = {
    backgroundColor: subject ? 'transparent' : (isOver ? 'var(--color-slot-hover)' : 'var(--color-slot-empty)'),
    borderStyle: isOver ? 'solid' : 'dashed',
  };

  return (
    <div ref={setNodeRef} className="timetable-slot" style={style}>
      {/* If a subject exists, render a SubjectItem INSTANCE.
          Give it the slotId as its unique draggableId. */}
      {subject ? <SubjectItem subject={subject} draggableId={slotId} /> : null}
    </div>
  );
}

export default TimetableSlot;