import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Film, Building2, MessageCircle, User } from 'lucide-react';
import './MobileBottomDock.css';

const MobileBottomDock = ({ onProfileClick }) => {
  const location = useLocation();

  const navItems = [
    {
      icon: <Home size={20} />,
      label: 'Home',
      path: '/',
      active: location.pathname === '/'
    },
    {
      icon: <Film size={20} />,
      label: 'Movies',
      path: '/movies',
      active: location.pathname === '/movies' || location.pathname.startsWith('/movies/')
    },
    {
      icon: <Building2 size={20} />,
      label: 'Theatres',
      path: '/theatres',
      active: location.pathname === '/theatres' || location.pathname.startsWith('/theatres/')
    },
    {
      icon: <MessageCircle size={20} />,
      label: 'Contact',
      path: '/contact',
      active: location.pathname === '/contact'
    },
    {
      icon: <User size={20} />,
      label: 'Profile',
      path: '#',
      active: false,
      onClick: onProfileClick
    }
  ];

  const itemVariants = {
    hover: {
      scale: 1.1,
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      className="mobile-bottom-dock"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <div className="mobile-bottom-dock-content">
        {navItems.map((item, index) => (
          <motion.div
            key={item.label}
            className={`mobile-bottom-dock-item ${item.active ? 'active' : ''}`}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className="mobile-bottom-dock-button"
                aria-label={item.label}
              >
                <div className="mobile-bottom-dock-icon">
                  {item.icon}
                </div>
                <span className="mobile-bottom-dock-label">{item.label}</span>
              </button>
            ) : (
              <Link
                to={item.path}
                className="mobile-bottom-dock-link"
                onClick={() => window.scrollTo(0, 0)}
              >
                <div className="mobile-bottom-dock-icon">
                  {item.icon}
                </div>
                <span className="mobile-bottom-dock-label">{item.label}</span>
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MobileBottomDock;
