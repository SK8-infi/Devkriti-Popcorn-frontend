import React, { useEffect, useState } from 'react';
import './Theatres.css';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, UserIcon, BuildingIcon, StarIcon, RefreshCwIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Theatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserCity, setCurrentUserCity] = useState(null);
  const navigate = useNavigate();
  const { userCity, cityChangeCounter } = useAppContext();

  // Get user city from context or localStorage
  useEffect(() => {
    const savedCity = localStorage.getItem('userCity');
    setCurrentUserCity(userCity || savedCity);
  }, [userCity]);

  const fetchTheatres = async () => {
    // Only fetch data if we have determined the user city (or lack thereof)
    if (currentUserCity === null) return;
    
    try {
      // Build query params for theatres - only add city if it exists
      const theatreParams = new URLSearchParams();
      if (currentUserCity && currentUserCity.trim() !== '') {
        theatreParams.append('city', currentUserCity);
      }
      const theatreQueryString = theatreParams.toString();
      const theatreUrl = theatreQueryString ? `${API_URL}/api/admin/all-theatres?${theatreQueryString}` : `${API_URL}/api/admin/all-theatres`;
      
      const res = await fetch(theatreUrl);
      const data = await res.json();
      if (data.success) {
        setTheatres(data.theatres);
      } else {
        setError(data.message || 'Failed to fetch theatres');
      }
    } catch (err) {
      setError('Failed to fetch theatres');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, [currentUserCity, cityChangeCounter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTheatres();
  };

  if (loading || currentUserCity === null) return (
    <div className="relative">
      {/* Fixed Background SVG */}
      <div 
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: 'url("/bg-4.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <RefreshCwIcon className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
          <div className="text-white text-xl">
            {currentUserCity === null ? 'Determining your location...' : 'Loading theatres...'}
          </div>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="relative">
      {/* Fixed Background SVG */}
      <div 
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: 'url("/bg-4.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={handleRefresh}
            className="bg-primary text-black px-6 py-2 rounded-lg hover:bg-primary/80 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Fixed Background SVG */}
      <div 
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: 'url("/bg-4.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10 min-h-screen pt-20 py-10 px-4" style={{ backgroundColor: 'transparent' }}>
      <div className="max-w-7xl mx-auto" style={{ backgroundColor: 'transparent' }}>
        <div className="text-center mb-10" style={{ backgroundColor: 'transparent' }}>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Times New Roman, Times, serif', color: '#FFD6A0', backgroundColor: 'transparent' }}>
            THEATRES{currentUserCity ? ` IN ${currentUserCity.toUpperCase()}` : ''}
          </h1>
          <p className="text-gray-300 mb-6">
            Explore our partner theatres and their unique layouts{currentUserCity ? ` in ${currentUserCity}` : ' across cities'}
          </p>
          
          {/* Theatre Count Info */}
          {theatres.length > 0 && (
            <div className="mt-2 text-sm text-gray-400">
              {theatres.length} theatre{theatres.length !== 1 ? 's' : ''} available
            </div>
          )}
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-red-950 transition disabled:opacity-50 flex items-center gap-2 mx-auto mt-4 font-medium"
          >
            <RefreshCwIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Theatres'}
          </button>
        </div>

        {theatres.length === 0 ? (
          <div className="text-center py-20">
            <BuildingIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">
              {currentUserCity ? `No Theatres Found in ${currentUserCity}` : 'No Theatres Found'}
            </h3>
            <p className="text-gray-500">
              {currentUserCity 
                ? `No partner theatres are currently available in ${currentUserCity}.` 
                : 'No partner theatres are currently available.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {theatres.map(theatre => (
              <div 
                key={theatre._id}
                onClick={() => navigate(`/theatres/${encodeURIComponent(theatre.name)}`)}
                className="border border-gray-700 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl"
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {/* Theatre Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                      <BuildingIcon className="w-5 h-5 text-primary" />
                      {theatre.name}
                    </h2>
                    
                    {/* Admin Info */}
                    <div className="flex items-center gap-2 text-sm">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400">Admin:</span>
                      <span className="text-primary font-medium">
                        {theatre.admin?.name || theatre.admin?.slice(0, 8) + '...'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-500">Active</span>
                  </div>
                </div>

                {/* Theatre Details */}
                <div className="space-y-3">
                  {/* Location */}
                  {theatre.city && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span>{theatre.city}</span>
                    </div>
                  )}
                  
                  {/* Theatre Stats */}
                  <div className="flex items-center justify-start pt-3 border-t border-gray-600">
                    <span className="text-xs text-gray-500 bg-black px-2 py-1 rounded">
                      Click to explore
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Theatres; 