import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import { kConverter } from '../../lib/kConverter';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddShows = () => {

    const {axios, getToken, user, image_base_url, theatre, theatreId} = useAppContext()

    const currency = import.meta.env.VITE_CURRENCY
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dateTimeSelection, setDateTimeSelection] = useState({});
    const [dateTimeInput, setDateTimeInput] = useState("");
    const [showPrice, setShowPrice] = useState("");
    const [addingShow, setAddingShow] = useState(false)
    const [rooms, setRooms] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState('Normal');
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const [existingShows, setExistingShows] = useState([]);
    
    // Custom time picker state
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedHour, setSelectedHour] = useState("12");
    const [selectedMinute, setSelectedMinute] = useState("00");
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Generate minutes in multiples of 5
    const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];
    const hours = Array.from({length: 24}, (_, i) => i.toString().padStart(2, '0'));

    const fetchNowPlayingMovies = async () => {
        try {
            const { data } = await axios.get('/api/show/now-playing', {
                headers: { Authorization: `Bearer ${await getToken()}` }})
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
        const { data } = await axios.get('/api/admin/my-theatre', { headers: { Authorization: `Bearer ${await getToken()}` } });
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
        const { data } = await axios.get('/api/admin/shows', { headers: { Authorization: `Bearer ${await getToken()}` } });
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
      if (Object.keys(dateTimeSelection).length === 0) return true;
      
      for (const [date, times] of Object.entries(dateTimeSelection)) {
        for (const time of times) {
          const selectedDateTime = new Date(`${date}T${time}`);
          
          // Check if there's any existing show at the same time in the same room
          const conflict = existingShows.some(show => {
            const showDateTime = new Date(show.showDateTime);
            return show.room === roomId && 
                   showDateTime.getTime() === selectedDateTime.getTime();
          });
          
          if (conflict) return false;
        }
      }
      return true;
    };

    const handleSubmit = async ()=>{
        try {
            setAddingShow(true)

            if (!theatreId) {
                toast.error('Theatre ID not found! Please set your theatre first.');
                setAddingShow(false);
                return;
            }

            if(!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice || !selectedRoomId){
                return toast('Missing required fields');
            }

            const showsInput = Object.entries(dateTimeSelection).map(([date, times]) => ({ date, time: times }));

            const payload = {
                movieId: selectedMovie,
                showsInput,
                showPrice: Number(showPrice),
                theatreId: theatreId, // Only use ObjectId
                roomId: selectedRoomId
            }

            const { data } = await axios.post('/api/show/add', payload, {headers: { Authorization: `Bearer ${await getToken()}` }})

            if(data.success){
                toast.success(data.message)
                setSelectedMovie(null)
                setDateTimeSelection({})
                setShowPrice("")
                setSelectedRoomId("")
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
      if (selectedRoomId && !isRoomAvailable(selectedRoomId)) {
        setSelectedRoomId('');
        toast.error('Selected room is not available for the chosen times. Please select another room.');
      }
    }, [existingShows, dateTimeSelection, selectedRoomId]);

  return nowPlayingMovies.length > 0 ? (
    <>
      <p className="mt-4 text-lg font-medium">Now Playing Movies</p>
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
                        <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                            <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                        </div>
                    )}
                    <p className="font-medium truncate alta-font">{movie.title}</p>
                    <p className="text-gray-400 text-sm">{movie.release_date}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Show Price & Date/Time Selection Side by Side */}
      <div className="flex flex-col md:flex-row gap-8 mt-8 w-full">
        {/* Show Price Input */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <label className="block text-sm font-semibold mb-3 text-white">Show Price</label>
          <div className="flex items-center gap-2 border border-primary/30 px-4 py-3 rounded-lg w-full">
            <p className="text-white font-bold text-base">{currency}</p>
            <input min={0} type="number" value={showPrice} onChange={(e) => setShowPrice(e.target.value)} placeholder="Enter show price" className="outline-none w-full bg-transparent text-white text-base font-medium" style={{'::placeholder': {color: 'white'}}} />
          </div>
        </div>
        {/* Date & Time Selection */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <label className="block text-sm font-semibold mb-3 text-white">Select Date and Time</label>
          <div className="flex gap-3 border border-primary/30 px-4 py-3 rounded-lg w-full">
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="outline-none rounded-md w-full bg-transparent text-white text-base font-medium" style={{'::placeholder': {color: 'white'}}} />
            <button onClick={() => setShowTimePicker(true)} className="bg-primary/90 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-primary/80 transition-all cursor-pointer font-semibold" >
              Select Time
            </button>
            <button onClick={handleDateTimeAdd} disabled={!selectedDate || !selectedHour || !selectedMinute} className="bg-amber-200/90 text-amber-900 px-4 py-2 text-sm rounded-lg shadow hover:bg-amber-300/80 transition-all cursor-pointer font-semibold disabled:opacity-50 disabled:cursor-not-allowed" >
              Add Time
            </button>
          </div>
        </div>
      </div>

      {/* Custom Time Picker Modal */}
      {showTimePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center relative border-2 border-primary">
            <h2 className="text-2xl font-bold mb-4 text-black">Select Time</h2>
            <div className="flex gap-4 mb-6">
              {/* Hour Selection */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-semibold text-black mb-2">Hour</label>
                <select 
                  value={selectedHour} 
                  onChange={(e) => setSelectedHour(e.target.value)}
                  className="border border-primary/40 p-3 rounded text-lg bg-primary/5 text-black"
                >
                  {hours.map(hour => (
                    <option key={hour} value={hour}>{hour}</option>
                  ))}
                </select>
              </div>
              {/* Minute Selection */}
              <div className="flex flex-col items-center">
                <label className="text-sm font-semibold text-black mb-2">Minute</label>
                <select 
                  value={selectedMinute} 
                  onChange={(e) => setSelectedMinute(e.target.value)}
                  className="border border-primary/40 p-3 rounded text-lg bg-primary/5 text-black"
                >
                  {minutes.map(minute => (
                    <option key={minute} value={minute}>{minute}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-lg font-semibold text-black mb-6">
              Selected Time: {selectedHour}:{selectedMinute}
            </div>
            <div className="flex gap-3 justify-center items-center">
              <button
                onClick={() => setShowTimePicker(false)}
                className="bg-gray-300 text-black px-6 py-2 rounded-lg font-semibold text-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowTimePicker(false)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold text-lg hover:bg-green-700 transition"
              >
                OK
              </button>
              <button
                onClick={() => setShowTimePicker(false)}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold text-lg hover:bg-primary/90 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Display Selected Times */}
        {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
            <h2 className=" mb-2">Selected Date-Time</h2>
            <ul className="space-y-3">
                {Object.entries(dateTimeSelection).map(([date, times]) => (
                    <li key={date}>
                        <div className="font-medium">{date}</div>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm">
                            {times.map((time) => (
                                <div key={time} className="border border-primary px-2 py-1 flex items-center rounded" >
                                    <span>{time}</span>
                                    <DeleteIcon onClick={() => handleRemoveTime(date, time)} width={15} className="ml-2 text-red-500 hover:text-red-700 cursor-pointer" />
                                </div>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
            </div>
       )}
      {/* Room Type and Room Selection */}
      <div className="flex flex-col md:flex-row gap-8 mt-8 w-full">
        {/* Room Type Select */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <label className="block text-sm font-semibold mb-3 text-white">Room Type</label>
          <select value={selectedRoomType} onChange={e => { setSelectedRoomType(e.target.value); setSelectedRoomId(''); }} className="border border-primary/30 px-4 py-3 rounded-lg w-full bg-black/40 text-white">
            <option value="Normal">Normal</option>
            <option value="3D">3D</option>
            <option value="IMAX">IMAX</option>
          </select>
        </div>
        {/* Room Select */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <label className="block text-sm font-semibold mb-3 text-white">Select Room</label>
          <select value={selectedRoomId} onChange={e => setSelectedRoomId(e.target.value)} className="border border-primary/30 px-4 py-3 rounded-lg w-full bg-black/40 text-white">
            <option value="">Select a room</option>
            {rooms.filter(room => room.type === selectedRoomType).map(room => {
              const available = isRoomAvailable(room._id);
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
                  {room.name} ({room.type}) {!available ? '- UNAVAILABLE' : ''}
                </option>
              );
            })}
          </select>
          {Object.keys(dateTimeSelection).length > 0 ? (
            <p className="text-xs text-gray-400 mt-2">
              * Unavailable rooms have conflicting shows at selected times
            </p>
          ) : (
            <p className="text-xs text-gray-400 mt-2">
              Select date and time first to check room availability
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-start mt-4">
        <button
          onClick={handleSubmit}
          disabled={addingShow}
          className="px-8 py-3 bg-white/20 text-white rounded-xl font-semibold shadow-md backdrop-blur-md transition-all duration-200 hover:bg-white/40 hover:text-primary hover:scale-105 focus:outline-none border-none"
          style={{ border: 'none' }}
        >
          {addingShow ? 'Adding...' : 'Add Show'}
        </button>
      </div>
    </>
  ) : <Loading />
}

export default AddShows
