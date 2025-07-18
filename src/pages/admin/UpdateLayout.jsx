import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Title from '../../components/admin/Title';
import Loading from '../../components/Loading';
import toast from 'react-hot-toast';
import './UpdateLayout.css';

const SEAT_AVAILABLE = 1;
const SEAT_UNAVAILABLE = 0;
const SEAT_VIP = 2;

const cellClass = (val) => {
  if (val === SEAT_AVAILABLE) return 'bg-green-500 hover:bg-green-600';
  if (val === SEAT_VIP) return 'bg-yellow-400 hover:bg-yellow-500';
  return 'bg-gray-300 hover:bg-gray-400';
};

const cellLabel = (val) => {
  if (val === SEAT_AVAILABLE) return '';
  if (val === SEAT_VIP) return '';
  return '';
};

// Helper to get row label (A, B, C, ...)
const getRowLabel = (idx) => String.fromCharCode(65 + idx);

const UpdateLayout = () => {
  const { axios, getToken } = useAppContext();
  const [layout, setLayout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedType, setSelectedType] = useState(SEAT_AVAILABLE);
  const [isDragging, setIsDragging] = useState(false); // NEW

  // Handle global mouse up to stop dragging
  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Fetch current layout
  useEffect(() => {
    const fetchLayout = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/admin/my-theatre', {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });
        if (data.success && data.theatre) {
          setLayout(data.theatre.layout);
        } else {
          toast.error(data.message || 'Failed to fetch layout');
        }
      } catch (e) {
        toast.error('Error fetching layout');
      }
      setLoading(false);
    };
    fetchLayout();
  }, [axios, getToken]);

  // Set seat type (single cell)
  const setSeatType = (rowIdx, colIdx) => {
    setLayout((prev) =>
      prev.map((row, r) =>
        r === rowIdx
          ? row.map((cell, c) => (c === colIdx ? selectedType : cell))
          : row
      )
    );
  };

  // Drag paint seat type (multiple cells)
  const handleCellMouseDown = (rowIdx, colIdx) => {
    setIsDragging(true);
    setSeatType(rowIdx, colIdx);
  };
  const handleCellMouseEnter = (rowIdx, colIdx) => {
    if (isDragging) setSeatType(rowIdx, colIdx);
  };

  // Add/remove rows/columns
  const addRow = () => setLayout((prev) => [...prev, Array(prev[0].length).fill(SEAT_AVAILABLE)]);
  const removeRow = () => setLayout((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  const addCol = () => setLayout((prev) => prev.map((row) => [...row, SEAT_AVAILABLE]));
  const removeCol = () => setLayout((prev) => (prev[0].length > 1 ? prev.map((row) => row.slice(0, -1)) : prev));

  // Save layout
  const saveLayout = async () => {
    setSaving(true);
    try {
      const { data } = await axios.post(
        '/api/admin/my-theatre/layout',
        { layout },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success('Layout saved!');
      } else {
        toast.error(data.message || 'Failed to save layout');
      }
    } catch (e) {
      toast.error('Error saving layout');
    }
    setSaving(false);
  };

  if (loading || !layout) return <Loading />;

  return (
    <div className="layout-container bg-white/20 border border-white/30 rounded-2xl shadow-lg p-0 backdrop-blur-md animate-fade-in-up">
      {/* Removed section title, now handled by navbar */}
      <div className="seat-type-selector flex justify-center">
        <span>Select Seat Type:</span>
        <button
          className={`seat-btn ${selectedType === SEAT_AVAILABLE ? 'active available' : ''}`}
          onClick={() => setSelectedType(SEAT_AVAILABLE)}
        >
          Regular
        </button>
        <button
          className={`seat-btn ${selectedType === SEAT_VIP ? 'active vip' : ''}`}
          onClick={() => setSelectedType(SEAT_VIP)}
        >
          VIP
        </button>
        <button
          className={`seat-btn ${selectedType === SEAT_UNAVAILABLE ? 'active unavailable' : ''}`}
          onClick={() => setSelectedType(SEAT_UNAVAILABLE)}
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
        <button onClick={addRow} className="control-btn add">+ Row</button>
        <button onClick={removeRow} className="control-btn remove">- Row</button>
        <button onClick={addCol} className="control-btn add">+ Col</button>
        <button onClick={removeCol} className="control-btn remove">- Col</button>
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
                    onMouseDown={() => handleCellMouseDown(rowIdx, colIdx)}
                    onMouseEnter={() => handleCellMouseEnter(rowIdx, colIdx)}
                    // onClick={() => setSeatType(rowIdx, colIdx)} // replaced by drag logic
                    title={`Row ${getRowLabel(rowIdx)}, Seat ${colIdx + 1}`}
                  >
                    {`${getRowLabel(rowIdx)}${colIdx + 1}`}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-8">
      <button
        onClick={saveLayout}
          className="px-8 py-3 bg-white text-black rounded-xl font-semibold shadow-md backdrop-blur-md transition-all duration-200 hover:bg-gray-100 hover:text-primary focus:outline-none border-none"
          style={{ border: 'none' }}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Layout'}
      </button>
      </div>
    </div>
  );
};

export default UpdateLayout; 