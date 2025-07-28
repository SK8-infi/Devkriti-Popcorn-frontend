import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import './Movies.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { FilterIcon, XIcon } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResult, setNoResult] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Get unique genres, languages, and formats from movies
  const getUniqueGenres = () => {
    const genres = new Set();
    allMovies.forEach(movie => {
      if (movie.genres && Array.isArray(movie.genres)) {
        movie.genres.forEach(genre => genres.add(genre.name));
      }
    });
    return Array.from(genres).sort();
  };

  const getUniqueLanguages = () => {
    const languages = new Set();
    
    allMovies.forEach(movie => {
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

  const getUniqueFormats = () => {
    // For now, we'll use common movie formats
    // In a real app, this would come from the backend based on available show formats
    return ['2D', '3D', 'IMAX', '4DX', 'Dolby Atmos'];
  };

  // Filter movies based on selected filters
  const getFilteredMovies = () => {
    return allMovies.filter(movie => {
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

      // Format filter - for now, we'll show all movies as they might have different formats
      // In a real implementation, this would check against available show formats
      if (selectedFormats.length > 0) {
        // For demo purposes, we'll assume all movies have all formats
        // In reality, this would check the actual show formats available
        return true;
      }

      return true;
    });
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedLanguages([]);
    setSelectedFormats([]);
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

  const toggleFormat = (format) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    );
  };

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/movies/latest`).then(res => res.json()),
      fetch(`${API_URL}/api/show/all`).then(res => res.json())
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
  }, [location.search, navigate]);

  const filteredMovies = getFilteredMovies();
  const uniqueGenres = getUniqueGenres();
  const uniqueLanguages = getUniqueLanguages();
  const uniqueFormats = getUniqueFormats();

  return noResult ? (
    <div className='movies-empty'>
      <h1 className='movies-empty-title'>No shows for this movie.</h1>
    </div>
  ) : movies.length > 0 ? (
    <div className='movies-container'>
      <div className="movies-header">
        <h1 className='movies-title'>Now Showing</h1>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle-btn"
        >
          <FilterIcon size={20} />
          Filters
        </button>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="filters-section">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={clearAllFilters} className="clear-filters-btn">
              Clear All
            </button>
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
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`filter-option ${selectedGenres.includes(genre) ? 'active' : ''}`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="filter-group">
            <label>Languages</label>
            <div className="filter-options">
              {uniqueLanguages.map(language => (
                <button
                  key={language}
                  onClick={() => toggleLanguage(language)}
                  className={`filter-option ${selectedLanguages.includes(language) ? 'active' : ''}`}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          {/* Formats */}
          <div className="filter-group">
            <label>Formats</label>
            <div className="filter-options">
              {uniqueFormats.map(format => (
                <button
                  key={format}
                  onClick={() => toggleFormat(format)}
                  className={`filter-option ${selectedFormats.includes(format) ? 'active' : ''}`}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedGenres.length > 0 || selectedLanguages.length > 0 || selectedFormats.length > 0 || searchTerm) && (
            <div className="active-filters">
              <span>Active Filters:</span>
              {selectedGenres.map(genre => (
                <span key={genre} className="active-filter-tag">
                  {genre} <XIcon size={12} onClick={() => toggleGenre(genre)} />
                </span>
              ))}
              {selectedLanguages.map(language => (
                <span key={language} className="active-filter-tag">
                  {language} <XIcon size={12} onClick={() => toggleLanguage(language)} />
                </span>
              ))}
              {selectedFormats.map(format => (
                <span key={format} className="active-filter-tag">
                  {format} <XIcon size={12} onClick={() => toggleFormat(format)} />
                </span>
              ))}
              {searchTerm && (
                <span className="active-filter-tag">
                  Search: {searchTerm} <XIcon size={12} onClick={() => setSearchTerm('')} />
                </span>
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
