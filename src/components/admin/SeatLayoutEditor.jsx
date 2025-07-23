import React, { useState, useEffect } from 'react';
import '../../pages/admin/UpdateLayout.css';

const SEAT_AVAILABLE = 1;
const SEAT_UNAVAILABLE = 0;
const SEAT_VIP = 2;

const getRowLabel = (idx) => String.fromCharCode(65 + idx);

const SeatLayoutEditor = ({ layout, setLayout, disabled }) => {
  const [selectedType, setSelectedType] = useState(SEAT_AVAILABLE);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  if (!layout) return null;

  // Set seat type (single cell)
  const setSeatType = (rowIdx, colIdx) => {
    const newLayout = layout.map((row, r) =>
      r === rowIdx
        ? row.map((cell, c) => (c === colIdx ? selectedType : cell))
        : row
    );
    setLayout(newLayout);
  };

  // Drag paint seat type (multiple cells)
  const handleCellMouseDown = (rowIdx, colIdx, event) => {
    if (disabled) return;
    event.preventDefault();
    setIsDragging(true);
    setSeatType(rowIdx, colIdx);
  };
  const handleCellMouseEnter = (rowIdx, colIdx, event) => {
    if (isDragging && !disabled) {
      event.preventDefault();
      setSeatType(rowIdx, colIdx);
    }
  };

  // Add/remove rows/columns
  const addRow = () => {
    const newLayout = [...layout, Array(layout[0].length).fill(SEAT_AVAILABLE)];
    setLayout(newLayout);
  };
  const removeRow = () => {
    if (layout.length > 1) {
      const newLayout = layout.slice(0, -1);
      setLayout(newLayout);
    }
  };
  const addCol = () => {
    const newLayout = layout.map((row) => [...row, SEAT_AVAILABLE]);
    setLayout(newLayout);
  };
  const removeCol = () => {
    if (layout[0].length > 1) {
      const newLayout = layout.map((row) => row.slice(0, -1));
      setLayout(newLayout);
    }
  };

  return (
    <div className="layout-container bg-white/20 border border-white/30 rounded-2xl shadow-lg p-0 backdrop-blur-md animate-fade-in-up">
      <div className="seat-type-selector flex justify-center">
        <span>Select Seat Type:</span>
        <button
          className={`seat-btn ${selectedType === SEAT_AVAILABLE ? 'active available' : ''}`}
          onClick={() => setSelectedType(SEAT_AVAILABLE)}
          disabled={disabled}
        >
          Regular
        </button>
        <button
          className={`seat-btn ${selectedType === SEAT_VIP ? 'active vip' : ''}`}
          onClick={() => setSelectedType(SEAT_VIP)}
          disabled={disabled}
        >
          VIP
        </button>
        <button
          className={`seat-btn ${selectedType === SEAT_UNAVAILABLE ? 'active unavailable' : ''}`}
          onClick={() => setSelectedType(SEAT_UNAVAILABLE)}
          disabled={disabled}
        >
          No Seat
        </button>
      </div>

      <div className="legend flex justify-center">
        <span className="seat-cell available"></span> Regular
        <span className="seat-cell vip"></span> VIP
        <span className="seat-cell unavailable"></span> No Seat
      </div>

      <div className="controls-container flex justify-center">
        <button onClick={addRow} className="control-btn add" disabled={disabled}>+ Row</button>
        <button onClick={removeRow} className="control-btn remove" disabled={disabled}>- Row</button>
        <button onClick={addCol} className="control-btn add" disabled={disabled}>+ Col</button>
        <button onClick={removeCol} className="control-btn remove" disabled={disabled}>- Col</button>
      </div>

      <div className="table-wrapper">
        <table className="layout-table">
          <thead>
            <tr>
              <th className="bg-white/20 text-black font-bold rounded-tl-xl backdrop-blur-md border border-white/30 px-4 py-2"> </th>
              {layout[0].map((_, colIdx) => (
                <th key={colIdx} className="bg-white/20 text-black font-bold backdrop-blur-md border border-white/30 px-4 py-2 rounded-md">{colIdx + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {layout.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <th className="bg-white/20 text-black font-bold backdrop-blur-md border border-white/30 px-4 py-2 rounded-md">{getRowLabel(rowIdx)}</th>
                {row.map((cell, colIdx) => (
                  <td
                    key={colIdx}
                    className={`seat-cell ${cell === SEAT_AVAILABLE ? 'available' : cell === SEAT_VIP ? 'vip' : 'unavailable'}`}
                    onMouseDown={e => handleCellMouseDown(rowIdx, colIdx, e)}
                    onMouseEnter={e => handleCellMouseEnter(rowIdx, colIdx, e)}
                    title={`Row ${getRowLabel(rowIdx)}, Seat ${colIdx + 1}`}
                    style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                  >
                    {`${getRowLabel(rowIdx)}${colIdx + 1}`}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeatLayoutEditor; 