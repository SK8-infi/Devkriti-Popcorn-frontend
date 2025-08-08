import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon, MapPin, Heart, User, LogOut } from 'lucide-react'
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
 const { user, isAuthenticated, login, logout } = useAppContext()

 const navigate = useNavigate()

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
      localStorage.setItem('userCity', selectedCity);
         setShowLocationModal(false);
         setCityError("");
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
          <motion.button whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} className='navbar-location-btn' title='Select Location' onClick={() => setShowLocationModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={20}/>
            {userCity && <span style={{ marginLeft: 6, fontSize: 14, display: 'flex', alignItems: 'center', height: 20 }}>{userCity}</span>}
          </motion.button>
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
              background: '#000',
              borderRadius: 12,
              padding: 32,
              minWidth: 320,
              boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowLocationModal(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: '#000',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer'
              }}
            >
              <XIcon />
            </button>
            <h2 style={{ marginBottom: 16 }}>Select Your City</h2>
            {loadingCity ? (
              <div>Loading...</div>
            ) : (
              <>
                <select value={selectedCity} onChange={e => { setSelectedCity(e.target.value); setCityError(""); }} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16, marginBottom: 16, background: '#000', color: '#fff' }}>
                  <option value="" style={{ background: '#000', color: '#fff' }}>-- Select City --</option>
                  {allowedCities.map(city => (
                    <option key={city} value={city} style={{ background: '#000', color: '#fff' }}>{city}</option>
                  ))}
                </select>
                {cityError && <div style={{ color: 'red', marginBottom: 8 }}>{cityError}</div>}
                                 <button onClick={handleSaveCity} disabled={savingCity} style={{ background: '#FFD6A0', color: '#222', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 16, cursor: 'pointer', fontWeight: 600 }}>
                  {savingCity ? 'Saving...' : 'Save'}
                </button>
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
