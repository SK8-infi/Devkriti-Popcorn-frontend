import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { useAppContext } from '../context/AppContext';
import { ChevronDown, Calendar, Clock, MapPin, Star } from 'lucide-react';
import './SelectShowtime.css';

const TAG_COLORS = [
  { bg: '#E3F2FD', text: '#1976D2' },
  { bg: '#E8F5E8', text: '#2E7D32' },
  { bg: '#F3E5F5', text: '#7B1FA2' },
  { bg: '#FCE4EC', text: '#C2185B' },
  { bg: '#FFF3E0', text: '#F57C00' },
  { bg: '#F5F5F5', text: '#424242' },
];

const SelectShowtime = () => {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);

  const { axios, image_base_url, userCity, cityChangeCounter } = useAppContext();
  const navigate = useNavigate();
  const [currentUserCity, setCurrentUserCity] = useState(null);

  // Monitor filter changes
  useEffect(() => {
    // Filter state changed
  }, [selectedLanguage, selectedFormat, selectedDate]);

  // Handle clicking outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLanguageDropdown || showFormatDropdown) {
        const dropdowns = document.querySelectorAll('.dropdown-container');
        let clickedInside = false;
        
        dropdowns.forEach(dropdown => {
          if (dropdown.contains(event.target)) {
            clickedInside = true;
          }
        });
        
        if (!clickedInside) {
          setShowLanguageDropdown(false);
          setShowFormatDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLanguageDropdown, showFormatDropdown]);

  // Get user city from context or localStorage
  useEffect(() => {
    const savedCity = localStorage.getItem('userCity');
    setCurrentUserCity(userCity || savedCity);
  }, [userCity]);

  useEffect(() => {
    // Only fetch data if we have determined the user city (or lack thereof)
    if (currentUserCity === null) return;
    
    const getShow = async () => {
      try {
        // Build query params for show - only add city if it exists
        const showParams = new URLSearchParams();
        if (currentUserCity && currentUserCity.trim() !== '') {
          showParams.append('city', currentUserCity);
        }
        const showQueryString = showParams.toString();
        const showUrl = showQueryString ? `/api/show/${id}?${showQueryString}` : `/api/show/${id}`;
        
        const [{ data: showData }, { data: movieData }] = await Promise.all([
          axios.get(showUrl),
          axios.get(`/api/movies/${id}`)
        ]);
        if (showData.success && movieData.movie) {
          setShow(showData);
          setMovie(movieData.movie);
          setError(null);
          // Set default selected date
          const dates = Object.keys(showData.dateTime || {})
            .filter(date => (showData.dateTime[date] && showData.dateTime[date].length > 0))
            .sort((a, b) => new Date(a) - new Date(b));
          if (dates.length > 0) setSelectedDate(dates[0]);
        } else {
          setError('Movie not found.');
        }
      } catch (error) {
        setError('Failed to load movie details.');
      }
    };
    getShow();
  }, [id, axios, currentUserCity, cityChangeCounter]);

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2 className="error-title">{error}</h2>
          <button onClick={() => window.location.reload()} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  if (!show || !movie) return <Loading />;

  // Prepare tags
  const tags = [
    ...(Array.isArray(movie.genres) ? movie.genres.map(g => typeof g === 'string' ? g : g.name) : []),
    ...(movie.keywords ? movie.keywords : []),
  ];

  // Prepare date list: only show dates with available showtimes, sorted ascending
  const dateList = Object.keys(show.dateTime || {})
    .filter(date => (show.dateTime[date] && show.dateTime[date].length > 0))
    .sort((a, b) => new Date(a) - new Date(b));

  // Collect all unique languages and formats from showtimes
  const allLanguages = Array.from(new Set(
    Object.values(show.dateTime || {})
      .flat()
      .map(t => t.language)
      .filter(Boolean)
  ));
  const allFormats = Array.from(new Set(
    Object.values(show.dateTime || {})
      .flat()
      .map(t => t.format)
      .filter(Boolean)
  ));



  // Group shows by theatre for the selected date, filtered by language/format
  let theatreMap = {};
  if (selectedDate && show.dateTime[selectedDate]) {

    
    for (const showObj of show.dateTime[selectedDate]) {
      
      
      // Apply language filter
      if (selectedLanguage && showObj.language !== selectedLanguage) {
                  continue;
      }
      
      // Apply format filter
      if (selectedFormat && showObj.format !== selectedFormat) {
                  continue;
      }
      
      const theatreKey = `${showObj.theatreName} - ${showObj.theatreCity}`;
      if (!theatreMap[theatreKey]) {
        theatreMap[theatreKey] = [];
      }
      theatreMap[theatreKey].push(showObj);
      
    }
    

  }

  return (
    <div className="booking-page">
      {/* Backdrop Background */}
      {movie && (
        <div 
          className="backdrop-overlay"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${movie.backdrop_url || image_base_url + movie.backdrop_path})`,
          }}
        />
      )}
      
      <div className="booking-container">
        {/* Movie Header Section */}
        <div className="movie-header">
          <div className="movie-title-section">
            <h1 className="movie-title">{movie.title}</h1>
            <div className="movie-rating">
              <Star className="star-icon" />
              <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>
          
          <div className="movie-tags">
            {tags.slice(0, 3).map((tag, i) => (
              <span 
                key={tag} 
                className="movie-tag"
                style={{
                  backgroundColor: TAG_COLORS[i % TAG_COLORS.length].bg,
                  color: TAG_COLORS[i % TAG_COLORS.length].text
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Date Selector */}
        <div className="date-selector">
          <div className="date-selector-header">
            <Calendar className="calendar-icon" />
            <span>Select Date</span>
          </div>
          <div className="date-list">
            {dateList.map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`date-button ${selectedDate === date ? 'date-button-active' : ''}`}
              >
                <span className="date-day">{new Date(date).toLocaleDateString('en-US', { day: '2-digit' })}</span>
                <span className="date-month">{new Date(date).toLocaleString('en-US', { month: 'short' }).toUpperCase()}</span>
                <span className="date-weekday">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-header">
            <span>Filter Options</span>
          </div>
          <div className="filter-buttons">
            {/* Language Filter */}
            <div className="dropdown-container">
              <button
                className={`filter-button ${selectedLanguage ? 'filter-button-active' : ''}`}
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                <span>{selectedLanguage || 'Language'}</span>
                <ChevronDown className="chevron-icon" />
              </button>
              {showLanguageDropdown && (
                <div className="dropdown-menu">
                  {allLanguages.length > 0 ? (
                    allLanguages.map(lang => (
                      <div
                        key={lang}
                        className="dropdown-item"
                        onClick={() => {
                          setSelectedLanguage(lang);
                          setShowLanguageDropdown(false);
                        }}
                      >
                        {lang}
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-item disabled">No languages</div>
                  )}
                  <div
                    className="dropdown-item clear"
                    onClick={() => {
                      setSelectedLanguage(null);
                      setShowLanguageDropdown(false);
                    }}
                  >
                    Clear
                  </div>
                </div>
              )}
            </div>

            {/* Format Filter */}
            <div className="dropdown-container">
              <button
                className={`filter-button ${selectedFormat ? 'filter-button-active' : ''}`}
                onClick={() => setShowFormatDropdown(!showFormatDropdown)}
              >
                <span>{selectedFormat || 'Format'}</span>
                <ChevronDown className="chevron-icon" />
              </button>
              {showFormatDropdown && (
                <div className="dropdown-menu">
                  {allFormats.length > 0 ? (
                    allFormats.map(fmt => (
                      <div
                        key={fmt}
                        className="dropdown-item"
                        onClick={() => {
                          setSelectedFormat(fmt);
                          setShowFormatDropdown(false);
                        }}
                      >
                        {fmt}
                      </div>
                    ))
                  ) : (
                    <div className="dropdown-item disabled">No formats</div>
                  )}
                  <div
                    className="dropdown-item clear"
                    onClick={() => {
                      setSelectedFormat(null);
                      setShowFormatDropdown(false);
                    }}
                  >
                    Clear
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Theatre List */}
        <div className="theatre-section">
          {Object.keys(theatreMap).length === 0 && (
            <div className="no-shows">
              <Clock className="no-shows-icon" />
              <span>No shows available for this date.</span>
            </div>
          )}
          
          {Object.entries(theatreMap).map(([theatre, times], idx) => (
            <div key={theatre} className="theatre-card">
              <div className="theatre-header">
                <div className="theatre-info">
                  <div className="theatre-logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <ellipse cx="12" cy="19" rx="7" ry="2" fill="#FFD600"/>
                      <path d="M7 19L6 8h12l-1 11" stroke="#F59E42" strokeWidth="2" strokeLinejoin="round"/>
                      <rect x="9" y="8" width="2" height="8" rx="1" fill="#FFD600"/>
                      <rect x="13" y="8" width="2" height="8" rx="1" fill="#FFD600"/>
                    </svg>
                  </div>
                  <div className="theatre-details">
                    <h3 className="theatre-name">{theatre}</h3>
                    <p className="theatre-formats">
                      Available formats: {Array.from(new Set(times.map(t => t.format))).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
              
              
              
              <div className="showtimes-grid">
                {times
                  .sort((a, b) => new Date(a.time) - new Date(b.time))
                  .map((t) => (
                    <button
                      key={t.showId}
                      className="showtime-button"
                      onClick={() => navigate(`/movies/${id}/${t.showId}`)}
                    >
                      <div className="showtime-time">
                        {new Date(t.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="showtime-format">{t.format || 'Normal'}</div>
                      <div className="showtime-price">₹{t.normalPrice} / ₹{t.vipPrice}</div>
                      <div className="showtime-language">{t.language || 'Unknown'}</div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectShowtime; 