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
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Navbar = () => {

 const [isOpen, setIsOpen] = useState(false)
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

// User dropdown state
const [showUserDropdown, setShowUserDropdown] = useState(false);

// Handle authenticated navigation
const handleAuthenticatedNavigation = (path) => {
  if (!isAuthenticated) {
    login();
    return;
  }
  navigate(path);
};


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

    fetch(`${API_URL}/api/user/by-id/${user._id}`)
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
      await fetch(`${API_URL}/api/user/city/public`, {
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
    const response = await fetch(`${API_URL}/api/user/city`, {
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

  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className='navbar'>
      <div className='navbar-content' style={{width: '100%'}}>
        <Link to='/' className='navbar-logo-link'>
          <img src={logo} alt="Popcorn Logo" className='navbar-logo'/>
        </Link>
        {/* Desktop Menu */}
        <div className='navbar-menu desktop-menu'>
          <motion.div whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} style={{ display: 'inline-block' }}>
            <Link onClick={()=> {window.scrollTo(0,0); closeMobileMenu()}} to='/' className='navbar-link'>Home</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} style={{ display: 'inline-block' }}>
            <Link onClick={()=> {window.scrollTo(0,0); closeMobileMenu()}} to='/movies' className='navbar-link'>Movies</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} style={{ display: 'inline-block' }}>
            <Link onClick={()=> {window.scrollTo(0,0); closeMobileMenu()}} to='/theatres' className='navbar-link'>Theatres</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} style={{ display: 'inline-block' }}>
            <Link onClick={()=> {window.scrollTo(0,0); closeMobileMenu()}} to='/contact' className='navbar-link'>Contact Us</Link>
          </motion.div>
        </div>
        
        {/* Hamburger Menu Button */}
        <button
          className='mobile-menu-button'
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {menuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
        
        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <div className='mobile-menu-links'>
            <Link onClick={()=> {window.scrollTo(0,0); closeMobileMenu()}} to='/' className='mobile-nav-link'>Home</Link>
            <Link onClick={()=> {window.scrollTo(0,0); closeMobileMenu()}} to='/movies' className='mobile-nav-link'>Movies</Link>
            <Link onClick={()=> {window.scrollTo(0,0); closeMobileMenu()}} to='/theatres' className='mobile-nav-link'>Theatres</Link>
            <Link onClick={()=> {window.scrollTo(0,0); closeMobileMenu()}} to='/contact' className='mobile-nav-link'>Contact Us</Link>
          </div>
        </div>
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
          <motion.button whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} className='navbar-location-btn' title='Search Movies' onClick={() => {
            navigate('/movies?showFilters=true');
          }}>
            <SearchIcon size={20}/>
          </motion.button>
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
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease-out'
          }}
          onClick={(e) => e.target === e.currentTarget && setShowLocationModal(false)}
        >
          <div
            className="location-modal"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              backgroundImage: 'url("/bg-4.svg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '24px',
              minWidth: '320px',
              maxWidth: '380px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
              position: 'relative',
              border: '1px solid rgba(255, 214, 160, 0.3)',
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            <button
              onClick={() => setShowLocationModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(75, 85, 99, 0.5)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#9CA3AF',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                e.target.style.color = '#EF4444';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(75, 85, 99, 0.5)';
                e.target.style.color = '#9CA3AF';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <XIcon size={16} />
            </button>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              gap: '6px', 
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div>
                <h2 style={{ 
                  margin: 0, 
                  color: '#F9FAFB', 
                  fontSize: '20px', 
                  fontWeight: '700',
                  fontFamily: 'Times New Roman, Times, serif',
                  marginBottom: '4px'
                }}>Select Your City</h2>
                <p style={{
                  margin: 0,
                  color: '#9CA3AF',
                  fontSize: '13px',
                  fontWeight: '400'
                }}>Choose your location to find nearby shows</p>
              </div>
            </div>
            {loadingCity ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                color: '#9CA3AF'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255, 214, 160, 0.3)',
                  borderTop: '2px solid #FFD6A0',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '12px'
                }}></div>
                Loading locations...
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    color: '#F3F4F6',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>City</label>
                  <select 
                    value={selectedCity} 
                    onChange={e => { setSelectedCity(e.target.value); setCityError(""); }} 
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(75, 85, 99, 0.6)', 
                      fontSize: '15px', 
                      background: '#000000', 
                      color: '#F9FAFB',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      backdropFilter: 'blur(10px)',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FFD6A0';
                      e.target.style.boxShadow = '0 0 0 3px rgba(255, 214, 160, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(75, 85, 99, 0.6)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <option value="" style={{ background: '#1F2937', color: '#9CA3AF' }}>Choose your city...</option>
                    {allowedCities.map(city => (
                      <option key={city} value={city} style={{ background: '#1F2937', color: '#F9FAFB', padding: '8px' }}>{city}</option>
                    ))}
                  </select>
                </div>
                {cityError && (
                  <div style={{ 
                    color: '#F87171', 
                    marginBottom: '20px', 
                    fontSize: '14px', 
                    padding: '12px 16px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>!</div>
                    {cityError}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <button 
                    onClick={handleSaveCity} 
                    disabled={savingCity} 
                    style={{ 
                      background: savingCity ? 'rgba(255, 214, 160, 0.5)' : 'linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)', 
                      color: '#000', 
                      border: 'none', 
                      borderRadius: '12px', 
                      padding: '12px 32px', 
                      fontSize: '15px', 
                      cursor: savingCity ? 'not-allowed' : 'pointer', 
                      fontWeight: '700',
                      transition: 'all 0.2s ease',
                      boxShadow: 'none',
                      transform: savingCity ? 'none' : 'translateY(0)',
                      opacity: savingCity ? 0.7 : 1,
                      minWidth: '160px'
                    }}
                    onMouseEnter={(e) => {
                      if (!savingCity) {
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!savingCity) {
                        e.target.style.transform = 'translateY(0)';
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
            icon: <img src={ticket} alt="My Bookings" style={{ width: 32, height: 32 }} />, label: 'My Bookings', onClick: () => handleAuthenticatedNavigation('/my-bookings'),
          },
          {
            icon: <img src={heart} alt="Favourites" style={{ width: 32, height: 32 }} />, label: 'Favourites', onClick: () => handleAuthenticatedNavigation('/favorite'),
          },
          {
            icon: <img src={notification} alt="Notifications" style={{ width: 32, height: 32 }} />, label: 'Notifications', onClick: () => handleAuthenticatedNavigation('/notifications'),
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
