import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const TheatreSettingsModal = ({ isOpen, onClose }) => {
  const { theatre, theatreCity, theatreAddress, setAdminTheatre } = useAppContext();
  const [theatreInput, setTheatreInput] = useState(theatre || "");
  const [cityInput, setCityInput] = useState(theatreCity || "");
  const [addressInput, setAddressInput] = useState(theatreAddress || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Update form values when theatre data changes
  useEffect(() => {
    setTheatreInput(theatre || "");
    setCityInput(theatreCity || "");
    setAddressInput(theatreAddress || "");
  }, [theatre, theatreCity, theatreAddress]);

  const handleSave = async () => {
    setSubmitting(true);
    setError("");
    
    try {
      const theatreName = theatreInput.trim();
      const cityName = cityInput;
      const addressName = addressInput.trim();
      
      if (!theatreName) {
        setError("Theatre name is required");
        setSubmitting(false);
        return;
      }
      
      if (!cityName) {
        setError("City is required");
        setSubmitting(false);
        return;
      }
      

      
      const res = await setAdminTheatre(theatreName, cityName, addressName);
      
      if (res.success) {
        toast.success('Theatre settings updated successfully!');
        onClose();
      } else {
        setError(res.message || "Failed to update theatre settings");
      }
    } catch (error) {
      console.error('Theatre settings error:', error);
      setError("Failed to update theatre settings");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = () => {
    return theatreInput.trim() && cityInput;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center relative border-2 border-primary">
        <h2 className="text-2xl font-bold mb-2 text-black">Theatre Settings</h2>
        <p className="mb-4 text-black text-center">
          Update your theatre information below.
        </p>
        
        <div className="w-full space-y-3">
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Theatre Name *</label>
            <input
              className="border border-primary/40 p-3 rounded w-full text-lg bg-primary/5 text-black"
              type="text"
              placeholder="Enter theatre name"
              value={theatreInput}
              onChange={e => setTheatreInput(e.target.value)}
              disabled={submitting}
              autoFocus
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-black mb-1">City *</label>
            <select
              className="border border-primary/40 p-3 rounded w-full text-lg bg-primary/5 text-black"
              value={cityInput}
              onChange={e => setCityInput(e.target.value)}
              disabled={submitting}
            >
              <option value="">Select City</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Gwalior">Gwalior</option>
              <option value="Indore">Indore</option>
              <option value="Pune">Pune</option>
              <option value="Chennai">Chennai</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-black mb-1">Address</label>
            <textarea
              className="border border-primary/40 p-3 rounded w-full text-lg bg-primary/5 text-black resize-none"
              placeholder="Enter theatre address (optional)"
              value={addressInput}
              onChange={e => setAddressInput(e.target.value)}
              disabled={submitting}
              rows={3}
            />
          </div>
        </div>
        
        {error && <p className="text-red-500 text-sm mb-2 mt-2">{error}</p>}
        
        <div className="flex gap-3 w-full mt-4">
          <button
                          className="bg-gray-300 text-black px-6 py-2 rounded-lg flex-1 font-semibold text-lg hover:bg-red-200 transition"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            className="bg-primary text-white px-6 py-2 rounded-lg flex-1 font-semibold text-lg hover:bg-primary/90 transition disabled:opacity-60 shadow"
            onClick={handleSave}
            disabled={!isFormValid() || submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TheatreSettingsModal; 