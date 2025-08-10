import React, { useState, useEffect } from 'react';
import { Star, Calendar, Filter, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const MovieReviews = ({ movieId }) => {
  const { user, isAuthenticated } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchReviews();
  }, [movieId, page, sortBy]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/movie-reviews/movie/${movieId}?page=${page}&limit=5&sort=${sortBy}`
      );
      const data = await response.json();
      
      if (data.success) {
        if (page === 1) {
          setReviews(data.reviews);
        } else {
          setReviews(prev => [...prev, ...data.reviews]);
        }
        setHasMore(data.pagination.hasMore);
      }
    } catch (error) {
      console.error('Error fetching movie reviews:', error);
    } finally {
      setLoading(false);
    }
  };



  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (loading && page === 1) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <div className="text-gray-400">Loading reviews...</div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No reviews yet</h3>
        <p className="text-gray-400">Be the first to share your thoughts about this movie!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-white" style={{fontFamily: 'Times New Roman, Times, serif'}}>
            Community Reviews
          </h3>
          <p className="text-gray-400 text-sm mt-1">{reviews.length} reviews from movie lovers</p>
        </div>
        
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="appearance-none bg-gray-900/50 border border-gray-700 text-white px-4 py-2 pr-10 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 text-sm transition-all duration-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating">Highest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review._id} className="bg-black/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">
                    {review.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">{review.user.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar size={14} />
                    {new Date(review.watchDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={18}
                      className={star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}
                    />
                  ))}
                </div>
                <span className="text-white font-semibold text-lg">{review.rating}</span>
              </div>
            </div>
            
            {/* Review Content */}
            <div className="mb-4">
              <h5 className="text-xl font-bold text-white mb-3" style={{fontFamily: 'Times New Roman, Times, serif'}}>
                {review.title}
              </h5>
              <p className="text-gray-300 leading-relaxed text-base">{review.content}</p>
            </div>
            
            {/* Pros and Cons */}
            {(review.pros.length > 0 || review.cons.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {review.pros.length > 0 && (
                  <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-xl">
                    <h6 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      What they liked
                    </h6>
                    <ul className="space-y-1">
                      {review.pros.map((pro, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                          <span className="text-green-400">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {review.cons.length > 0 && (
                  <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                    <h6 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      What could be better
                    </h6>
                    <ul className="space-y-1">
                      {review.cons.map((con, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                          <span className="text-red-400">•</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Review Footer */}
            <div className="flex items-center justify-end pt-4 border-t border-gray-800/50">
              <span className="text-xs text-gray-500">
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={loadMore}
            className="bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 border border-gray-600/50"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieReviews;
