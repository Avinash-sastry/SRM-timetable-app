import './TimeHeader.css';

// Data for our 12 time slots
const timeHeaders = [
  { from: "08:00", to: "08:50" },
  { from: "08:50", to: "09:40" },
  { from: "09:45", to: "10:35" },
  { from: "10:40", to: "11:30" },
  { from: "11:35", to: "12:25" },
  { from: "12:30", to: "01:20" },
  { from: "01:25", to: "02:15" },
  { from: "02:20", to: "03:10" },
  { from: "03:10", to: "04:00" },
  { from: "04:00", to: "04:50" },
  { from: "04:50", to: "05:30" },
  { from: "05:30", to: "06:10" }
];

function TimeHeader() {
  return (
    <div className="time-header-container">
      {/* First column: The FROM/TO Labels */}
      <div className="time-header-label-cell">
        <div>FROM</div>
        <div>TO</div>
      </div>
      
      {/* The next 12 columns for the times */}
      {timeHeaders.map((time, index) => (
        <div key={index} className="time-header-slot-cell">
          <div>{time.from}</div>
          <div>-</div>
          <div>{time.to}</div>
        </div>
      ))}
    </div>
  );
}

export default TimeHeader;