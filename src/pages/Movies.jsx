import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import './Movies.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { FilterIcon, XIcon } from 'lucide-react'
import GlareHover from '../components/GlareHover'
import { useAppContext } from '../context/AppContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResult, setNoResult] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentUserCity, setCurrentUserCity] = useState(null);
  
  const { userCity, cityChangeCounter } = useAppContext();
  
  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
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
      const futureShowMovieIds = new Set(
        (showsData.shows || [])
          .filter(show => new Date(show.showDateTime) > now)
          .map(show => show.movie && String(show.movie._id))
      );
      const filteredMovies = (moviesData.movies || []).filter(movie => futureShowMovieIds.has(String(movie.id)));
      setMovies(filteredMovies);
      setAllMovies(moviesData.movies || []);
      setLoading(false);

      // Search logic
      const params = new URLSearchParams(location.search);
      const search = params.get('search');
      if (search) {
        const found = filteredMovies.find(movie => movie.title.toLowerCase().includes(search.toLowerCase()));
        if (found) {
          navigate(`/movies/${found.id || found._id}`);
        } else {
          setNoResult(true);
        }
      } else {
        setNoResult(false);
      }
    }).catch(() => setLoading(false));
  }, [location.search, navigate, currentUserCity, cityChangeCounter]);

  const filteredMovies = getFilteredMovies();
  const uniqueGenres = getUniqueGenres();
  const uniqueLanguages = getUniqueLanguages();

  return noResult ? (
    <div className='movies-empty'>
      <h1 className='movies-empty-title'>No shows for this movie.</h1>
    </div>
  ) : movies.length > 0 ? (
    <div className='movies-container'>
      <div className="movies-header">
        <h1 className='movies-title' style={{ textAlign: 'left', margin: 0, fontFamily: 'Gotham, Arial, sans-serif', fontSize: '1.6rem', color: '#ffefcb', letterSpacing: '1px', fontWeight: 'bold' }}>NOW SHOWING</h1>
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
            <h3>Filters</h3>
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
              <button onClick={clearAllFilters} className="clear-filters-btn" style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto' }}>
                Clear All
              </button>
            </GlareHover>
          </div>

          {/* Search */}
          <div className="filter-group">
            <label>Search Movies</label>
            <input
              type="text"
              placeholder="Search by movie title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Genres */}
          <div className="filter-group">
            <label>Genres</label>
            <div className="filter-options">
              {uniqueGenres.map(genre => (
                <GlareHover
                  key={genre}
                  width="auto"
                  height="auto"
                  background={selectedGenres.includes(genre) ? "linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)" : "rgba(255, 255, 255, 0.1)"}
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
                    style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto' }}
                  >
                    {genre}
                  </button>
                </GlareHover>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="filter-group">
            <label>Languages</label>
            <div className="filter-options">
              {uniqueLanguages.map(language => (
                <GlareHover
                  key={language}
                  width="auto"
                  height="auto"
                  background={selectedLanguages.includes(language) ? "linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)" : "rgba(255, 255, 255, 0.1)"}
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
                    style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto' }}
                  >
                    {language}
                  </button>
                </GlareHover>
              ))}
            </div>
          </div>



          {/* Ratings */}
          <div className="filter-group">
            <label>Ratings</label>
            <div className="filter-options">
              {getUniqueRatings().map(rating => (
                <GlareHover
                  key={rating.label}
                  width="auto"
                  height="auto"
                  background={selectedRatings.includes(rating.label) ? "linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)" : "rgba(255, 255, 255, 0.1)"}
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
                    style={{ background: 'transparent', border: 'none', boxShadow: 'none', pointerEvents: 'auto' }}
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
              <span>Active Filters:</span>
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
                  <span className="active-filter-tag" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
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
                  <span className="active-filter-tag" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
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
                  <span className="active-filter-tag" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
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
                  <span className="active-filter-tag" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                    Search: {searchTerm} <XIcon size={12} onClick={() => setSearchTerm('')} />
                  </span>
                </GlareHover>
              )}
            </div>
          )}
        </div>
      )}

      <div className='movies-list'>
        {filteredMovies.map((movie) => (
          <MovieCard movie={movie} key={movie.id}/>
        ))}
      </div>

      {filteredMovies.length === 0 && !loading && (
        <div className="no-results">
          <h3>No movies match your filters</h3>
          <p>Try adjusting your search criteria or clear all filters</p>
        </div>
      )}
    </div>
  ) : loading ? (
    <div className='movies-empty'>
      <h1 className='movies-empty-title'>Loading movies...</h1>
    </div>
  ) : null;
}

export default Movies
