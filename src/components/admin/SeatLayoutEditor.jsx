import React, { useState, useEffect } from 'react';
import '../../pages/admin/UpdateLayout.css';

const SEAT_AVAILABLE = 1;
const SEAT_UNAVAILABLE = 0;
const SEAT_GOLD = 2;
const SEAT_PREMIUM = 3;

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
            <div className="layout-container bg-white/20 border border-white/30 rounded-2xl shadow-lg p-0 animate-fade-in-up">
      <div className="seat-type-selector flex justify-center">
        <span>Select Seat Type:</span>
        <button
          type="button"
          className={`seat-btn available ${selectedType === SEAT_AVAILABLE ? 'active' : ''}`}
          onClick={() => setSelectedType(SEAT_AVAILABLE)}
          disabled={disabled}
        >
          Silver
        </button>
        <button
          type="button"
          className={`seat-btn gold ${selectedType === SEAT_GOLD ? 'active' : ''}`}
          onClick={() => setSelectedType(SEAT_GOLD)}
          disabled={disabled}
        >
          Gold
        </button>
        <button
          type="button"
          className={`seat-btn premium ${selectedType === SEAT_PREMIUM ? 'active' : ''}`}
          onClick={() => setSelectedType(SEAT_PREMIUM)}
          disabled={disabled}
        >
          Premium
        </button>
        <button
          type="button"
          className={`seat-btn unavailable ${selectedType === SEAT_UNAVAILABLE ? 'active' : ''}`}
          onClick={() => setSelectedType(SEAT_UNAVAILABLE)}
          disabled={disabled}
        >
          No Seat
        </button>
      </div>

      <div className="legend flex justify-center">
        <span className="seat-cell available"></span> Silver
        <span className="seat-cell gold"></span> Gold
        <span className="seat-cell premium"></span> Premium
        <span className="seat-cell unavailable"></span> No Seat
      </div>

      <div className="controls-container flex justify-center gap-6 mb-4">
        {/* Row Controls */}
        <div className="flex items-center gap-2" style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '8px 12px'
        }}>
          <span className="text-white font-medium text-sm">Row</span>
          <div className="flex gap-1">
            <button 
              type="button" 
              onClick={addRow} 
              disabled={disabled}
              className="w-8 h-8 flex items-center justify-center rounded-md text-white font-bold text-lg transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(34, 197, 94, 0.8)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  e.target.style.background = 'rgba(34, 197, 94, 1)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(34, 197, 94, 0.8)';
              }}
            >
              +
            </button>
            <button 
              type="button" 
              onClick={removeRow} 
              disabled={disabled}
              className="w-8 h-8 flex items-center justify-center rounded-md text-white font-bold text-lg transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(239, 68, 68, 0.8)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  e.target.style.background = 'rgba(239, 68, 68, 1)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.8)';
              }}
            >
              -
            </button>
          </div>
        </div>

        {/* Column Controls */}
        <div className="flex items-center gap-2" style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '8px 12px'
        }}>
          <span className="text-white font-medium text-sm">Column</span>
          <div className="flex gap-1">
            <button 
              type="button" 
              onClick={addCol} 
              disabled={disabled}
              className="w-8 h-8 flex items-center justify-center rounded-md text-white font-bold text-lg transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(34, 197, 94, 0.8)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  e.target.style.background = 'rgba(34, 197, 94, 1)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(34, 197, 94, 0.8)';
              }}
            >
              +
            </button>
            <button 
              type="button" 
              onClick={removeCol} 
              disabled={disabled}
              className="w-8 h-8 flex items-center justify-center rounded-md text-white font-bold text-lg transition-all duration-200 hover:scale-105"
              style={{
                background: 'rgba(239, 68, 68, 0.8)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  e.target.style.background = 'rgba(239, 68, 68, 1)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.8)';
              }}
            >
              -
            </button>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="layout-table">
          <thead>
            <tr>
                              <th className="bg-white/20 text-black font-bold rounded-tl-xl border border-white/30 px-4 py-2"> </th>
              {layout[0].map((_, colIdx) => (
                                  <th key={colIdx} className="bg-white/20 text-black font-bold border border-white/30 px-4 py-2 rounded-md">{colIdx + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {layout.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <th className="bg-white/20 text-black font-bold border border-white/30 px-4 py-2 rounded-md">{getRowLabel(rowIdx)}</th>
                {row.map((cell, colIdx) => (
                  <td
                    key={colIdx}
                    className={`seat-cell ${cell === SEAT_AVAILABLE ? 'available' : cell === SEAT_GOLD ? 'gold' : cell === SEAT_PREMIUM ? 'premium' : 'unavailable'}`}
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