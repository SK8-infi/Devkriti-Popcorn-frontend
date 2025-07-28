import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon, MapPin, Heart } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'
import './Navbar.css'
import Dock from './Dock';
import ticket from '../assets/ticket.svg';
import heart from '../assets/heart.png';
import notification from '../assets/notification.svg';
import robot from '../assets/robot.svg';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const allowedCities = ["Delhi", "Mumbai", "Gwalior", "Indore", "Pune", "Chennai"];

const Navbar = () => {

 const [isOpen, setIsOpen] = useState(false)
 const [showSearch, setShowSearch] = useState(false)
 const searchInputRef = React.useRef(null)
 const {user} = useUser()
 const {openSignIn} = useClerk()

 const navigate = useNavigate()

 const {favoriteMovies} = useAppContext()
 const [menuOpen, setMenuOpen] = useState(false);

 // Location modal state
 const [showLocationModal, setShowLocationModal] = useState(false);
 const [userCity, setUserCity] = useState("");
 const [selectedCity, setSelectedCity] = useState("");
 const [loadingCity, setLoadingCity] = useState(false);
 const [savingCity, setSavingCity] = useState(false);
 const [cityError, setCityError] = useState("");
 const [searchQuery, setSearchQuery] = useState("");

 // Fetch user's city from backend
 useEffect(() => {
   if (user) {
     setLoadingCity(true);
     fetch(`/api/user/by-id/${user.id}`)
       .then(res => res.json())
       .then(data => {
         if (data.success && data.user && data.user.city) {
           setUserCity(data.user.city);
           setSelectedCity(data.user.city);
         } else {
           setUserCity("");
           setSelectedCity("");
         }
         setLoadingCity(false);
       })
       .catch(() => {
         setLoadingCity(false);
       });
   }
 }, [user]);

 // Handle city save
 const handleSaveCity = () => {
   if (!selectedCity) {
     setCityError("Please select a city.");
     return;
   }
   setSavingCity(true);
   fetch('/api/user/update-city', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ city: selectedCity }),
     credentials: 'include',
   })
     .then(res => res.json())
     .then(data => {
       if (data.success) {
         setUserCity(selectedCity);
         setShowLocationModal(false);
         setCityError("");
       } else {
         setCityError(data.message || "Failed to update city.");
       }
       setSavingCity(false);
     })
     .catch(() => {
       setCityError("Failed to update city.");
       setSavingCity(false);
     });
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
            <Link onClick={()=> {window.scrollTo(0,0); setIsOpen(false)}} to='/' className='navbar-link'>Contact Us</Link>
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
              <Link onClick={()=> {window.scrollTo(0,0); setIsOpen(false)}} to='/' className='navbar-link'>Contact Us</Link>
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
              !user ? (
                  <motion.button whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} onClick={openSignIn} className='navbar-login-btn'>Login</motion.button>
              ) : (
                  <UserButton>
                      <UserButton.MenuItems>
                          <UserButton.Action label="My Bookings" labelIcon={<TicketPlus width={15}/>} onClick={()=> navigate('/my-bookings')}/>
                      </UserButton.MenuItems>
                  </UserButton>
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
                <button onClick={handleSaveCity} disabled={savingCity} style={{ background: '#fbbf24', color: '#222', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 16, cursor: 'pointer', fontWeight: 600 }}>
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
