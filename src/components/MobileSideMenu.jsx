import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { X, User, Heart, Bell, Bot, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getUserImage } from '../utils/imageUtils';
import './MobileSideMenu.css';

const MobileSideMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAppContext();
  
  // Use the image utility for proper image handling
  const userImage = getUserImage(user);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  const menuItems = [
    {
      icon: <User size={20} />,
      label: 'My Bookings',
      path: '/my-bookings',
      requiresAuth: true
    },
    {
      icon: <Heart size={20} />,
      label: 'Favourites',
      path: '/favorite',
      requiresAuth: true
    },
    {
      icon: <Bell size={20} />,
      label: 'Notifications',
      path: '/notifications',
      requiresAuth: true
    },
    {
      icon: <Bot size={20} />,
      label: 'Ask AI',
      path: '/ask-ai',
      requiresAuth: false
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="mobile-side-menu-backdrop"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />
          
          {/* Menu */}
          <motion.div
            className="mobile-side-menu"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header */}
            <div className="mobile-side-menu-header">
              <div className="mobile-side-menu-user-info">
                <div className="mobile-side-menu-avatar">
                  {userImage.hasImage ? (
                    <img
                      src={userImage.url}
                      alt={user?.name || 'User'}
                      className="mobile-side-menu-avatar-image"
                      onError={(e) => {
                        // If it's a Google image and we have a fallback URL, try that first
                        if (userImage.isGoogleImage && userImage.fallbackUrl) {
                          e.target.src = userImage.fallbackUrl;
                        } else {
                          // Otherwise, hide the image and show the fallback
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  {!userImage.hasImage && (
                    <div className="mobile-side-menu-avatar-fallback">
                      {userImage.fallback}
                    </div>
                  )}
                </div>
                <div className="mobile-side-menu-user-details">
                  <h3>{user?.name || 'Guest User'}</h3>
                  <p>{user?.email || 'Sign in to access your account'}</p>
                </div>
              </div>
              <button className="mobile-side-menu-close" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            {/* Menu Items */}
            <div className="mobile-side-menu-items">
              {menuItems.map((item, index) => {
                if (item.requiresAuth && !isAuthenticated) return null;
                
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className="mobile-side-menu-item"
                      onClick={onClose}
                    >
                      <div className="mobile-side-menu-item-icon">
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Logout Button */}
            {isAuthenticated && (
              <motion.div
                className="mobile-side-menu-logout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button onClick={handleLogout} className="mobile-side-menu-logout-btn">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSideMenu;
