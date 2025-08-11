import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { CheckIcon, DeleteIcon, StarIcon, Building2, MapPin, Globe } from 'lucide-react';
import { kConverter } from '../../lib/kConverter';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddShows = () => {

    const {api, user, isAdmin, image_base_url, theatre, theatreCity, theatreId, getToken} = useAppContext()

    const currency = import.meta.env.VITE_CURRENCY
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dateTimeSelection, setDateTimeSelection] = useState({});
    const [dateTimeInput, setDateTimeInput] = useState("");
    const [silverPrice, setSilverPrice] = useState("");
    const [goldPrice, setGoldPrice] = useState("");
    const [premiumPrice, setPremiumPrice] = useState("");
    const [addingShow, setAddingShow] = useState(false)
    const [rooms, setRooms] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState('Normal');
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [existingShows, setExistingShows] = useState([]);
    
    // Language selection state
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [languageInput, setLanguageInput] = useState('');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    
    // Custom time picker state
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedHour, setSelectedHour] = useState("12");
    const [selectedMinute, setSelectedMinute] = useState("00");
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Generate minutes in multiples of 5
    const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
    const hours = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));

    // Get available hours and minutes based on selected date
    const getAvailableHours = () => {
        if (!selectedDate) return hours;
        
        const today = new Date().toISOString().split('T')[0];
        if (selectedDate !== today) return hours;
        
        const now = new Date();
        const currentHour = now.getHours();
        return hours.filter(hour => parseInt(hour) > currentHour);
    };

    const getAvailableMinutes = (selectedHour) => {
        if (!selectedDate || !selectedHour) return minutes;
        
        const today = new Date().toISOString().split('T')[0];
        if (selectedDate !== today) return minutes;
        
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        if (parseInt(selectedHour) > currentHour) return minutes;
        if (parseInt(selectedHour) === currentHour) {
            return minutes.filter(minute => parseInt(minute) > currentMinute);
        }
        return minutes;
    };

    // Common languages list
    const languages = [
        "Hindi", "English", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Marathi", 
        "Gujarati", "Punjabi", "Odia", "Assamese", "Kashmiri", "Sindhi", "Konkani", "Sanskrit",
        "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Chinese", "Japanese",
        "Korean", "Arabic", "Turkish", "Dutch", "Swedish", "Norwegian", "Danish", "Finnish",
        "Polish", "Czech", "Hungarian", "Romanian", "Bulgarian", "Croatian", "Serbian", "Slovenian",
        "Slovak", "Estonian", "Latvian", "Lithuanian", "Greek", "Hebrew", "Persian", "Urdu",
        "Thai", "Vietnamese", "Indonesian", "Malay", "Filipino", "Burmese", "Khmer", "Lao",
        "Mongolian", "Tibetan", "Nepali", "Sinhala", "Dhivehi", "Kazakh", "Kyrgyz", "Tajik",
        "Turkmen", "Uzbek", "Azerbaijani", "Georgian", "Armenian", "Kurdish", "Pashto", "Dari"
    ];

    // Get available languages for selected movie
    const getAvailableLanguages = () => {
        if (!selectedMovie) return languages.slice(0, 10);
        
        const selectedMovieData = nowPlayingMovies.find(movie => movie.id === selectedMovie);
        if (!selectedMovieData || !selectedMovieData.spoken_languages) return languages.slice(0, 10);
        
        // Extract language names from spoken_languages array
        const availableLanguages = selectedMovieData.spoken_languages.map(lang => lang.english_name || lang.name);
        
        // If no spoken languages found, return common languages
        if (availableLanguages.length === 0) return languages.slice(0, 10);
        
        return availableLanguages;
    };

    // Filter languages based on input
    const filterLanguages = (input) => {
        const availableLanguages = getAvailableLanguages();
        
        if (!input.trim()) {
            setFilteredLanguages(availableLanguages.slice(0, 10));
            return;
        }
        
        const filtered = availableLanguages.filter(lang => 
            lang.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredLanguages(filtered);
    };

    // Handle language input change
    const handleLanguageInputChange = (e) => {
        const value = e.target.value;
        setLanguageInput(value);
        setSelectedLanguage(value);
        filterLanguages(value);
        setShowLanguageDropdown(true);
    };

    // Handle language selection from dropdown
    const handleLanguageSelect = (language) => {
        setSelectedLanguage(language);
        setLanguageInput(language);
        setShowLanguageDropdown(false);
        setFilteredLanguages([]);
    };

    // Handle language input focus
    const handleLanguageFocus = () => {
        setShowLanguageDropdown(true);
        filterLanguages(languageInput);
    };

    // Handle language input blur
    const handleLanguageBlur = () => {
        setTimeout(() => {
            setShowLanguageDropdown(false);
        }, 300); // Increased from 200ms to 300ms
    };

    const fetchNowPlayingMovies = async () => {
        try {
            const { data } = await api.get('/api/show/now-playing')
                if(data.success){
                    setNowPlayingMovies(data.movies)
                }
        } catch (error) {
            console.error('Error fetching movies:', error)
        }
    };

    const handleDateTimeAdd = () => {
        if (!selectedDate || !selectedHour || !selectedMinute) return;
        
        const timeString = `${selectedHour}:${selectedMinute}`;
        const dateTimeString = `${selectedDate}T${timeString}`;
        
        // Check if the selected date and time is in the past
        const selectedDateTime = new Date(dateTimeString);
        const now = new Date();
        
        if (selectedDateTime <= now) {
            alert('Cannot select a date and time in the past. Please choose a future date and time.');
            return;
        }
        
        setDateTimeSelection((prev) => {
            const times = prev[selectedDate] || [];
            if (!times.includes(timeString)) {
                return { ...prev, [selectedDate]: [...times, timeString] };
            }
            return prev;
        });
        
        // Reset time picker
        setSelectedHour("12");
        setSelectedMinute("00");
        setShowTimePicker(false);
    };

    const handleRemoveTime = (date, time) => {
        setDateTimeSelection((prev) => {
            const filteredTimes = prev[date].filter((t) => t !== time);
            if (filteredTimes.length === 0) {
                const { [date]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [date]: filteredTimes,
            };
        });
    };

    // Fetch rooms
    const fetchRooms = async () => {
      try {
        const { data } = await api.get('/api/admin/my-theatre');
        if (data.success && data.theatre && data.theatre.rooms) {
          setRooms(data.theatre.rooms);
        } else {
          setRooms([]);
        }
      } catch (e) {
        setRooms([]);
      }
    };

    // Fetch existing shows for the theatre
    const fetchExistingShows = async () => {
      try {
        const { data } = await api.get('/api/admin/shows');
        if (data.success) {
          setExistingShows(data.shows);
        } else {
          setExistingShows([]);
        }
      } catch (e) {
        setExistingShows([]);
      }
    };

    // Check if a room is available for the selected date/time combinations
    const isRoomAvailable = (roomId) => {
      if (Object.keys(dateTimeSelection).length === 0) return { available: true, conflict: null };
      
      for (const [date, times] of Object.entries(dateTimeSelection)) {
        for (const time of times) {
          const selectedDateTime = new Date(`${date}T${time}`);
          const selectedEndTime = new Date(selectedDateTime.getTime() + (3 * 60 * 60 * 1000)); // 3 hours later
          
          // Check if there's any existing show that overlaps with the 3-hour duration
          const conflict = existingShows.find(show => {
            if (show.room !== roomId) return false;
            
            const showDateTime = new Date(show.showDateTime);
            const showEndTime = new Date(showDateTime.getTime() + (3 * 60 * 60 * 1000)); // 3 hours later
            
            // Check for overlap: new show starts before existing show ends AND new show ends after existing show starts
            const overlaps = selectedDateTime < showEndTime && selectedEndTime > showDateTime;
            
            return overlaps;
          });
          
          if (conflict) {
            return { 
              available: false, 
              conflict: {
                movie: conflict.movie?.title || 'Unknown Movie',
                time: new Date(conflict.showDateTime).toLocaleString(),
                room: conflict.room
              }
            };
          }
        }
      }
      return { available: true, conflict: null };
    };

    const handleSubmit = async ()=>{
        try {
            // Validate before setting loading state
            if (!theatreId) {
                toast.error('Theatre ID not found! Please set your theatre first.');
                return;
            }

            if(!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !silverPrice || !goldPrice || !premiumPrice || !selectedRoomId || !selectedLanguage){
                toast.error('Please fill in all required fields');
                return;
            }

            setAddingShow(true)

            const showsInput = Object.entries(dateTimeSelection).map(([date, times]) => ({ date, time: times }));

            const payload = {
                movieId: selectedMovie,
                showsInput,
                silverPrice: Number(silverPrice),
                goldPrice: Number(goldPrice),
                premiumPrice: Number(premiumPrice),
                theatreId: theatreId, // Only use ObjectId
                roomId: selectedRoomId,
                language: selectedLanguage
            }

            const { data } = await api.post('/api/show/add', payload, {headers: { Authorization: `Bearer ${await getToken()}` }})

            if(data.success){
                toast.success(data.message)
                setSelectedMovie(null)
                setDateTimeSelection({})
                setSilverPrice("")
                setGoldPrice("")
                setPremiumPrice("")
                setSelectedRoomId("")
                setSelectedLanguage("")
                setLanguageInput("")
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error('An error occurred. Please try again.')
        }
        setAddingShow(false)
    }

    useEffect(() => {
      if(user){
        fetchNowPlayingMovies();
        fetchRooms();
        fetchExistingShows();
      }
    }, [user]);

    // Refetch existing shows when date/time selection changes
    useEffect(() => {
      if (user && Object.keys(dateTimeSelection).length > 0) {
        fetchExistingShows();
      }
    }, [dateTimeSelection, user]);

    // Reset room selection if currently selected room becomes unavailable
    useEffect(() => {
      if (selectedRoomId && !isRoomAvailable(selectedRoomId).available) {
        setSelectedRoomId('');
        toast.error('Selected room is not available for the chosen times. Please select another room.');
      }
    }, [existingShows, dateTimeSelection, selectedRoomId]);

    // Reset language selection when movie changes
    useEffect(() => {
      setSelectedLanguage('');
      setLanguageInput('');
      setFilteredLanguages([]);
    }, [selectedMovie]);

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title title="Add New Show" />

      {/* Movie Selection Section */}
      <div className="rounded-xl p-6 mb-8 border border-gray-600/20" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(8px)'
      }}>
        <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <StarIcon className="w-5 h-5 text-amber-400" />
          Select Movie
        </h2>
        <p className="text-gray-300 mb-4">Choose from currently playing movies</p>
        <div className="overflow-x-auto pb-4">
          <div className="group flex flex-wrap gap-4 mt-4 w-max">
              {nowPlayingMovies.map((movie) =>(
                  <div key={movie.id} className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300 `} onClick={()=> setSelectedMovie(movie.id)}>
                      <div className="relative rounded-lg overflow-hidden">
                          <img src={image_base_url + movie.poster_path} alt="" className="w-full object-cover brightness-90" />
                          <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                                      <p className="flex items-center gap-1 text-gray-400">
                                          <StarIcon className="w-4 h-4 text-primary fill-primary" />
                                          {movie.vote_average.toFixed(1)}
                                      </p>
                                      <p className="text-gray-300">{kConverter(movie.vote_count)} Votes</p>
                                  </div>
                      </div>
                      {selectedMovie === movie.id && (
                          <div className="absolute top-2 right-2 flex items-center justify-center bg-amber-500 h-6 w-6 rounded">
                              <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                          </div>
                      )}
                      <p className="font-medium truncate alta-font">{movie.title}</p>
                      <p className="text-gray-400 text-sm">{movie.release_date}</p>
                  </div>
              ))}
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-6">
          
          {/* Seat Pricing Section */}
          <div className="rounded-xl p-6 border border-gray-600/20" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)'
          }}>
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Seat Pricing
            </h2>
            <div className="space-y-4">
              {/* Silver Price */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold mb-2 text-gray-300">Silver Seats</label>
                <div className="flex items-center gap-2 border border-gray-500/30 px-4 py-3 rounded-lg" style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)'
                }}>
                  <p className="text-white font-bold text-base">{currency}</p>
                  <input 
                    min={0} 
                    type="number" 
                    value={silverPrice} 
                    onChange={(e) => setSilverPrice(e.target.value)} 
                    placeholder="Enter price" 
                    className="outline-none w-full bg-transparent text-white text-base font-medium" 
                  />
                </div>
              </div>
              
              {/* Gold Price */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold mb-2 text-gray-300">Gold Seats</label>
                <div className="flex items-center gap-2 border border-gray-500/30 px-4 py-3 rounded-lg" style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)'
                }}>
                  <p className="text-white font-bold text-base">{currency}</p>
                  <input 
                    min={0} 
                    type="number" 
                    value={goldPrice} 
                    onChange={(e) => setGoldPrice(e.target.value)} 
                    placeholder="Enter price" 
                    className="outline-none w-full bg-transparent text-white text-base font-medium" 
                  />
                </div>
              </div>
              
              {/* Premium Price */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold mb-2 text-gray-300">Premium Seats</label>
                <div className="flex items-center gap-2 border border-gray-500/30 px-4 py-3 rounded-lg" style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)'
                }}>
                  <p className="text-white font-bold text-base">{currency}</p>
                  <input 
                    min={0} 
                    type="number" 
                    value={premiumPrice} 
                    onChange={(e) => setPremiumPrice(e.target.value)} 
                    placeholder="Enter price" 
                    className="outline-none w-full bg-transparent text-white text-base font-medium" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="rounded-xl p-6 border border-gray-600/20" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)'
          }}>
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />
              Language
            </h2>
            <div className="relative">
              <div className="flex items-center gap-2 border border-gray-500/30 px-4 py-3 rounded-lg" style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)'
              }}>
                <Globe className="w-5 h-5 text-amber-400" />
                <input 
                  type="text" 
                  value={languageInput} 
                  onChange={handleLanguageInputChange}
                  onFocus={handleLanguageFocus}
                  onBlur={handleLanguageBlur}
                  onClick={() => {
                    setShowLanguageDropdown(true);
                    filterLanguages(languageInput);
                  }}
                  placeholder={selectedMovie ? "Select from available languages" : "Select a movie first"} 
                  className="outline-none w-full bg-transparent text-white text-base font-medium" 
                  disabled={!selectedMovie}
                />
              </div>
              
              {/* Language Dropdown */}
              {showLanguageDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto">
                  {!selectedMovie ? (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      Please select a movie first
                    </div>
                  ) : filteredLanguages.length > 0 ? (
                    filteredLanguages.map((language, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-red-50 cursor-pointer text-black"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLanguageSelect(language);
                        }}
                      >
                        {language}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      No languages available for this movie
                    </div>
                  )}
                </div>
              )}
              
              {selectedMovie && (
                <p className="text-xs text-gray-400 mt-2">
                  Languages filtered by selected movie
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Date & Time Selection */}
          <div className="rounded-xl p-6 border border-gray-600/20" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)'
          }}>
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              Schedule
            </h2>
            
            {/* Date Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-300">Select Date</label>
                              <input 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)} 
                  min={new Date().toISOString().split('T')[0]}
                  className="outline-none border border-gray-500/30 px-4 py-3 rounded-lg w-full text-white text-base font-medium"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(8px)'
                  }} 
                />
            </div>
            
            {/* Time Selection */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-300">Select Time</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowTimePicker(true)} 
                  className="flex-1 bg-black text-white px-4 py-3 text-sm rounded-lg shadow hover:bg-gray-800 transition-all cursor-pointer font-semibold" 
                >
                  Choose Time
                </button>
                <button 
                  onClick={handleDateTimeAdd} 
                  disabled={!selectedDate || !selectedHour || !selectedMinute} 
                  className="flex-1 bg-red-900 text-white px-4 py-3 text-sm rounded-lg shadow hover:bg-red-800 transition-all cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
                >
                  Add Time
                </button>
              </div>
            </div>

            {/* Display Selected Times */}
            {Object.keys(dateTimeSelection).length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2 text-gray-300">Selected Times</h3>
                <div className="space-y-2">
                  {Object.entries(dateTimeSelection).map(([date, times]) => (
                    <div key={date} className="rounded-lg p-3" style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(8px)'
                    }}>
                      <div className="font-medium text-white mb-2">{date}</div>
                      <div className="flex flex-wrap gap-2">
                        {times.map((time) => (
                          <div key={time} className="border border-gray-500/50 px-3 py-1 flex items-center rounded-lg bg-gray-700/20" >
                            <span className="text-white">{time}</span>
                            <DeleteIcon 
                              onClick={() => handleRemoveTime(date, time)} 
                              width={15} 
                              className="ml-2 text-red-500 hover:text-red-700 cursor-pointer" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Room Selection */}
          <div className="rounded-xl p-6 border border-gray-600/20" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(8px)'
          }}>
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Room Configuration
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Room Type */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold mb-2 text-gray-300">Room Type</label>
                <select 
                  value={selectedRoomType} 
                  onChange={e => { setSelectedRoomType(e.target.value); setSelectedRoomId(''); }} 
                  className="border border-gray-500/30 px-4 py-3 rounded-lg text-white"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <option value="Normal">Normal</option>
                  <option value="3D">3D</option>
                  <option value="IMAX">IMAX</option>
                </select>
              </div>
              
              {/* Room Select */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold mb-2 text-gray-300">Select Room</label>
                <select 
                  value={selectedRoomId} 
                  onChange={e => setSelectedRoomId(e.target.value)} 
                  className="border border-gray-500/30 px-4 py-3 rounded-lg text-white"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <option value="">Choose room</option>
                  {rooms.filter(room => room.type === selectedRoomType).map(room => {
                    const { available, conflict } = isRoomAvailable(room._id);
                    return (
                      <option 
                        key={room._id} 
                        value={available ? room._id : ""} 
                        disabled={!available}
                        style={{ 
                          color: available ? 'white' : '#888',
                          backgroundColor: available ? 'inherit' : '#333'
                        }}
                      >
                        {room.name} {!available ? `- CONFLICT` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            
            {Object.keys(dateTimeSelection).length > 0 ? (
              <p className="text-xs text-gray-400 mt-3">
                * Unavailable rooms have conflicting shows (3-hour duration assumed)
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-3">
                Select date and time first to check room availability
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleSubmit}
          disabled={addingShow}
          className="px-12 py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg transition-all duration-200 hover:bg-red-700 hover:scale-105 focus:outline-none border-none text-lg"
        >
          {addingShow ? 'Adding Show...' : 'Add Show'}
        </button>
      </div>

      {/* Custom Time Picker Modal */}
      {showTimePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center relative border border-gray-600/30" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(15px)'
          }}>
            <h2 className="text-2xl font-bold mb-4 text-white">Select Time</h2>
            <div className="flex gap-4 mb-6">
              {/* Hour Selection */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-semibold text-gray-300 mb-2">Hour</label>
                <select 
                  value={selectedHour} 
                  onChange={(e) => setSelectedHour(e.target.value)}
                  className="border border-gray-500/50 p-3 rounded text-lg backdrop-blur-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    color: 'white'
                  }}
                >
                  {getAvailableHours().map(hour => (
                    <option key={hour} value={hour} style={{ color: 'black', backgroundColor: 'white' }}>{hour}</option>
                  ))}
                </select>
              </div>
              {/* Minute Selection */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-semibold text-gray-300 mb-2">Minute</label>
                <select 
                  value={selectedMinute} 
                  onChange={(e) => setSelectedMinute(e.target.value)}
                  className="border border-gray-500/50 p-3 rounded text-lg backdrop-blur-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    color: 'white'
                  }}
                >
                  {getAvailableMinutes(selectedHour).map(minute => (
                    <option key={minute} value={minute} style={{ color: 'black', backgroundColor: 'white' }}>{minute}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-lg font-semibold text-white mb-6">
              Selected Time: {selectedHour}:{selectedMinute}
            </div>
            <div className="flex gap-3 justify-center items-center">
              <button
                onClick={() => setShowTimePicker(false)}
                className="bg-gray-600/80 text-white px-6 py-2 rounded-lg font-semibold text-lg hover:bg-gray-700/80 transition backdrop-blur-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowTimePicker(false)}
                className="bg-amber-500/80 text-white px-6 py-2 rounded-lg font-semibold text-lg hover:bg-amber-600/80 transition backdrop-blur-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  ) : <Loading />
}

export default AddShows
