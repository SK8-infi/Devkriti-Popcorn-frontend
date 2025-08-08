import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon, BarChart3, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { getUserImage } from '../../utils/imageUtils'
import TheatreSettingsModal from './TheatreSettingsModal'

const AdminSubNavbar = () => {
    const { user } = useAppContext();
    const [showTheatreSettings, setShowTheatreSettings] = useState(false);
    
    // Use full name instead of just first name
    const displayName = user?.name || 'Admin User';
    
    // Use the image utility for proper image handling
    const userImage = getUserImage(user);

    const adminNavlinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
        { name: 'Listed Shows', path: '/admin/list-shows', icon: ListIcon },
        { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon },
        { name: 'Manage Rooms', path: '/admin/manage-rooms', icon: ListCollapseIcon },
        { name: 'Theatre Analytics', path: '/admin/theatre-analytics', icon: TrendingUp },
        { name: 'Review Analytics', path: '/admin/review-analytics', icon: BarChart3 },
    ]

  return (
    <>
      <div className='w-full bg-black/70 border-b border-gray-300/20 text-sm text-white px-4 py-3'>
        <div className='flex items-center justify-between'>
          {/* Navigation Links */}
          <div className='flex items-center space-x-6'>
            {adminNavlinks.map((link, index) => (
              <NavLink 
                key={index} 
                to={link.path} 
                end 
                className={({ isActive }) => `group relative flex items-center gap-2 py-2 px-3 text-white transition-all duration-200 ease-in-out transform bg-transparent hover:bg-white/80 hover:text-black rounded-lg ${isActive && 'bg-primary/15 text-primary'}`}
              >
                {({ isActive }) => (
                  <>
                    <link.icon className="w-4 h-4 text-white transition-all duration-200 group-hover:text-black" />
                    <span className="text-white transition-all duration-200 group-hover:text-black font-medium">{link.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* User Profile Section */}
          <div className='flex items-center space-x-3'>
            <span className='text-white text-sm hidden md:block'>{displayName}</span>
            {userImage.hasImage ? (
              <img 
                className='h-8 w-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity' 
                src={userImage.url} 
                alt="Admin Profile" 
                onClick={() => setShowTheatreSettings(true)}
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
                title="Click to edit theatre settings"
              />
            ) : null}
            {!userImage.hasImage && (
              <div 
                className='h-8 w-8 rounded-full cursor-pointer hover:opacity-80 transition-opacity bg-gray-300 flex items-center justify-center'
                onClick={() => setShowTheatreSettings(true)}
                title="Click to edit theatre settings"
              >
                <span className="text-xs font-medium text-gray-700">
                  {userImage.fallback}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Theatre Settings Modal */}
      <TheatreSettingsModal 
        isOpen={showTheatreSettings} 
        onClose={() => setShowTheatreSettings(false)} 
      />
    </>
  )
}

export default AdminSubNavbar 