import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, MapPin, Calendar, Star, Film, Ticket, IndianRupee } from 'lucide-react';

const TheatreAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchTheatreAnalytics();
  }, [selectedPeriod]);

  const fetchTheatreAnalytics = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/admin/theatre-analytics?period=${selectedPeriod}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching theatre analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const safeAmount = Number(amount) || 0;
    return `₹${safeAmount.toLocaleString()}`;
  };

  const getOccupancyColor = (rate) => {
    const safeRate = Number(rate) || 0;
    if (safeRate >= 80) return 'text-green-400';
    if (safeRate >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRevenueColor = (trend) => {
    const safeTrend = Number(trend) || 0;
    if (safeTrend > 0) return 'text-green-400';
    if (safeTrend < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-white">Loading theatre analytics...</div>
      </div>
    );
  }

  if (analytics.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No theatre data found. You need to own theatres to view analytics.
      </div>
    );
  }

  return (
    <div className="theatre-analytics text-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 size={24} className="text-yellow-400" />
          Theatre Analytics
        </h2>
        
        {/* Period Selector */}
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
        >
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
          <option value="quarter">Last Quarter</option>
          <option value="year">Last Year</option>
        </select>
      </div>

      <div className="space-y-8">
        {analytics.map((theatreData) => (
          <div key={theatreData.theatre._id} className="theatre-analytics-card bg-gray-900 p-6 rounded-lg border border-gray-700">
            {/* Theatre Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">{theatreData.theatre.name}</h3>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <MapPin size={14} />
                  {theatreData.theatre.city}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Overall Rating</div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="text-lg font-bold">{theatreData.theatre.averageRating ? theatreData.theatre.averageRating.toFixed(1) : 'N/A'}</span>
                  <span className="text-sm text-gray-400">({theatreData.theatre.reviewCount || 0} reviews)</span>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Revenue */}
              <div className="metric-card bg-gray-800 p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee size={16} className="text-green-400" />
                  <span className="text-sm text-gray-400">Total Revenue</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(theatreData.revenue?.total || 0)}
                </div>
                <div className={`text-xs ${getRevenueColor(theatreData.revenue?.trend || 0)}`}>
                  {(theatreData.revenue?.trend || 0) > 0 ? '+' : ''}{(theatreData.revenue?.trend || 0).toFixed(1)}% vs previous period
                </div>
              </div>

              {/* Bookings */}
              <div className="metric-card bg-gray-800 p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Ticket size={16} className="text-blue-400" />
                  <span className="text-sm text-gray-400">Total Bookings</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {(theatreData.bookings?.total || 0).toLocaleString()}
                </div>
                <div className={`text-xs ${getRevenueColor(theatreData.bookings?.trend || 0)}`}>
                  {(theatreData.bookings?.trend || 0) > 0 ? '+' : ''}{(theatreData.bookings?.trend || 0).toFixed(1)}% vs previous period
                </div>
              </div>

              {/* Occupancy Rate */}
              <div className="metric-card bg-gray-800 p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={16} className="text-purple-400" />
                  <span className="text-sm text-gray-400">Avg Occupancy</span>
                </div>
                <div className={`text-2xl font-bold ${getOccupancyColor(theatreData.occupancy?.average || 0)}`}>
                  {(theatreData.occupancy?.average || 0).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">
                  Peak: {(theatreData.occupancy?.peak || 0).toFixed(1)}%
                </div>
              </div>

              {/* Shows Count */}
              <div className="metric-card bg-gray-800 p-4 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Film size={16} className="text-orange-400" />
                  <span className="text-sm text-gray-400">Active Shows</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {theatreData.shows?.active || 0}
                </div>
                <div className="text-xs text-gray-400">
                  Total: {theatreData.shows?.total || 0}
                </div>
              </div>
            </div>

            {/* Popular Movies */}
            {theatreData.popularMovies && theatreData.popularMovies.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-400" />
                  Top Performing Movies
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {theatreData.popularMovies.slice(0, 3).map((movie, index) => (
                    <div key={movie._id} className="movie-card bg-gray-800 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400 font-bold">#{index + 1}</span>
                        <span className="font-semibold truncate">{movie.title}</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Bookings:</span>
                          <span className="text-white">{movie.bookings || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Revenue:</span>
                          <span className="text-green-400">{formatCurrency(movie.revenue || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Avg Occupancy:</span>
                          <span className={getOccupancyColor(movie.occupancy || 0)}>{(movie.occupancy || 0).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time-based Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Peak Hours */}
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar size={18} className="text-blue-400" />
                  Peak Hours
                </h4>
                <div className="space-y-2">
                  {(theatreData.peakHours && theatreData.peakHours.length > 0) ? (
                    theatreData.peakHours.map((hour, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                        <span className="text-sm">{hour.time || 'N/A'}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-400 h-2 rounded-full"
                              style={{ width: `${theatreData.peakHours[0] ? ((hour.bookings || 0) / (theatreData.peakHours[0].bookings || 1)) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400 w-8">{hour.bookings || 0}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-400 text-sm">
                      No peak hours data available
                    </div>
                  )}
                </div>
              </div>

              {/* Room Performance */}
              <div>
                <h4 className="text-lg font-semibold mb-3">Room Performance</h4>
                <div className="space-y-2">
                  {(theatreData.roomPerformance && theatreData.roomPerformance.length > 0) ? (
                    theatreData.roomPerformance.map((room, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                        <div>
                          <span className="text-sm font-medium">{room.name || 'Unknown Room'}</span>
                          <span className="text-xs text-gray-400 ml-2">({room.type || 'Standard'})</span>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${getOccupancyColor(room.occupancy || 0)}`}>
                            {(room.occupancy || 0).toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatCurrency(room.revenue || 0)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-400 text-sm">
                      No room performance data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheatreAnalytics;