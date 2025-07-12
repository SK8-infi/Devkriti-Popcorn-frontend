import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon, MapPin, Heart } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'
import './Navbar.css'
import Dock from './Dock';
import ticket from '../assets/ticket.svg';
import heart from '../assets/heart.svg';
import notification from '../assets/notification.svg';
import robot from '../assets/robot.svg';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const Navbar = () => {

 const [isOpen, setIsOpen] = useState(false)
 const [showSearch, setShowSearch] = useState(false)
 const searchInputRef = React.useRef(null)
 const {user} = useUser()
 const {openSignIn} = useClerk()

 const navigate = useNavigate()

 const {favoriteMovies} = useAppContext()
 const [menuOpen, setMenuOpen] = useState(false);

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
            <Link onClick={()=> {window.scrollTo(0,0); setIsOpen(false)}} to='/' className='navbar-link'>Theaters</Link>
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
              <Link onClick={()=> {window.scrollTo(0,0); setIsOpen(false)}} to='/' className='navbar-link'>Theaters</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} style={{ display: 'inline-block' }}>
              <Link onClick={()=> {window.scrollTo(0,0); setIsOpen(false)}} to='/' className='navbar-link'>Contact Us</Link>
            </motion.div>
          </div>
        )}
        <div className='navbar-icons'>
          <motion.button whileHover={{ scale: 1.18 }} whileFocus={{ scale: 1.18 }} className='navbar-location-btn' title='Select Location'>
            <MapPin size={20}/>
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
