import React, { useState, useEffect } from 'react';
import { XIcon, MapPin } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const allowedCities = ["Delhi", "Mumbai", "Gwalior", "Indore", "Pune", "Chennai"];
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CitySelectionModal = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, setUserCity: setContextUserCity } = useAppContext();
  const [selectedCity, setSelectedCity] = useState("");
  const [savingCity, setSavingCity] = useState(false);
  const [cityError, setCityError] = useState("");

  // Handle city save
  const handleSaveCity = async () => {
    if (!selectedCity) {
      setCityError("Please select a city.");
      return;
    }

    setSavingCity(true);
    setCityError("");

    try {
      if (!isAuthenticated) {
        // Non-authenticated user: store in localStorage and send to public API
        localStorage.setItem('userCity', selectedCity);
        setContextUserCity(selectedCity);

        try {
          await fetch(`${API_URL}/api/user/city/public`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ city: selectedCity }),
          });
        } catch (error) {
          // Backend failed — we already saved locally
          console.error('Error saving city to backend:', error);
        }

        onClose();
      } else {
        // Authenticated user: update via secured API
        const response = await fetch(`${API_URL}/api/user/city`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({ city: selectedCity }),
        });

        const data = await response.json();

        if (data.success) {
          setContextUserCity(selectedCity);
          localStorage.setItem('userCity', selectedCity);
          onClose();
        } else {
          setCityError(data.message || "Failed to update city.");
        }
      }
    } catch (error) {
      setCityError("Failed to update city.");
      console.error('Error saving city:', error);
    } finally {
      setSavingCity(false);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        // Don't allow closing with escape key for forced city selection
        e.preventDefault();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="city-selection-modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div
        className="city-selection-modal"
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          backgroundImage: 'url("/bg-4.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '32px',
          minWidth: '350px',
          maxWidth: '420px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
          position: 'relative',
          border: '1px solid rgba(255, 214, 160, 0.3)',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          gap: '8px', 
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <MapPin size={28} color="#000" />
          </div>
          <div>
            <h2 style={{ 
              margin: 0, 
              color: '#F9FAFB', 
              fontSize: '24px', 
              fontWeight: '700',
              fontFamily: 'Times New Roman, Times, serif',
              marginBottom: '8px'
            }}>Welcome to Devkriti Popcorn!</h2>
            <p style={{
              margin: 0,
              color: '#9CA3AF',
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '1.5'
            }}>Please select your city to find nearby movie shows and theatres</p>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            color: '#F3F4F6',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '8px'
          }}>Select Your City</label>
          <select 
            value={selectedCity} 
            onChange={e => { setSelectedCity(e.target.value); setCityError(""); }} 
            style={{ 
              width: '100%', 
              padding: '14px 16px', 
              borderRadius: '12px', 
              border: '1px solid rgba(75, 85, 99, 0.6)', 
              fontSize: '16px', 
              background: '#000000', 
              color: '#F9FAFB',
              outline: 'none',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#FFD6A0';
              e.target.style.boxShadow = '0 0 0 3px rgba(255, 214, 160, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(75, 85, 99, 0.6)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <option value="" style={{ background: '#1F2937', color: '#9CA3AF' }}>Choose your city...</option>
            {allowedCities.map(city => (
              <option key={city} value={city} style={{ background: '#1F2937', color: '#F9FAFB', padding: '8px' }}>{city}</option>
            ))}
          </select>
        </div>

        {cityError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px',
            color: '#EF4444',
            fontSize: '14px'
          }}>
            {cityError}
          </div>
        )}

        <button
          onClick={handleSaveCity}
          disabled={!selectedCity || savingCity}
          style={{
            width: '100%',
            padding: '14px 24px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '600',
            cursor: selectedCity && !savingCity ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            background: selectedCity && !savingCity 
              ? 'linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)' 
              : 'rgba(75, 85, 99, 0.5)',
            color: selectedCity && !savingCity ? '#000' : '#6B7280',
            boxShadow: selectedCity && !savingCity 
              ? '0 4px 12px rgba(255, 214, 160, 0.3)' 
              : 'none'
          }}
          onMouseEnter={(e) => {
            if (selectedCity && !savingCity) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(255, 214, 160, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedCity && !savingCity) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(255, 214, 160, 0.3)';
            }
          }}
        >
          {savingCity ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(0, 0, 0, 0.3)',
                borderTop: '2px solid #000',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              Setting up your location...
            </div>
          ) : (
            'Continue to Explore Movies'
          )}
        </button>

        <div style={{
          marginTop: '16px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#6B7280',
          lineHeight: '1.4'
        }}>
          <p>You can change your city anytime from the location button in the navigation bar.</p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CitySelectionModal;
