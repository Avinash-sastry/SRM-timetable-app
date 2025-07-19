import { useState } from 'react'; // Import useState
import './SubjectCreator.css';

// We now accept "props", which is how a parent component sends data/functions down.
// We are specifically expecting a prop called `onAddSubject`.
function SubjectCreator({ onAddSubject }) {
  // State for this component's own internal memory
  const [name, setName] = useState('');
  const [color, setColor] = useState('#C8E6C9');

  const handleSubmit = () => {
    // Don't add a subject if the name is empty
    if (!name.trim()) return; 
    
    // Call the function that was passed down from the App component
    onAddSubject(name, color);

    // Reset the form for the next entry
    setName('');
  };

  return (
    <div className="subject-creator">
      <h3>Add a New Subject</h3>
      <input
        type="text"
        placeholder="Subject Name (e.g., VLSI)"
        value={name} // The input's value is tied to our 'name' state
        onChange={(e) => setName(e.target.value)} // When it changes, update the state
      />
      <input
        type="color"
        value={color} // The color input's value is tied to our 'color' state
        onChange={(e) => setColor(e.target.value)} // When it changes, update the state
      />
      <button onClick={handleSubmit}>Add Subject</button>
    </div>
  );
}

export default SubjectCreator;