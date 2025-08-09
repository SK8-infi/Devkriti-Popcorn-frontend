import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Film, Building2, Phone, User, Heart, Bell } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import useResponsive from '../hooks/useResponsive';

const BottomNavigation = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAppContext();
  const { isTinyMobile, isSmallMobile } = useResponsive();

  // Only show for mobile devices
  if (!isTinyMobile && !isSmallMobile) {
    return null;
  }

  const navItems = [
    {
      name: 'Home',
      icon: Home,
      path: '/',
      color: '#FFD6A0'
    },
    {
      name: 'Movies',
      icon: Film,
      path: '/movies',
      color: '#FFD6A0'
    },
    {
      name: 'Theatres',
      icon: Building2,
      path: '/theatres',
      color: '#FFD6A0'
    },
    {
      name: 'Contact',
      icon: Phone,
      path: '/contact',
      color: '#FFD6A0'
    }
  ];

  const userItems = [
    {
      name: 'Profile',
      icon: User,
      path: '/my-bookings',
      color: '#FFD6A0',
      requireAuth: true
    },
    {
      name: 'Favorites',
      icon: Heart,
      path: '/favorite',
      color: '#FFD6A0',
      requireAuth: true
    },
    {
      name: 'Notifications',
      icon: Bell,
      path: '/notifications',
      color: '#FFD6A0',
      requireAuth: true
    }
  ];

  const allItems = [...navItems, ...userItems];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid #333',
        padding: '8px 0',
        paddingBottom: 'calc(8px + env(safe-area-inset-bottom))'
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '100%',
        padding: '0 16px'
      }}>
        {allItems.map((item) => {
          // Skip auth-required items if user is not authenticated
          if (item.requireAuth && !isAuthenticated) {
            return null;
          }

          const isActive = location.pathname === item.path;
          const IconComponent = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => window.scrollTo(0, 0)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 12px',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? item.color : '#fff',
                transition: 'all 0.3s ease',
                minWidth: '60px',
                minHeight: '60px'
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <IconComponent 
                  size={isTinyMobile ? 20 : 22} 
                  color={isActive ? item.color : '#fff'}
                />
                <span style={{
                  fontSize: isTinyMobile ? '10px' : '11px',
                  fontWeight: isActive ? '600' : '400',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  {item.name}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNavigation;
