import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UsersIcon, MapPin, Building2, XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import DarkVeil from '../../components/DarkVeil'; // Added DarkVeil import

const Dashboard = () => {

    const {axios, getToken, user, image_base_url, theatre, city} = useAppContext()

    const currency = import.meta.env.VITE_CURRENCY

    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUser: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const dashboardCards = [
        { title: "Total Bookings", value: dashboardData.totalBookings || "0", icon: ChartLineIcon },
        { title: "Total Revenue", value: currency + dashboardData.totalRevenue || "0", icon: CircleDollarSignIcon },
        { title: "Active Shows", value: dashboardData.activeShows.length || "0", icon: PlayCircleIcon },
        { title: "Total Users", value: dashboardData.totalUser || "0", icon: UsersIcon }
    ]

    const fetchDashboardData = async () => {
        try {
           const { data } = await axios.get("/api/admin/dashboard", {headers: { Authorization: `Bearer ${await getToken()}`}}) 
           if (data.success) {
            setDashboardData(data.dashboardData)
            setLoading(false)
           }else{
            toast.error(data.message)
           }
        } catch (error) {
            setLoading(false);
            toast.error("Error fetching dashboard data");
            console.error(error);
        }
    };

    useEffect(() => {
        if(user){
            fetchDashboardData();
        }   
    }, [user]);

  // Group shows by movie._id
  const movieMap = {};
  dashboardData.activeShows.forEach(show => {
    const movieId = show.movie._id;
    if (!movieMap[movieId]) {
      movieMap[movieId] = {
        movie: show.movie,
        shows: [],
      };
    }
    movieMap[movieId].shows.push(show);
  });
  const uniqueMovies = Object.values(movieMap);

  return !loading ? (
    <>
      {/* Centered Info Block: Theatre, City, Dashboard Cards */}
      <div className="w-full flex flex-col items-center justify-center mb-4 mt-2">
        <div className="flex flex-wrap gap-4 items-center justify-center mb-3">
          {theatre && (
            <div className="flex items-center gap-2 bg-white/70 border border-white/80 rounded-lg px-4 py-2 text-black shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
              <Building2 className="w-5 h-5 text-black/80" />
              <span className="font-semibold text-base text-black">{theatre}</span>
            </div>
          )}
          {city && (
            <div className="flex items-center gap-2 bg-white/70 border border-white/80 rounded-lg px-4 py-2 text-black shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
              <MapPin className="w-5 h-5 text-black/80" />
              <span className="font-semibold text-base text-black">{city}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-center w-full max-w-4xl scale-90">
          {dashboardCards.map((card, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-3 bg-white/10 border border-[0.5px] border-white/30 rounded-xl shadow-md backdrop-blur-md min-w-[135px] max-w-xs w-full transition-all duration-200 hover:border-primary hover:shadow-xl hover:scale-[1.04] cursor-pointer">
              <card.icon className="w-6 h-6 text-primary flex-shrink-0" />
              <div className="flex flex-col flex-1">
                <span className="text-xs text-gray-200 font-medium uppercase tracking-wide">{card.title}</span>
                <span className="text-xl font-bold text-white leading-tight">{card.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-10 text-lg font-medium">Active Shows</p>
      <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-4 max-w-7xl mx-auto">
        {uniqueMovies.map(({ movie, shows }) => (
          <div
            key={movie._id}
            className="movie-flip-card w-full max-w-xs mx-auto cursor-pointer"
            onClick={() => setSelectedMovie({ movie, shows })}
          >
            <div className="movie-flip-inner">
              {/* Front Side */}
              <div className="movie-flip-front bg-primary/10 border border-[0.5px] border-white/30">
                <img src={image_base_url + movie.poster_path} alt='' className="w-full h-full object-cover" />
              </div>
              {/* Back Side */}
              <div className="movie-flip-back border border-[0.5px] border-primary">
                <h3 className="font-semibold text-base mb-2 text-center">{movie.title}</h3>
                <div className="flex items-center gap-2 text-primary mb-2">
                  <StarIcon className="w-4 h-4" />
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
                <p className="text-xs text-gray-200 mb-2 text-center" style={{display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{movie.overview}</p>
                <p className="text-xs text-gray-300 text-center">
                  {movie.genres ? movie.genres.map(genre => genre.name === 'Science Fiction' ? 'Sci-Fi' : genre.name).join(", ") : ''}
                  {movie.release_date ? ` • ${movie.release_date.split("-")[0]}` : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for movie showtimes */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          {/* Animated background for modal */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <DarkVeil noiseIntensity={0.03} scanlineIntensity={0.06} scanlineFrequency={1.5} warpAmount={0.03} speed={0.3} />
          </div>
          <div className="bg-black/70 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-2xl flex flex-col items-center relative border-2 border-primary" style={{ zIndex: 1 }}>
            <button
              className="absolute top-3 right-3 text-white hover:text-primary"
              onClick={() => setSelectedMovie(null)}
            >
              <XIcon className="w-6 h-6" />
            </button>
            <div className="flex flex-col md:flex-row gap-8 w-full items-start">
              {/* Poster */}
              <img src={image_base_url + selectedMovie.movie.poster_path} alt='' className="h-44 w-32 object-cover rounded-xl shadow-lg mb-4 md:mb-0" />
              {/* Details */}
              <div className="flex-1 flex flex-col gap-2">
                <h2 className="text-2xl font-bold text-white mb-1">{selectedMovie.movie.title}</h2>
                <div className="flex items-center gap-2 text-gray-300">
                  <StarIcon className="w-5 h-5 text-primary fill-primary" />
                  {selectedMovie.movie.vote_average?.toFixed(1)} User Rating
                </div>
                <p className="text-gray-400 text-sm leading-tight max-w-xl line-clamp-4">{selectedMovie.movie.overview}</p>
                <p className="text-gray-300 text-sm mt-1">
                  {selectedMovie.movie.runtime ? `${selectedMovie.movie.runtime} min • ` : ''}
                  {selectedMovie.movie.genres ? selectedMovie.movie.genres.map(genre => genre.name === 'Science Fiction' ? 'Sci-Fi' : genre.name).join(", ") : ''}
                  {selectedMovie.movie.release_date ? ` • ${selectedMovie.movie.release_date.split("-")[0]}` : ''}
                </p>
              </div>
            </div>
            {/* Showtimes List */}
            <div className="w-full mt-6">
              <h3 className="text-lg font-semibold text-white mb-2">Showtimes</h3>
              <ul className="divide-y divide-gray-700 bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg max-h-60 overflow-y-auto animate-fade-in-up scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-transparent">
                {selectedMovie.shows.map((show) => (
                  <li key={show._id} className="py-2 flex justify-between items-center transition-transform duration-300 hover:scale-[1.03]">
                    <span className="text-white">{dateFormat(show.showDateTime)}</span>
                    <span className="text-primary font-semibold">{currency} {show.showPrice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  ) : <Loading />
}

export default Dashboard
