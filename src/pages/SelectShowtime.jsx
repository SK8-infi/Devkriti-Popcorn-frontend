import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { useAppContext } from '../context/AppContext';
import { ChevronDown } from 'lucide-react';

const TAG_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-green-100 text-green-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-yellow-100 text-yellow-800',
  'bg-gray-100 text-gray-800',
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
  const { axios, image_base_url } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const getShow = async () => {
      try {
        const [{ data: showData }, { data: movieData }] = await Promise.all([
          axios.get(`/api/show/${id}`),
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
        console.log(error);
      }
    };
    getShow();
  }, [id, axios]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-2xl text-red-500 font-bold mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary rounded text-white mt-2">Retry</button>
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
      .map(t => t.language || movie.original_language?.toUpperCase())
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
      if (
        (selectedLanguage && showObj.language !== selectedLanguage) ||
        (selectedFormat && showObj.format !== selectedFormat)
      ) continue;
      if (!theatreMap[showObj.theatreName]) theatreMap[showObj.theatreName] = [];
      theatreMap[showObj.theatreName].push(showObj);
    }
  }

  return (
    <div className="relative px-6 md:px-16 lg:px-40 py-6 mt-20 min-h-screen">
      {/* Backdrop Background */}
      {movie && (
        <div 
          className="fixed left-0 right-0 top-0 bottom-0 bg-cover bg-center bg-no-repeat -z-10"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${movie.backdrop_url || image_base_url + movie.backdrop_path})`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            zIndex: -1,
            minHeight: '100vh',
          }}
        />
      )}
      {/* Movie Title and Tags */}
      <div className="mb-2">
        <h1 className="text-4xl font-semibold whitespace-nowrap mb-2 text-white" style={{fontFamily: 'Times New Roman, Times, serif'}}>{movie.title}</h1>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, i) => (
            <span key={tag} className={`px-3 py-1 rounded-full text-xs font-semibold ${TAG_COLORS[i % TAG_COLORS.length]}`}>{tag}</span>
          ))}
        </div>
      </div>
      {/* Date Selector */}
      <div className="flex gap-2 overflow-x-auto mb-4 pb-2 border-b border-gray-200 text-black">
        {dateList.map(date => (
          <button
            key={date}
            onClick={() => setSelectedDate(date)}
            className={`flex flex-col items-center px-4 py-2 rounded-lg border-2 transition-all min-w-[70px] ${selectedDate === date ? 'border-gray-200 bg-white text-gray-800' : 'border-primary bg-primary text-white'}`}
          >
            <span className="font-bold text-lg">{new Date(date).toLocaleDateString('en-US', { day: '2-digit' })}</span>
            <span className="text-xs">{new Date(date).toLocaleString('en-US', { month: 'short' }).toUpperCase()}</span>
            <span className="text-xs mt-1">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</span>
          </button>
        ))}
      </div>
      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-4 text-black">
        {/* Language Filter */}
        <div className="relative">
          <button
            className={`flex items-center gap-2 px-4 py-1 rounded-full border border-gray-300 text-sm font-medium bg-white ${selectedLanguage ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setShowLanguageDropdown((prev) => !prev)}
            onBlur={() => setTimeout(() => setShowLanguageDropdown(false), 150)}
            tabIndex={0}
          >
            {selectedLanguage || 'Language'}
            <ChevronDown className="w-4 h-4" />
          </button>
          {showLanguageDropdown && (
            <div className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow z-10 min-w-[96px] py-1 px-1 flex flex-col gap-1 text-sm">
              {allLanguages.map(lang => (
                <div
                  key={lang}
                  className="px-3 py-1 cursor-pointer hover:bg-gray-100 rounded-lg text-center"
                  onClick={() => { setSelectedLanguage(lang); setShowLanguageDropdown(false); }}
                >
                  {lang}
                </div>
              ))}
              <div
                className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-gray-500 rounded-lg text-center"
                onClick={() => { setSelectedLanguage(null); setShowLanguageDropdown(false); }}
              >
                Clear
              </div>
            </div>
          )}
        </div>
        {/* Format Filter */}
        <div className="relative">
          <button
            className={`flex items-center gap-2 px-4 py-1 rounded-full border border-gray-300 text-sm font-medium bg-white ${selectedFormat ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setShowFormatDropdown((prev) => !prev)}
            onBlur={() => setTimeout(() => setShowFormatDropdown(false), 150)}
            tabIndex={0}
          >
            {selectedFormat || 'Format'}
            <ChevronDown className="w-4 h-4" />
          </button>
          {showFormatDropdown && (
            <div className="absolute left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow z-10 min-w-[96px] py-1 px-1 flex flex-col gap-1 text-sm">
              {allFormats.map(fmt => (
                <div
                  key={fmt}
                  className="px-3 py-1 cursor-pointer hover:bg-gray-100 rounded-lg text-center"
                  onClick={() => { setSelectedFormat(fmt); setShowFormatDropdown(false); }}
                >
                  {fmt}
                </div>
              ))}
              <div
                className="px-3 py-1 cursor-pointer hover:bg-gray-100 text-gray-500 rounded-lg text-center"
                onClick={() => { setSelectedFormat(null); setShowFormatDropdown(false); }}
              >
                Clear
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Theatre List */}
      <div className="flex flex-col gap-6 text-black">
        {Object.keys(theatreMap).length === 0 && (
          <div className="text-gray-400 text-center py-8">No shows for this date.</div>
        )}
        {Object.entries(theatreMap).map(([theatre, times], idx) => (
          <div key={theatre} className="bg-white rounded-lg shadow p-4 border border-gray-100 text-black flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-2 items-stretch">
              <div className="flex items-center gap-2">
                {/* Cinema logo or default */}
                {times[0]?.theatreLogo ? (
                  <img src={times[0].theatreLogo} alt="logo" className="w-10 h-10 rounded object-cover bg-white border" />
                ) : (
                  <div className="w-10 h-10 rounded bg-yellow-100 flex items-center justify-center">
                    {/* Cool popcorn SVG icon */}
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="19" rx="7" ry="2" fill="#FFD600"/><path d="M7 19L6 8h12l-1 11" stroke="#F59E42" strokeWidth="2" strokeLinejoin="round"/><rect x="9" y="8" width="2" height="8" rx="1" fill="#FFD600"/><rect x="13" y="8" width="2" height="8" rx="1" fill="#FFD600"/></svg>
                  </div>
                )}
                <span className="font-semibold text-lg text-black">{theatre || 'Unknown Cinema'}</span>
              </div>
              <div className="flex flex-col justify-center">
                <button
                  className="ml-auto w-12 h-12 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-900 transition flex items-center justify-center"
                  onClick={() => navigate(`/movies/${id}/${selectedDate}`)}
                  disabled={!selectedDate}
                  style={{minHeight: '48px', minWidth: '48px'}}
                >
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 12h12M12 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {times.map((t) => (
                <button
                  key={t.showId}
                  className="px-4 py-2 rounded border border-gray-300 text-sm font-semibold transition-all min-w-[90px] text-black bg-white"
                >
                  {new Date(t.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  <div className="text-[10px] font-normal uppercase">{t.format || ''}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectShowtime; 