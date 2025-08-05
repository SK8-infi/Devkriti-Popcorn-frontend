import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UsersIcon, MapPin, Building2, XIcon, Settings, IndianRupee } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

import { Link } from 'react-router-dom';
import TheatreSetupModal from '../../components/admin/TheatreSetupModal';
import TheatreDebug from '../../components/admin/TheatreDebug';

const Dashboard = () => {
  const { user, theatre, theatreCity, isAdmin, hasOwnerAccess, loading, fetchDashboardData, api, image_base_url } = useAppContext();
  const [dashboardData, setDashboardData] = useState(null);
  const [showSetupModal, setShowSetupModal] = useState(false);

  const currency = import.meta.env.VITE_CURRENCY

  const [selectedMovie, setSelectedMovie] = useState(null);



  // Local fetchDashboardData function as fallback
  const localFetchDashboardData = async () => {
    try {
      console.log('📊 Dashboard: Using local fetchDashboardData');
      
      // Fetch dashboard data
      console.log('🔍 Fetching dashboard data...');
      const dashboardResponse = await api.get("/api/admin/dashboard");
      console.log('🔍 Dashboard response:', dashboardResponse.data);
      let dashboardData = dashboardResponse.data.success ? dashboardResponse.data.dashboardData : null;
      console.log('🔍 Dashboard data extracted:', dashboardData);
      
      // Fetch active shows from the same source as Listed Shows
      console.log('🔍 Fetching shows data...');
      const showsResponse = await api.get("/api/admin/all-shows");
      console.log('🔍 Shows response:', showsResponse.data);
      const activeShows = showsResponse.data.success ? showsResponse.data.shows : [];
      console.log('🔍 Active shows extracted:', activeShows);
      
      // Combine the data
      const combinedData = {
        ...dashboardData,
        activeShows: activeShows
      };
      
      setDashboardData(combinedData);
      console.log('✅ Dashboard data fetched:', combinedData);
      console.log('✅ Active shows fetched:', activeShows);
      console.log('✅ Combined data set to state:', combinedData);
    } catch (error) {
      toast.error("Error fetching dashboard data");
      console.error('❌ Dashboard data fetch error:', error);
    }
  };

  const dashboardCards = [
    { title: "Total Bookings", value: dashboardData?.totalBookings || "0", icon: ChartLineIcon },
    { title: "Total Revenue", value: currency + (dashboardData?.totalRevenue || 0), icon: IndianRupee },
    { title: "Active Shows", value: dashboardData?.activeShows?.length || "0", icon: PlayCircleIcon }
  ]

  useEffect(() => {
    if(user && isAdmin){
      console.log('📊 Dashboard: User and admin status confirmed, fetching data...');
      console.log('📊 Dashboard: fetchDashboardData function:', typeof fetchDashboardData);
      
      // Always use local function to ensure state is set properly
      localFetchDashboardData();
      
      // Check if theatre setup is needed
      console.log('🔍 Theatre Setup Check:', { theatre, theatreCity, isAdmin });
      
      if (typeof theatre !== 'undefined' && typeof theatreCity !== 'undefined') {
        const needsSetup = !theatre || !theatreCity;
        console.log('🎭 Setup needed:', needsSetup, 'Theatre:', theatre, 'Theatre City:', theatreCity);
        
        if (needsSetup) {
          console.log('📋 Showing setup modal');
          setShowSetupModal(true);
        } else {
          console.log('✅ Theatre setup complete');
          setShowSetupModal(false);
        }
      } else {
        console.log('⏳ Waiting for theatre/city data to load...');
      }
    }   
  }, [user, isAdmin, theatre, theatreCity]);

  // Group shows by movie._id
  const movieMap = {};
  console.log('🔍 Dashboard: activeShows data:', dashboardData?.activeShows);
  console.log('🔍 Dashboard: activeShows length:', dashboardData?.activeShows?.length);
  
  dashboardData?.activeShows?.forEach(show => {
    console.log('🔍 Dashboard: Processing show:', show);
    const movieId = show.movie?._id;
    if (!movieId) {
      console.warn('⚠️ Dashboard: Show has no movie._id:', show);
      return;
    }
    if (!movieMap[movieId]) {
      movieMap[movieId] = {
        movie: show.movie,
        shows: [],
      };
    }
    movieMap[movieId].shows.push(show);
  });
  const uniqueMovies = Object.values(movieMap);
  console.log('🔍 Dashboard: Unique movies:', uniqueMovies);

  return !loading ? (
    <>
      {/* Theatre Setup Modal */}
      <TheatreSetupModal 
        isOpen={showSetupModal} 
        onClose={() => setShowSetupModal(false)} 
      />

      {/* Debug Component */}
      {/* <TheatreDebug /> */}


      
      {/* Show setup prompt if no theatre info */}
      {(!theatre && !theatreCity) && (
        <div className="w-full flex justify-center mb-6">
                      <div className="flex items-center gap-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-semibold">⚠️ Theatre setup required</span>
            </div>
            <button
              onClick={() => setShowSetupModal(true)}
              className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Setup Now
            </button>
          </div>
        </div>
      )}

      {/* Centered Info Block: Dashboard Cards */}
      <div className="w-full flex flex-col items-center justify-center mb-4 mt-2">
        <div className="flex gap-6 items-center justify-center w-full max-w-4xl">
          {dashboardCards.map((card, index) => (
            <div key={index} className="flex items-center gap-2 px-6 py-4 bg-white/10 border border-[0.5px] border-white/30 rounded-xl shadow-md min-w-[200px] transition-all duration-200 hover:border-primary hover:shadow-xl hover:scale-[1.04] cursor-pointer">
              <card.icon className="w-6 h-6 text-primary flex-shrink-0" />
              <div className="flex flex-col flex-1">
                <span className="text-xs text-gray-200 font-medium uppercase tracking-wide">{card.title}</span>
                <span className="text-xl font-bold text-white leading-tight">{card.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Quick Actions */}
      {hasOwnerAccess && (
        <div className="flex justify-center mb-6">
          <Link 
            to="/manage-users"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Manage Users
          </Link>
        </div>
      )}
      
      {/* Active Shows Section */}
      <div className="max-w-7xl mx-auto">
        <p className="mt-10 text-lg font-medium ml-4">Active Shows</p>
        <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-4">
          {uniqueMovies.map(({ movie, shows }) => (
            <div
              key={movie._id}
              className="flex flex-col items-center"
            >
              <div
                className="movie-flip-card w-full max-w-xs mx-auto cursor-pointer"
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
                    {/* More Details Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMovie({ movie, shows });
                      }}
                      className="mt-3 px-4 py-2 bg-white text-black text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors w-full"
                    >
                      More Details
                    </button>
                  </div>
                </div>
              </div>
              {/* Movie Name Below Card */}
              <p className="text-sm text-white font-medium mt-2 text-center max-w-[200px] truncate">
                {movie.title}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Modal for movie showtimes */}
      {selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
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
              <ul className="divide-y divide-gray-700 bg-white/10 rounded-lg p-4 shadow-lg max-h-60 overflow-y-auto animate-fade-in-up scrollbar-thin scrollbar-thumb-primary/60 scrollbar-track-transparent">
                {selectedMovie.shows.map((show) => (
                  <li key={show._id} className="py-2 flex justify-between items-center transition-transform duration-300 hover:scale-[1.03]">
                    <div className="flex flex-col">
                      <span className="text-white">{dateFormat(show.showDateTime)}</span>
                      <span className="text-gray-400 text-sm">{show.language || 'N/A'}</span>
                    </div>
                    <span className="text-primary font-semibold">{currency} {show.normalPrice} / {currency} {show.vipPrice}</span>
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
