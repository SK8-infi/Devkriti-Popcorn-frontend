import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import MobileSideMenu from './MobileSideMenu';
import MobileBottomDock from './MobileBottomDock';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAppContext();
  const [isMobileSideMenuOpen, setIsMobileSideMenuOpen] = useState(false);

  const handleProfileClick = () => {
    setIsMobileSideMenuOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsMobileSideMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <MobileSideMenu 
        isOpen={isMobileSideMenuOpen} 
        onClose={() => setIsMobileSideMenuOpen(false)} 
      />
      <MobileBottomDock onProfileClick={handleProfileClick} />
    </>
  );
};

export default MobileNavigation;
