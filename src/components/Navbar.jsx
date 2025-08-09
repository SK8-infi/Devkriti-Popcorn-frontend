import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon, MapPin, Heart, User, LogOut, Star } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import './Navbar.css'
import Dock from './Dock';
import ticket from '../assets/ticket.svg';
import heart from '../assets/heart.png';
import notification from '../assets/notification.svg';
import robot from '../assets/robot.svg';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
import { getUserImage } from '../utils/imageUtils';

const allowedCities = ["Delhi", "Mumbai", "Gwalior", "Indore", "Pune", "Chennai"];

const Navbar = () => {

 const [isOpen, setIsOpen] = useState(false)
 const [showSearch, setShowSearch] = useState(false)
 const searchInputRef = React.useRef(null)
 const { user, isAuthenticated, login, logout, setUserCity: setContextUserCity } = useAppContext()

 const navigate = useNavigate()
 const location = useLocation()
 const isHomePage = location.pathname === '/'

 const [menuOpen, setMenuOpen] = useState(false);

 // Location modal state
 const [showLocationModal, setShowLocationModal] = useState(false);
 const [userCity, setUserCity] = useState("");
 const [selectedCity, setSelectedCity] = useState("");
 const [loadingCity, setLoadingCity] = useState(false);
 const [savingCity, setSavingCity] = useState(false);
 const [cityError, setCityError] = useState("");
 const [searchQuery, setSearchQuery] = useState("");

// User dropdown state
const [showUserDropdown, setShowUserDropdown] = useState(false);

// Fetch user's city from backend or localStorage
 useEffect(() => {
  const savedCity = localStorage.getItem('userCity');
  if (savedCity) {
    setUserCity(savedCity);
    setSelectedCity(savedCity);
  }

  // If user is authenticated, fetch from backend
  if (user && user._id) {
    setLoadingCity(true);

    fetch(`/api/user/by-id/${user._id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success && data.user && data.user.city) {
          setUserCity(data.user.city);
          setSelectedCity(data.user.city);
          localStorage.setItem('userCity', data.user.city);
        } else if (!savedCity) {
          setUserCity("");
          setSelectedCity("");
        }
        setLoadingCity(false);
      })
      .catch((error) => {
        console.error('Error fetching user city:', error);
        setLoadingCity(false);
        // Don't show error to user for this background fetch
      });
  } else {
    setLoadingCity(false);
  }
 }, [user]);

 // Handle city save
const handleSaveCity = async () => {
   if (!selectedCity) {
     setCityError("Please select a city.");
     return;
   }

   setSavingCity(true);

  if (!user) {
    // Non-authenticated user: store in localStorage and send to public API
    localStorage.setItem('userCity', selectedCity);
    setUserCity(selectedCity);
    setContextUserCity(selectedCity); // Update context

    try {
      await fetch('/api/user/city/public', {
     method: 'PUT',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ city: selectedCity }),
      });
    } catch (error) {
      // Backend failed — we already saved locally
    }

    setShowLocationModal(false);
    setCityError("");
    setSavingCity(false);
    
    // Refresh page to update content
    window.location.reload();
    return;
  }

  // Authenticated user: update via secured API
  try {
    const response = await fetch('/api/user/city', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify({ city: selectedCity }),
    });

    const data = await response.json();

       if (data.success) {
         setUserCity(selectedCity);
         setContextUserCity(selectedCity); // Update context
         localStorage.setItem('userCity', selectedCity);
         setShowLocationModal(false);
         setCityError("");
         
         // Refresh page to update content
         window.location.reload();
       } else {
         setCityError(data.message || "Failed to update city.");
       }
  } catch (error) {
       setCityError("Failed to update city.");
  } finally {
       setSavingCity(false);
  }
};


 const handleLogin = () => {
   login();
 };

 const handleLogout = () => {
   logout();
   setShowUserDropdown(false);
   navigate('/');
 };

  return (
    <div className='navbar'>
      <div className='navbar-content' style={{width: '100%'}}>
        <Link to='/' className='navbar-logo-link'>
          <img src={logo} alt="Popcorn Logo" className='navbar-logo'/>
        </Link>
        {/* Desktop Menu */}
        <div className={`navbar-menu${isOpen ? ' open' : ''}`} style={{ display: window.innerWidth > 700 ? 'flex' : 'none' }}>
          <XIcon className='navbar-close-icon' onClick={()=> setIsOpen(false)}/>
          <motion.div whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} style={{ display: 'inline-block' }}>
            <Link onClick={()=> {window.scrollTo(0,0); setIsOpen(false)}} to='/' className='navbar-link'>Home</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} style={{ display: 'inline-block' }}>
            <Link onClick={()=> {window.scrollTo(0,0); setIsOpen(false)}} to='/movies' className='navbar-link'>Movies</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} style={{ display: 'inline-block' }}>
            <Link onClick={()=> {window.scrollTo(0,0); setIsOpen(false)}} to='/theatres' className='navbar-link'>Theatres</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} style={{ display: 'inline-block' }}>
            <Link onClick={()=> {window.scrollTo(0,0); setIsOpen(false)}} to='/contact' className='navbar-link'>Contact Us</Link>
          </motion.div>
        </div>
        {/* Mobile Menu */}
        {window.innerWidth <= 700 && (
          <div className={`navbar-menu${isOpen ? ' open' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
            <XIcon className='navbar-close-icon' onClick={()=> setIsOpen(false)}/>
            <motion.div whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} style={{ display: 'inline-block' }}>
              <Link onClick={()=> {window.scrollTo(0,0); setIsOpen(false)}} to='/' className='navbar-link'>Home</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} style={{ display: 'inline-block' }}>
              <Link onClick={()=> {window.scrollTo(0,0); setIsOpen(false)}} to='/movies' className='navbar-link'>Movies</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} style={{ display: 'inline-block' }}>
              <Link onClick={()=> {window.scrollTo(0,0); setIsOpen(false)}} to='/theatres' className='navbar-link'>Theatres</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} style={{ display: 'inline-block' }}>
              <Link onClick={()=> {window.scrollTo(0,0); setIsOpen(false)}} to='/contact' className='navbar-link'>Contact Us</Link>
            </motion.div>
          </div>
        )}
        <div className='navbar-icons'>
          {isHomePage && (
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileFocus={{ scale: 1.05 }} 
              className='navbar-location-btn-new' 
              title='Select Location' 
              onClick={() => setShowLocationModal(true)} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6,
                background: 'linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 12px',
                color: '#000',
                fontWeight: '600',
                fontSize: '12px',
                boxShadow: '0 2px 6px rgba(255, 214, 160, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                minWidth: 'fit-content',
                whiteSpace: 'nowrap',
                width: 'auto',
                height: 'auto'
              }}
            >
              <MapPin size={16} color="#000"/>
              <span>{userCity || 'Select City'}</span>
            </motion.button>
          )}
          <motion.button whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} className='navbar-location-btn' title='Search' onClick={() => {
            setShowSearch((prev) => !prev);
            setTimeout(() => { if (searchInputRef.current) searchInputRef.current.focus(); }, 100);
          }}>
            <SearchIcon size={20}/>
          </motion.button>
          {showSearch && (
            <input
              ref={searchInputRef}
              type='text'
              className='navbar-search-input'
              placeholder='Search movies...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
                  setShowSearch(false);
                  setSearchQuery("");
                }
              }}
              style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem', borderRadius: '9999px', border: 'none', outline: 'none', fontSize: '0.85rem', minWidth: '140px' }}
            />
          )}
          {
              !isAuthenticated ? (
                  <div style={{ position: 'relative' }}>
                    <motion.button 
                      whileHover={{ scale: 1.18 }} 
                      whileFocus={{ scale: 1.18 }} 
                      onClick={() => setShowUserDropdown(!showUserDropdown)} 
                      className='navbar-login-btn'
                    >
                      Login
                    </motion.button>
                    {showUserDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        background: '#000',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        padding: '8px 0',
                        minWidth: '150px',
                        zIndex: 1000,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}>
                        <button
                          onClick={handleLogin}
                          style={{
                            width: '100%',
                            padding: '8px 16px',
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: 16, height: 16 }} />
                          Login with Google
                        </button>
                      </div>
                    )}
                  </div>
              ) : (
                  <div style={{ position: 'relative' }}>
                    <motion.button 
                      whileHover={{ scale: 1.18 }} 
                      whileFocus={{ scale: 1.18 }} 
                      onClick={() => setShowUserDropdown(!showUserDropdown)} 
                      className='navbar-user-btn'
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {(() => {
                        const userImage = getUserImage(user);
                        return (
                          <>
                            {userImage.hasImage ? (
                              <img 
                                src={userImage.url} 
                                alt={user.name} 
                                style={{ 
                                  width: 32, 
                                  height: 32, 
                                  borderRadius: '50%',
                                  objectFit: 'cover'
                                }} 
                                onError={(e) => {
                                  // If it's a Google image and we have a fallback URL, try that first
                                  if (userImage.isGoogleImage && userImage.fallbackUrl) {
                                    e.target.src = userImage.fallbackUrl;
                                    return;
                                  }
                                  // Otherwise, hide the image and show the fallback
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            {!userImage.hasImage && (
                              <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: '#FFD6A0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#232323'
                              }}>
                                {userImage.fallback}
                              </div>
                            )}
                          </>
                        );
                      })()}
                      <span style={{ fontSize: 14 }}>{user?.name}</span>
                    </motion.button>
                    {showUserDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        background: '#000',
                        border: '1px solid #333',
                        borderRadius: '8px',
                        padding: '8px 0',
                        minWidth: '180px',
                        zIndex: 1000,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}>
                        <button
                          onClick={() => { navigate('/my-bookings'); setShowUserDropdown(false); }}
                          style={{
                            width: '100%',
                            padding: '8px 16px',
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <TicketPlus size={16} />
                          My Bookings
                        </button>
                        <button
                          onClick={() => { navigate('/favorite'); setShowUserDropdown(false); }}
                          style={{
                            width: '100%',
                            padding: '8px 16px',
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <Heart size={16} />
                          Favorites
                        </button>
                        <button
                          onClick={() => { navigate('/my-reviews'); setShowUserDropdown(false); }}
                          style={{
                            width: '100%',
                            padding: '8px 16px',
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <Star size={16} />
                          My Reviews
                        </button>
                        <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #333' }} />
                        <button
                          onClick={handleLogout}
                          style={{
                            width: '100%',
                            padding: '8px 16px',
                            background: 'none',
                            border: 'none',
                            color: '#ff4444',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
              )
          }
        </div>
      </div>
      {/* Location Modal */}
      {showLocationModal && (
        <div
          className="location-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            className="location-modal"
            style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
              borderRadius: 20,
              padding: 40,
              minWidth: 400,
              maxWidth: 500,
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              position: 'relative',
              border: '1px solid rgba(255, 214, 160, 0.2)'
            }}
          >
            <button
              onClick={() => setShowLocationModal(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#FFD6A0',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 214, 160, 0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              <XIcon size={16} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{
                background: 'linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)',
                borderRadius: '50%',
                padding: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin size={20} color="#000" />
              </div>
              <h2 style={{ 
                margin: 0, 
                color: '#FFD6A0', 
                fontSize: 20, 
                fontWeight: '600' 
              }}>Select Your City</h2>
            </div>
            {loadingCity ? (
              <div>Loading...</div>
            ) : (
              <>
                <select 
                  value={selectedCity} 
                  onChange={e => { setSelectedCity(e.target.value); setCityError(""); }} 
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px', 
                    borderRadius: 12, 
                    border: '2px solid rgba(255, 214, 160, 0.3)', 
                    fontSize: 16, 
                    marginBottom: 20, 
                    background: 'rgba(255, 255, 255, 0.05)', 
                    color: '#fff',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#FFD6A0'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 214, 160, 0.3)'}
                >
                  <option value="" style={{ background: '#1a1a1a', color: '#fff' }}>-- Select City --</option>
                  {allowedCities.map(city => (
                    <option key={city} value={city} style={{ background: '#1a1a1a', color: '#fff' }}>{city}</option>
                  ))}
                </select>
                {cityError && (
                  <div style={{ 
                    color: '#ff6b6b', 
                    marginBottom: 16, 
                    fontSize: 14, 
                    padding: '8px 12px',
                    background: 'rgba(255, 107, 107, 0.1)',
                    borderRadius: 8,
                    border: '1px solid rgba(255, 107, 107, 0.3)'
                  }}>{cityError}</div>
                )}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => setShowLocationModal(false)} 
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      color: '#fff', 
                      border: '2px solid rgba(255, 255, 255, 0.2)', 
                      borderRadius: 12, 
                      padding: '12px 24px', 
                      fontSize: 16, 
                      cursor: 'pointer', 
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveCity} 
                    disabled={savingCity} 
                    style={{ 
                      background: savingCity ? 'rgba(255, 214, 160, 0.6)' : 'linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)', 
                      color: '#000', 
                      border: 'none', 
                      borderRadius: 12, 
                      padding: '12px 24px', 
                      fontSize: 16, 
                      cursor: savingCity ? 'not-allowed' : 'pointer', 
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: savingCity ? 'none' : '0 4px 15px rgba(255, 214, 160, 0.4)',
                      transform: savingCity ? 'none' : 'scale(1)',
                      opacity: savingCity ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!savingCity) {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 6px 20px rgba(255, 214, 160, 0.6)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!savingCity) {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 15px rgba(255, 214, 160, 0.4)';
                      }
                    }}
                  >
                    {savingCity ? 'Saving...' : 'Save Location'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {/* Add Dock component for Notification and Ask AI */}
      <Dock
        items={[
          {
            icon: <img src={ticket} alt="My Bookings" style={{ width: 32, height: 32 }} />, label: 'My Bookings', onClick: () => navigate('/my-bookings'),
          },
          {
            icon: <img src={heart} alt="Favourites" style={{ width: 32, height: 32 }} />, label: 'Favourites', onClick: () => navigate('/favorite'),
          },
          {
            icon: <img src={notification} alt="Notifications" style={{ width: 32, height: 32 }} />, label: 'Notifications', onClick: () => navigate('/notifications'),
          },
          {
            icon: <img src={robot} alt="Ask AI" style={{ width: 32, height: 32 }} />, label: 'Ask AI', onClick: () => navigate('/ask-ai'),
          },
        ]}
      />
    </div>
  )
}

export default Navbar
