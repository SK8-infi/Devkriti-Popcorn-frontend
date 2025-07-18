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
        if (!dateTimeInput) return;
        const [date, time] = dateTimeInput.split("T");
        if (!date || !time) return;

        setDateTimeSelection((prev) => {
            const times = prev[date] || [];
            if (!times.includes(time)) {
                return { ...prev, [date]: [...times, time] };
            }
            return prev;
        });
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

    const handleSubmit = async ()=>{
        try {
            setAddingShow(true)

            if (!theatre) {
                toast.error('Set your theatre name first!');
                setAddingShow(false);
                return;
            }

            if(!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice){
                return toast('Missing required fields');
            }

            const showsInput = Object.entries(dateTimeSelection).map(([date, times]) => ({ date, time: times }));

            const payload = {
                movieId: selectedMovie,
                showsInput,
                showPrice: Number(showPrice),
                theatreId: theatreId || theatre // fallback if theatreId is not in context
            }

            const { data } = await axios.post('/api/show/add', payload, {headers: { Authorization: `Bearer ${await getToken()}` }})

            if(data.success){
                toast.success(data.message)
                setSelectedMovie(null)
                setDateTimeSelection({})
                setShowPrice("")
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
        }
    }, [user]);

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
            <input type="datetime-local" value={dateTimeInput} onChange={(e) => setDateTimeInput(e.target.value)} className="outline-none rounded-md w-full bg-transparent text-white text-base font-medium" style={{'::placeholder': {color: 'white'}}} />
            <button onClick={handleDateTimeAdd} className="bg-primary/90 text-white px-4 py-2 text-sm rounded-lg shadow hover:bg-primary/80 transition-all cursor-pointer font-semibold" >
              Add Time
            </button>
          </div>
        </div>
      </div>

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
