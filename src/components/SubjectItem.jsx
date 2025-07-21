import { useDraggable } from '@dnd-kit/core';
import './SubjectItem.css';

// This component is now simple again. It doesn't need the onDelete prop.
function SubjectItem({ subject, draggableId }) {
  const id = draggableId || subject.id;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: { subject },
  });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: subject.color,
  };

  return (
    // We just need the div for the subject itself.
    <div
      className="subject-item"
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      {subject.name}
    </div>
  );
}

export default SubjectItem;