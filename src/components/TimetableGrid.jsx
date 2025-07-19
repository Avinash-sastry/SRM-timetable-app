import TimetableSlot from './TimetableSlot';
import './TimetableGrid.css';

function TimetableGrid({ gridSlots, subjects }) {
  const days = 5;
  const hours = 12;
  const slots = [];

  for (let day = 1; day <= days; day++) {
    // Add a label for each day row in the first column
    slots.push(<div key={`day-label-${day}`} className="day-label">{`Day ${day}`}</div>);
    
    // Add the 12 time slots for that day
    for (let hour = 1; hour <= hours; hour++) {
      const slotId = `day${day}-hour${hour}`;
      // Check if this slot has a subject assigned in our state
      const assignedSubjectId = gridSlots[slotId];
      // Find the full subject object from our subjects list
      const subject = subjects.find(s => s.id === assignedSubjectId);
      
      slots.push(
        <TimetableSlot key={slotId} slotId={slotId} subject={subject} />
      );
    }
  }

  return (
    <div className="timetable-grid-container">
      {slots}
    </div>
  );
}

export default TimetableGrid;