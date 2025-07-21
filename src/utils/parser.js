// This function parses the "My Time Table 20xx" file
export function parseCourseList(rawText) {
  console.log("Parsing Course List with the definitive, resilient parser...");
  const subjects = [];
  const lines = rawText.split('\n');

  // Regex to find a course code like "21ECC303T"
  const courseCodeRegex = /(\d{2}[A-Z]{3,}\d{3,}[A-Z]?)/;
  // Regex to find a single capital letter surrounded by spaces or at the end of a line
  const slotCodeRegex = /\s([A-Z])(\s|$)/;

  for (const line of lines) {
    const codeMatch = line.match(courseCodeRegex);
    const slotMatch = line.match(slotCodeRegex);

    // We only proceed if we find BOTH a course code AND a slot code on the SAME line
    if (codeMatch && slotMatch) {
      const courseCode = codeMatch[1];
      const slotCode = slotMatch[1];
      
      // The title is the text between the end of the course code and the start of the slot code
      const titleStartIndex = codeMatch.index + courseCode.length;
      const titleEndIndex = slotMatch.index;
      
      let courseTitle = line.substring(titleStartIndex, titleEndIndex).trim();
      
      // Clean the title by removing numbers and non-alphanumeric characters
      courseTitle = courseTitle.replace(/(\d+|[^\w\s,&-])/g, '').trim();

      if (courseTitle.length > 5) { // Sanity check
        subjects.push({
          id: Date.now() + Math.random(),
          name: courseTitle,
          slot: slotCode,
          color: generateRandomColor(),
        });
      }
    }
  }

  console.log("Parsed Subjects:", subjects);
  return subjects;
}

// This function parses the "Unified Time Table 20xx" file
export function parseTimetableGrid(rawText) {
  console.log("Parsing Timetable Grid...");
  const gridMap = {};
  const lines = rawText.split('\n');
  let currentDay = 0;

  for (const line of lines) {
    const dayMatch = line.trim().match(/^Day\s*(\d)/i);
    if (dayMatch) {
      currentDay = parseInt(dayMatch[1], 10);
      const slotsText = line.substring(dayMatch[0].length).trim();
      const slots = slotsText.split(/\s+/);
      
      if (slots.length >= 12) {
         for (let i = 0; i < 12; i++) {
          const hour = i + 1;
          const slotId = `day${currentDay}-hour${hour}`;
          gridMap[slotId] = slots[i].split('/')[0];
        }
        currentDay = 0;
      }
    }
  }
  
  console.log("Parsed Grid Map:", gridMap);
  return gridMap;
}

function generateRandomColor() {
  return "hsl(" + Math.random() * 360 + ", 80%, 85%)";
}