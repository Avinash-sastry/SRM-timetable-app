import { useDraggable } from '@dnd-kit/core';
import './SubjectItem.css';

function SubjectItem({ subject }) {
  // --- UPDATED: Add isDragging ---
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: subject.id,
    data: { subject },
  });

  const style = {
    // --- UPDATED: If dragging, make the original item transparent ---
    opacity: isDragging ? 0.5 : 1,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    backgroundColor: subject.color,
  };

  return (
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