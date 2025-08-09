import React, { useEffect, useState } from 'react';
import './Theatres.css';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, UserIcon, BuildingIcon, StarIcon, RefreshCwIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Theatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchTheatres = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/all-theatres`);
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
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTheatres();
  };

  if (loading) return (
    <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
      <div className="text-center">
        <RefreshCwIcon className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
        <div className="text-white text-xl">Loading theatres...</div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
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
  );

  return (
    <div className="min-h-screen bg-black pt-20 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Times New Roman, Times, serif', color: '#FFD6A0' }}>
            My Theatres
          </h1>
          <p className="text-gray-300 mb-6">
            Explore our partner theatres and their unique layouts across cities
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
            className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 flex items-center gap-2 mx-auto mt-4 font-medium"
          >
            <RefreshCwIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Theatres'}
          </button>
        </div>

        {theatres.length === 0 ? (
          <div className="text-center py-20">
            <BuildingIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl text-gray-400 mb-2">No Theatres Found</h3>
            <p className="text-gray-500">No partner theatres are currently available.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {theatres.map(theatre => (
              <div 
                key={theatre._id}
                onClick={() => navigate(`/theatres/${encodeURIComponent(theatre.name)}`)}
                className="border border-gray-700 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
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
  );
};

export default Theatres; 