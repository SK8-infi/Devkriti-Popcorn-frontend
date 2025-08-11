import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import './Movies.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { FilterIcon, XIcon } from 'lucide-react'
import GlareHover from '../components/GlareHover'
import { useAppContext } from '../context/AppContext'
import ResponsiveGrid from '../components/ResponsiveGrid'
import useResponsive from '../hooks/useResponsive'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResult, setNoResult] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentUserCity, setCurrentUserCity] = useState(null);
  
  const { userCity, cityChangeCounter } = useAppContext();
  const { getResponsiveValue } = useResponsive();
  
  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Get unique genres, languages, and formats from movies
  const getUniqueGenres = () => {
    const genres = new Set();
    movies.forEach(movie => {
      if (movie.genres && Array.isArray(movie.genres)) {
        movie.genres.forEach(genre => genres.add(genre.name));
      }
    });
    return Array.from(genres).sort();
  };

  const getUniqueLanguages = () => {
    const languages = new Set();
    
    movies.forEach(movie => {
      if (movie.spoken_languages && Array.isArray(movie.spoken_languages)) {
        movie.spoken_languages.forEach(lang => {
          languages.add(lang.english_name);
        });
      }
      if (movie.original_language) {
        // Map language codes to names
        const langMap = {
          'en': 'English',
          'hi': 'Hindi',
          'es': 'Spanish',
          'fr': 'French',
          'te': 'Telugu',
          'ta': 'Tamil',
          'ja': 'Japanese',
          'ko': 'Korean',
          'zh': 'Mandarin',
          'de': 'German',
          'ru': 'Russian',
          'nl': 'Dutch',
          'th': 'Thai',
          'id': 'Indonesian',
          'it': 'Italian',
          'vi': 'Vietnamese',
          'be': 'Belarusian',
          'da': 'Danish',
          'pl': 'Polish',
          'sv': 'Swedish',
          'tr': 'Turkish',
          'jv': 'Javanese'
        };
        const langName = langMap[movie.original_language];
        if (langName) {
          languages.add(langName);
        }
      }
    });
    return Array.from(languages).sort();
  };



  const getUniqueRatings = () => {
    // Define rating ranges for filtering
    return [
      { label: '9+ Stars', min: 9, max: 10 },
      { label: '8+ Stars', min: 8, max: 10 },
      { label: '7+ Stars', min: 7, max: 10 },
      { label: '6+ Stars', min: 6, max: 10 },
      { label: '5+ Stars', min: 5, max: 10 }
    ];
  };

  // Filter movies based on selected filters
  const getFilteredMovies = () => {
    return movies.filter(movie => {
      // Search term filter
      if (searchTerm && !movie.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Genre filter
      if (selectedGenres.length > 0) {
        const movieGenres = movie.genres?.map(g => g.name) || [];
        const hasSelectedGenre = selectedGenres.some(genre => 
          movieGenres.includes(genre)
        );
        if (!hasSelectedGenre) return false;
      }

      // Language filter
      if (selectedLanguages.length > 0) {
        const movieLanguages = new Set();
        
        // Add original language
        if (movie.original_language) {
          const langMap = {
            'en': 'English',
            'hi': 'Hindi',
            'es': 'Spanish',
            'fr': 'French',
            'te': 'Telugu',
            'ta': 'Tamil',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Mandarin',
            'de': 'German',
            'ru': 'Russian',
            'nl': 'Dutch',
            'th': 'Thai',
            'id': 'Indonesian',
            'it': 'Italian',
            'vi': 'Vietnamese',
            'be': 'Belarusian',
            'da': 'Danish',
            'pl': 'Polish',
            'sv': 'Swedish',
            'tr': 'Turkish',
            'jv': 'Javanese'
          };
          const langName = langMap[movie.original_language];
          if (langName) {
            movieLanguages.add(langName);
          }
        }
        
        // Add spoken languages
        if (movie.spoken_languages && Array.isArray(movie.spoken_languages)) {
          movie.spoken_languages.forEach(lang => {
            movieLanguages.add(lang.english_name);
          });
        }
        
        const hasSelectedLanguage = selectedLanguages.some(lang => 
          movieLanguages.has(lang)
        );
        if (!hasSelectedLanguage) return false;
      }



      // Rating filter
      if (selectedRatings.length > 0) {
        const movieRating = movie.vote_average || 0;
        const hasSelectedRating = selectedRatings.some(ratingRange => {
          const rating = getUniqueRatings().find(r => r.label === ratingRange);
          return rating && movieRating >= rating.min && movieRating <= rating.max;
        });
        if (!hasSelectedRating) return false;
      }

      return true;
    });
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedLanguages([]);
    setSelectedRatings([]);
    setSearchTerm('');
    setSearchError('');
    setIsSearching(false);
  };

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleLanguage = (language) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };



  const toggleRating = (rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  // Handle search functionality
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchError('Please enter a movie title to search');
      return;
    }

    setSearchError('');
    setIsSearching(true);
    
    // Add a small delay to show loading state
    setTimeout(() => {
      // First search in the current filtered movies (movies with shows)
      let found = movies.find(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
      
      if (found) {
        // Navigate to the movie page
        navigate(`/movies/${found.id || found._id}`);
      } else {
        // If not found in filtered movies, search in all movies to give better feedback
        const foundInAll = allMovies.find(movie => 
          movie.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );
        
        if (foundInAll) {
          // Movie exists but no shows available
          setSearchError(`Movie "${searchTerm}" exists but is not currently showing in your area`);
        } else {
          // Movie doesn't exist at all
          setSearchError(`Movie "${searchTerm}" is not available in our database`);
        }
      }
      setIsSearching(false);
    }, 300);
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get user city from context or localStorage
  useEffect(() => {
    const savedCity = localStorage.getItem('userCity');
    setCurrentUserCity(userCity || savedCity);
  }, [userCity]);

  useEffect(() => {
    // Only fetch data if we have determined the user city (or lack thereof)
    if (currentUserCity === null) return;
    
    // Build query params for shows - only add city if it exists
    const showParams = new URLSearchParams();
    if (currentUserCity && currentUserCity.trim() !== '') {
      showParams.append('city', currentUserCity);
    }
    const showQueryString = showParams.toString();
    const showUrl = showQueryString ? `${API_URL}/api/show/all?${showQueryString}` : `${API_URL}/api/show/all`;
    
    Promise.all([
      fetch(`${API_URL}/api/movies/latest`).then(res => res.json()),
      fetch(showUrl).then(res => res.json())
    ]).then(([moviesData, showsData]) => {
      const now = new Date();
      const futureShowMovieIds = new Set();
      
      // Collect all movie IDs from shows that have future showtimes
      (showsData.shows || []).forEach(show => {
        if (new Date(show.showDateTime) > now && show.movie) {
          // Add both _id and id if they exist
          if (show.movie._id) {
            futureShowMovieIds.add(String(show.movie._id));
          }
          if (show.movie.id) {
            futureShowMovieIds.add(String(show.movie.id));
          }
        }
      });
      
      // Filter movies that have shows - check both id and _id fields
      const filteredMovies = (moviesData.movies || []).filter(movie => {
        const movieId = String(movie.id || '');
        const movieIdAlt = String(movie._id || '');
        return futureShowMovieIds.has(movieId) || futureShowMovieIds.has(movieIdAlt);
      });
      
      setMovies(filteredMovies);
      setAllMovies(moviesData.movies || []);
      setLoading(false);

      // Handle URL parameters
      const params = new URLSearchParams(location.search);
      const search = params.get('search');
      const shouldShowFilters = params.get('showFilters') === 'true';
      
      // Auto-open filters if showFilters param is present
      if (shouldShowFilters) {
        setShowFilters(true);
        // Remove the showFilters param from URL after processing
        const newParams = new URLSearchParams(location.search);
        newParams.delete('showFilters');
        const newUrl = newParams.toString() ? `${location.pathname}?${newParams.toString()}` : location.pathname;
        navigate(newUrl, { replace: true });
      }
      
      // Search logic
      if (search) {
        const found = filteredMovies.find(movie => movie.title.toLowerCase().includes(search.toLowerCase()));
        if (found) {
          navigate(`/movies/${found.id || found._id}`);
        } else {
          setNoResult(true);
        }
      } else {
        setNoResult(false);
        setSearchError(''); // Clear any existing search errors
      }
    }).catch(() => setLoading(false));
  }, [location.search, navigate, currentUserCity, cityChangeCounter]);

  const filteredMovies = getFilteredMovies();
  const uniqueGenres = getUniqueGenres();
  const uniqueLanguages = getUniqueLanguages();

  const responsiveGap = getResponsiveValue({
    xl: '2.5rem',
    lg: '2.5rem',
    md: '2.5rem',
    sm: '2.5rem',
    xs: '2.5rem',
    tiny: '2.5rem',
  });

  return noResult ? (
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
      <div className="relative z-10" style={{ backgroundColor: 'transparent' }}>
        <div className='movies-empty'>
          <h1 className='movies-empty-title'>No shows for this movie.</h1>
        </div>
      </div>
    </div>
  ) : showFilters ? (
    // Show only filters when showFilters is true
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
      <div className="relative z-10" style={{ backgroundColor: 'transparent' }}>
        <div className='movies-container'>
          {/* Filter Section */}
          <div className="filters-section">
            <div className="filters-header">
              <h3 style={{ color: '#ffffff' }}>Search & Filters</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <GlareHover
                  width="auto"
                  height="auto"
                  background="linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)"
                  borderRadius="12px"
                  borderColor="transparent"
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={false}
                  style={{ display: 'inline-block' }}
                >
                  <button 
                    onClick={() => setShowFilters(false)}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      boxShadow: 'none', 
                      pointerEvents: 'auto',
                      color: '#000',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    Back to Movies
                  </button>
                </GlareHover>
              <GlareHover
                width="auto"
                height="auto"
                background="rgba(255, 255, 255, 0.1)"
                borderRadius="12px"
                borderColor="rgba(255, 255, 255, 0.3)"
                glareColor="#ffffff"
                glareOpacity={0.3}
                glareAngle={-30}
                glareSize={300}
                transitionDuration={800}
                playOnce={false}
                style={{ display: 'inline-block' }}
              >
                <button onClick={clearAllFilters} className="clear-filters-btn" style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto', color: '#ffffff' }}>
                  Clear All
                </button>
              </GlareHover>
              </div>
            </div>

            {/* Search */}
            <div className="filter-group">
              <label style={{ color: '#ffffff' }}>Search Movies</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search by movie title..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchError(''); // Clear error when user types
                  }}
                  onKeyPress={handleSearchKeyPress}
                  className="search-input"
                  style={{ paddingRight: '50px' }}
                />
                <GlareHover
                  width="auto"
                  height="auto"
                  background="linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)"
                  borderRadius="8px"
                  borderColor="transparent"
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={false}
                  style={{ 
                    display: 'inline-block',
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}
                >
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      boxShadow: 'none', 
                      pointerEvents: 'auto',
                      color: '#000',
                      padding: '4px 8px',
                      cursor: isSearching ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      opacity: isSearching ? 0.7 : 1
                    }}
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </GlareHover>
              </div>
              {searchError && (
                <div style={{ 
                  color: '#ff6b6b', 
                  fontSize: '0.9rem', 
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 107, 107, 0.3)'
                }}>
                  {searchError}
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="filter-group">
              <label style={{ color: '#ffffff' }}>Genres</label>
              <div className="filter-options">
                {uniqueGenres.map(genre => (
                  <GlareHover
                    key={genre}
                    width="auto"
                    height="auto"
                    background={selectedGenres.includes(genre) ? "linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)" : "#000000"}
                    borderRadius="12px"
                    borderColor={selectedGenres.includes(genre) ? "#FFD6A0" : "rgba(255, 255, 255, 0.3)"}
                    glareColor="#ffffff"
                    glareOpacity={0.3}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={800}
                    playOnce={false}
                    style={{ display: 'inline-block' }}
                  >
                    <button
                      onClick={() => toggleGenre(genre)}
                      className={`filter-option ${selectedGenres.includes(genre) ? 'active' : ''}`}
                      style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto', color: '#ffffff' }}
                    >
                      {genre}
                    </button>
                  </GlareHover>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="filter-group">
              <label style={{ color: '#ffffff' }}>Languages</label>
              <div className="filter-options">
                {uniqueLanguages.map(language => (
                  <GlareHover
                    key={language}
                    width="auto"
                    height="auto"
                    background={selectedLanguages.includes(language) ? "linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)" : "#000000"}
                    borderRadius="12px"
                    borderColor={selectedLanguages.includes(language) ? "#FFD6A0" : "rgba(255, 255, 255, 0.3)"}
                    glareColor="#ffffff"
                    glareOpacity={0.3}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={800}
                    playOnce={false}
                    style={{ display: 'inline-block' }}
                  >
                    <button
                      onClick={() => toggleLanguage(language)}
                      className={`filter-option ${selectedLanguages.includes(language) ? 'active' : ''}`}
                      style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto', color: '#ffffff' }}
                    >
                      {language}
                    </button>
                  </GlareHover>
                ))}
              </div>
            </div>

            {/* Ratings */}
            <div className="filter-group">
              <label style={{ color: '#ffffff' }}>Ratings</label>
              <div className="filter-options">
                {getUniqueRatings().map(rating => (
                  <GlareHover
                    key={rating.label}
                    width="auto"
                    height="auto"
                    background={selectedRatings.includes(rating.label) ? "linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)" : "#000000"}
                    borderRadius="12px"
                    borderColor={selectedRatings.includes(rating.label) ? "#FFD6A0" : "rgba(255, 255, 255, 0.3)"}
                    glareColor="#ffffff"
                    glareOpacity={0.3}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={800}
                    playOnce={false}
                    style={{ display: 'inline-block' }}
                  >
                    <button
                      onClick={() => toggleRating(rating.label)}
                      className={`filter-option ${selectedRatings.includes(rating.label) ? 'active' : ''}`}
                      style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto', color: '#ffffff' }}
                    >
                      {rating.label}
                    </button>
                  </GlareHover>
                ))}
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedGenres.length > 0 || selectedLanguages.length > 0 || selectedRatings.length > 0 || searchTerm) && (
              <div className="active-filters">
                <span style={{ color: '#ffffff' }}>Active Filters:</span>
                {selectedGenres.map(genre => (
                  <GlareHover
                    key={genre}
                    width="auto"
                    height="auto"
                    background="rgba(255, 214, 160, 0.2)"
                    borderRadius="12px"
                    borderColor="rgba(255, 214, 160, 0.3)"
                    glareColor="#ffffff"
                    glareOpacity={0.3}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={800}
                    playOnce={false}
                    style={{ display: 'inline-block' }}
                  >
                    <span className="active-filter-tag" style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#ffffff' }}>
                      {genre} <XIcon size={12} onClick={() => toggleGenre(genre)} />
                    </span>
                  </GlareHover>
                ))}
                {selectedLanguages.map(language => (
                  <GlareHover
                    key={language}
                    width="auto"
                    height="auto"
                    background="rgba(255, 214, 160, 0.2)"
                    borderRadius="12px"
                    borderColor="rgba(255, 214, 160, 0.3)"
                    glareColor="#ffffff"
                    glareOpacity={0.3}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={800}
                    playOnce={false}
                    style={{ display: 'inline-block' }}
                  >
                    <span className="active-filter-tag" style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#ffffff' }}>
                      {language} <XIcon size={12} onClick={() => toggleLanguage(language)} />
                    </span>
                  </GlareHover>
                ))}
                {selectedRatings.map(rating => (
                  <GlareHover
                    key={rating}
                    width="auto"
                    height="auto"
                    background="rgba(255, 214, 160, 0.2)"
                    borderRadius="12px"
                    borderColor="rgba(255, 214, 160, 0.3)"
                    glareColor="#ffffff"
                    glareOpacity={0.3}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={800}
                    playOnce={false}
                    style={{ display: 'inline-block' }}
                  >
                    <span className="active-filter-tag" style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#ffffff' }}>
                      {rating} <XIcon size={12} onClick={() => toggleRating(rating)} />
                    </span>
                  </GlareHover>
                ))}
                {searchTerm && (
                  <GlareHover
                    width="auto"
                    height="auto"
                    background="rgba(255, 214, 160, 0.2)"
                    borderRadius="12px"
                    borderColor="rgba(255, 214, 160, 0.3)"
                    glareColor="#ffffff"
                    glareOpacity={0.3}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={800}
                    playOnce={false}
                    style={{ display: 'inline-block' }}
                  >
                    <span className="active-filter-tag" style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#ffffff' }}>
                      Search: {searchTerm} <XIcon size={12} onClick={() => setSearchTerm('')} />
                    </span>
                  </GlareHover>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : movies.length > 0 ? (
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
      <div className="relative z-10" style={{ backgroundColor: 'transparent' }}>
        <div className='movies-container'>
      <div className="movies-header">
        <h1 className='movies-title' style={{ textAlign: 'left', margin: 0, fontFamily: 'Gotham, Arial, sans-serif', fontSize: '1.6rem', color: '#ffefcb', letterSpacing: '1px', fontWeight: 'bold' }}>
          NOW SHOWING{currentUserCity ? ` IN ${currentUserCity.toUpperCase()}` : ''}
        </h1>
                    <GlareHover
              width="auto"
              height="auto"
              background="linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)"
              borderRadius="12px"
              borderColor="transparent"
              glareColor="#ffffff"
              glareOpacity={0.3}
              glareAngle={-30}
              glareSize={300}
              transitionDuration={800}
              playOnce={false}
              style={{ display: 'inline-block' }}
            >
                      <button 
              onClick={() => setShowFilters(!showFilters)}
              className="filter-toggle-btn"
              style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto' }}
            >
            <FilterIcon size={20} />
            Filters
          </button>
        </GlareHover>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="filters-section">
          <div className="filters-header">
            <h3 style={{ color: '#ffffff' }}>Filters</h3>
            <GlareHover
              width="auto"
              height="auto"
              background="rgba(255, 255, 255, 0.1)"
              borderRadius="12px"
              borderColor="rgba(255, 255, 255, 0.3)"
              glareColor="#ffffff"
              glareOpacity={0.3}
              glareAngle={-30}
              glareSize={300}
              transitionDuration={800}
              playOnce={false}
              style={{ display: 'inline-block' }}
            >
              <button onClick={clearAllFilters} className="clear-filters-btn" style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto', color: '#ffffff' }}>
                Clear All
              </button>
            </GlareHover>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label style={{ color: '#ffffff' }}>Search Movies</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by movie title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchError(''); // Clear error when user types
                }}
                onKeyPress={handleSearchKeyPress}
                className="search-input"
                style={{ paddingRight: '50px' }}
              />
              <GlareHover
                width="auto"
                height="auto"
                background="linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)"
                borderRadius="8px"
                borderColor="transparent"
                glareColor="#ffffff"
                glareOpacity={0.3}
                glareAngle={-30}
                glareSize={300}
                transitionDuration={800}
                playOnce={false}
                style={{ 
                  display: 'inline-block',
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              >
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    boxShadow: 'none', 
                    pointerEvents: 'auto',
                    color: '#000',
                    padding: '4px 8px',
                    cursor: isSearching ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    opacity: isSearching ? 0.7 : 1
                  }}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </GlareHover>
            </div>
            {searchError && (
              <div style={{ 
                color: '#ff6b6b', 
                fontSize: '0.9rem', 
                marginTop: '0.5rem',
                padding: '0.5rem',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 107, 107, 0.3)'
              }}>
                {searchError}
              </div>
            )}
          </div>

          {/* Genres */}
          <div className="filter-group">
            <label style={{ color: '#ffffff' }}>Genres</label>
            <div className="filter-options">
              {uniqueGenres.map(genre => (
                <GlareHover
                  key={genre}
                  width="auto"
                  height="auto"
                  background={selectedGenres.includes(genre) ? "linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)" : "#000000"}
                  borderRadius="12px"
                  borderColor={selectedGenres.includes(genre) ? "#FFD6A0" : "rgba(255, 255, 255, 0.3)"}
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={false}
                  style={{ display: 'inline-block' }}
                >
                  <button
                    onClick={() => toggleGenre(genre)}
                    className={`filter-option ${selectedGenres.includes(genre) ? 'active' : ''}`}
                    style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto', color: '#ffffff' }}
                  >
                    {genre}
                  </button>
                </GlareHover>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="filter-group">
            <label style={{ color: '#ffffff' }}>Languages</label>
            <div className="filter-options">
              {uniqueLanguages.map(language => (
                <GlareHover
                  key={language}
                  width="auto"
                  height="auto"
                  background={selectedLanguages.includes(language) ? "linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)" : "#000000"}
                  borderRadius="12px"
                  borderColor={selectedLanguages.includes(language) ? "#FFD6A0" : "rgba(255, 255, 255, 0.3)"}
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={false}
                  style={{ display: 'inline-block' }}
                >
                  <button
                    onClick={() => toggleLanguage(language)}
                    className={`filter-option ${selectedLanguages.includes(language) ? 'active' : ''}`}
                    style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto', color: '#ffffff' }}
                  >
                    {language}
                  </button>
                </GlareHover>
              ))}
            </div>
          </div>



          {/* Ratings */}
          <div className="filter-group">
            <label style={{ color: '#ffffff' }}>Ratings</label>
            <div className="filter-options">
              {getUniqueRatings().map(rating => (
                <GlareHover
                  key={rating.label}
                  width="auto"
                  height="auto"
                  background={selectedRatings.includes(rating.label) ? "linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)" : "#000000"}
                  borderRadius="12px"
                  borderColor={selectedRatings.includes(rating.label) ? "#FFD6A0" : "rgba(255, 255, 255, 0.3)"}
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={false}
                  style={{ display: 'inline-block' }}
                >
                  <button
                    onClick={() => toggleRating(rating.label)}
                    className={`filter-option ${selectedRatings.includes(rating.label) ? 'active' : ''}`}
                    style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto', color: '#ffffff' }}
                  >
                    {rating.label}
                  </button>
                </GlareHover>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedGenres.length > 0 || selectedLanguages.length > 0 || selectedRatings.length > 0 || searchTerm) && (
            <div className="active-filters">
              <span style={{ color: '#ffffff' }}>Active Filters:</span>
              {selectedGenres.map(genre => (
                <GlareHover
                  key={genre}
                  width="auto"
                  height="auto"
                  background="rgba(255, 214, 160, 0.2)"
                  borderRadius="12px"
                  borderColor="rgba(255, 214, 160, 0.3)"
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={false}
                  style={{ display: 'inline-block' }}
                >
                  <span className="active-filter-tag" style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#ffffff' }}>
                    {genre} <XIcon size={12} onClick={() => toggleGenre(genre)} />
                  </span>
                </GlareHover>
              ))}
              {selectedLanguages.map(language => (
                <GlareHover
                  key={language}
                  width="auto"
                  height="auto"
                  background="rgba(255, 214, 160, 0.2)"
                  borderRadius="12px"
                  borderColor="rgba(255, 214, 160, 0.3)"
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={false}
                  style={{ display: 'inline-block' }}
                >
                  <span className="active-filter-tag" style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#ffffff' }}>
                    {language} <XIcon size={12} onClick={() => toggleLanguage(language)} />
                  </span>
                </GlareHover>
              ))}
              {selectedRatings.map(rating => (
                <GlareHover
                  key={rating}
                  width="auto"
                  height="auto"
                  background="rgba(255, 214, 160, 0.2)"
                  borderRadius="12px"
                  borderColor="rgba(255, 214, 160, 0.3)"
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={false}
                  style={{ display: 'inline-block' }}
                >
                  <span className="active-filter-tag" style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#ffffff' }}>
                    {rating} <XIcon size={12} onClick={() => toggleRating(rating)} />
                  </span>
                </GlareHover>
              ))}
              {searchTerm && (
                <GlareHover
                  width="auto"
                  height="auto"
                  background="rgba(255, 214, 160, 0.2)"
                  borderRadius="12px"
                  borderColor="rgba(255, 214, 160, 0.3)"
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={false}
                  style={{ display: 'inline-block' }}
                >
                  <span className="active-filter-tag" style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#ffffff' }}>
                    Search: {searchTerm} <XIcon size={12} onClick={() => setSearchTerm('')} />
                  </span>
                </GlareHover>
              )}
            </div>
          )}
        </div>
      )}

      <ResponsiveGrid
        columns={{
          default: 4,
          lg: 4,
          md: 3,
          sm: 2,
          xs: 2,
          tiny: 2
        }}
        gap={responsiveGap}
      >
        {filteredMovies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} variant="home"/>
        ))}
      </ResponsiveGrid>

      {filteredMovies.length === 0 && !loading && (
        <div className="no-results">
          <h3>No movies match your filters</h3>
          <p>Try adjusting your search criteria or clear all filters</p>
        </div>
      )}
        </div>
      </div>
    </div>
  ) : loading ? (
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
      <div className="relative z-10" style={{ backgroundColor: 'transparent' }}>
        <div className='movies-empty'>
          <h1 className='movies-empty-title'>Loading movies...</h1>
        </div>
      </div>
    </div>
  ) : null;
}

export default Movies
