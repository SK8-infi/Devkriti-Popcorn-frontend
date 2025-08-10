import React, { useEffect, useState } from 'react';
import './Theatres.css';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon, UserIcon, BuildingIcon, StarIcon, RefreshCwIcon, FilterIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Theatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [filteredTheatres, setFilteredTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const navigate = useNavigate();
  const { userCity } = useAppContext();


  const fetchTheatres = async () => {
    // Only fetch data if we have determined the user city (or lack thereof)
    if (currentUserCity === null) return;
    
    try {
      // Build query params for theatres - only add city if it exists
      const theatreParams = new URLSearchParams();
      if (currentUserCity && currentUserCity.trim() !== '') {
        theatreParams.append('city', currentUserCity);
      }
      const theatreQueryString = theatreParams.toString();
      const theatreUrl = theatreQueryString ? `${API_URL}/api/admin/all-theatres?${theatreQueryString}` : `${API_URL}/api/admin/all-theatres`;
      
      const res = await fetch(theatreUrl);
      const data = await res.json();
      if (data.success) {
        setTheatres(data.theatres);
        // Filter theatres based on user city
        filterTheatresByCity(data.theatres);
      } else {
        setError(data.message || 'Failed to fetch theatres');
      }
    } catch (err) {
      setError('Failed to fetch theatres');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterTheatresByCity = (theatresList) => {
    if (!userCity) {
      setFilteredTheatres(theatresList);
    } else {
      const cityTheatres = theatresList.filter(theatre => 
        theatre.city && theatre.city.toLowerCase() === userCity.toLowerCase()
      );
      setFilteredTheatres(cityTheatres);
    }
  };

  useEffect(() => {
    fetchTheatres();
  }, [currentUserCity, cityChangeCounter]);

  // Re-filter when user city changes
  useEffect(() => {
    filterTheatresByCity(theatres);
  }, [userCity, theatres]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTheatres();
  };


  if (loading) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black pt-20 flex items-center justify-center"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCwIcon className="w-8 h-8 text-primary mx-auto mb-4" />
        </motion.div>
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-white text-xl"
        >
          Loading theatres...
        </motion.div>
      </motion.div>
    </motion.div>
  );
  
  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-black pt-20 flex items-center justify-center"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-red-500 text-xl mb-4"
        >
          {error}
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          className="bg-primary text-black px-6 py-2 rounded-lg hover:bg-primary/80 transition"
        >
          Try Again
        </motion.button>
      </motion.div>
    </motion.div>
  );

     return (
     <motion.div 
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       transition={{ duration: 0.3 }}
       className="min-h-screen bg-black pt-20 pb-10 px-4"
     >
       <div className="max-w-7xl mx-auto">
         {/* Header Section */}
         <motion.div 
           initial={{ y: -30, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 0.4, ease: "easeOut" }}
           className="text-center mb-12"
         >
           <motion.h1 
             initial={{ y: -20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
             className="text-5xl font-bold mb-6" 
             style={{ 
               fontFamily: 'Times New Roman, Times, serif', 
               background: 'linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               backgroundClip: 'text'
             }}
           >
             My Theatres
           </motion.h1>
           <motion.p 
             initial={{ y: -15, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.2, duration: 0.3, ease: "easeOut" }}
             className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed"
           >
             Explore our partner theatres and their unique layouts across cities
           </motion.p>
           
                      {/* City Filter Info */}
            <AnimatePresence>
              {userCity && (
                <motion.div 
                  initial={{ y: -15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3, ease: "easeOut" }}
                  className="mb-8"
                >
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.25 }}
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-yellow-500/10 border border-primary/20 rounded-full px-6 py-3"
                  >
                    <MapPinIcon className="w-5 h-5 text-primary" />
                    <span className="text-gray-300 font-medium">
                      Showing theatres in <span className="text-primary font-semibold">{userCity}</span>
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
           
           {/* Theatre Count Info */}
           <AnimatePresence>
             {filteredTheatres.length > 0 && (
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ delay: 0.5, duration: 0.25, ease: "easeOut" }}
                 className="mb-6"
               >
                 <div className="inline-flex items-center gap-2 bg-gray-900/50 border border-gray-700 rounded-full px-6 py-2">
                   <BuildingIcon className="w-4 h-4 text-primary" />
                                      <span className="text-gray-300 font-medium">
                      {filteredTheatres.length} theatre{filteredTheatres.length !== 1 ? 's' : ''} available
                      {userCity && ` in ${userCity}`}
                    </span>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
          
                     {/* Refresh Button */}
           <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={handleRefresh}
             disabled={refreshing}
             className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center gap-2 mx-auto font-medium border border-gray-600 hover:border-gray-500"
           >
             <motion.div
               animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
               transition={{ duration: 0.8, repeat: refreshing ? Infinity : 0, ease: "linear" }}
             >
               <RefreshCwIcon className="w-4 h-4" />
             </motion.div>
             {refreshing ? 'Refreshing...' : 'Refresh Theatres'}
           </motion.button>
        </motion.div>


                                   <AnimatePresence mode="wait">
            {filteredTheatres.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="text-center py-24"
              >
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.25 }}
                  className="bg-gray-900/50 border border-gray-700 rounded-2xl p-12 max-w-md mx-auto"
                >
                 <BuildingIcon className="w-20 h-20 text-gray-600 mx-auto mb-6" />
                                   <h3 className="text-2xl text-gray-300 mb-4 font-semibold">
                    {userCity 
                      ? `No Theatres Found in ${userCity}` 
                      : 'No Theatres Found'
                    }
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {userCity 
                      ? `No partner theatres are currently available in ${userCity}.`
                      : 'No partner theatres are currently available.'
                    }
                  </p>
               </motion.div>
             </motion.div>
                       ) : (
              <motion.div 
                key="theatres-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredTheatres.map((theatre, index) => (
                  <motion.div 
                    key={theatre._id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: index * 0.05, 
                      duration: 0.3, 
                      ease: "easeOut" 
                    }}
                    whileHover={{ 
                      scale: 1.03, 
                      y: -3,
                      transition: { duration: 0.2 }
                    }}
                                       onClick={() => navigate(`/theatres/${theatre._id}`)}
                    className="group relative border border-gray-700 rounded-2xl p-6 hover:border-primary/50 transition-all duration-200 cursor-pointer hover:shadow-2xl hover:shadow-primary/10"
                   style={{
                     background: 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 50%, #1f1f1f 100%)'
                   }}
                 >
                                       {/* Hover Glow Effect */}
                    <motion.div 
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-yellow-500/5 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.2 }}
                    />
                   
                   {/* Theatre Header */}
                   <div className="relative flex items-start justify-between mb-6">
                     <div className="flex-1">
                                               <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-3 group-hover:text-primary transition-colors duration-200">
                          <BuildingIcon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-200" />
                          {theatre.name}
                        </h2>
                       
                       {/* Theatre Address */}
                       {theatre.address && (
                         <div className="flex items-center gap-2 text-sm bg-gray-800/50 rounded-lg px-3 py-2">
                           <MapPinIcon className="w-4 h-4 text-gray-400" />
                           <span className="text-gray-300 font-medium truncate">
                             {theatre.address}
                           </span>
                         </div>
                       )}
                     </div>
                     
                     {/* Status Indicator */}
                     <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1">
                                               <motion.div 
                          className="w-2 h-2 bg-green-500 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                       <span className="text-xs text-green-400 font-medium">Active</span>
                     </div>
                   </div>

                   {/* Theatre Details */}
                   <div className="relative space-y-4">
                     {/* Room Types Available */}
                     {theatre.rooms && theatre.rooms.length > 0 && (
                       <div className="space-y-2">
                         <div className="flex items-center gap-2 text-xs text-gray-400">
                           <BuildingIcon className="w-3 h-3" />
                           <span>Available Formats:</span>
                         </div>
                         <div className="flex flex-wrap gap-2">
                           {(() => {
                             const roomTypes = [...new Set(theatre.rooms.map(room => room.type))];
                             return roomTypes.map((type, idx) => (
                                                               <motion.span 
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.2 + idx * 0.05, duration: 0.2 }}
                                 className={`text-xs px-2 py-1 rounded-full font-medium ${
                                   type === 'IMAX' 
                                     ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                     : type === '3D' 
                                     ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                     : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                                 }`}
                               >
                                 {type}
                               </motion.span>
                             ));
                           })()}
                         </div>
                       </div>
                     )}
                     
                     {/* Theatre Stats */}
                     <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                       <span className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-600">
                         Click to explore
                       </span>
                       
                       {/* Rating Display */}
                       {theatre.averageRating > 0 && (
                         <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1">
                           <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                           <span className="text-sm text-yellow-300 font-semibold">
                             {theatre.averageRating}/5
                           </span>
                           {theatre.reviewCount > 0 && (
                             <span className="text-xs text-yellow-400/70">
                               ({theatre.reviewCount})
                             </span>
                           )}
                         </div>
                       )}
                     </div>
                   </div>
                 </motion.div>
               ))}
             </motion.div>
           )}
         </AnimatePresence>
       </div>
     </motion.div>
   );
 };

export default Theatres; 