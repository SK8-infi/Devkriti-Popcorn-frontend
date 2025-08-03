import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from 'lucide-react'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import { getUserImage } from '../../utils/imageUtils'
import TheatreSettingsModal from './TheatreSettingsModal'

const AdminSidebar = () => {
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
    ]

  return (
    <>
      <div className='h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm text-white bg-black/70'>
        {userImage.hasImage ? (
          <img 
            className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto cursor-pointer hover:opacity-80 transition-opacity' 
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
            className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto cursor-pointer hover:opacity-80 transition-opacity bg-gray-300 flex items-center justify-center'
            onClick={() => setShowTheatreSettings(true)}
            title="Click to edit theatre settings"
          >
            <span className="text-sm font-medium text-gray-700">
              {userImage.fallback}
            </span>
          </div>
        )}
        <p className='mt-2 text-base max-md:hidden text-white text-center px-2'>{displayName}</p>
        <div className='w-full'>
          {adminNavlinks.map((link, index)=>(
              <NavLink key={index} to={link.path} end className={({ isActive }) => `group relative flex items-center max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-white transition-all duration-200 ease-in-out transform bg-transparent hover:bg-white/80 hover:text-black hover:scale-[1.04] hover:shadow-lg ${isActive && 'bg-primary/15 text-primary'}`}>
                  {({ isActive })=>(
                      <>
                          <link.icon className="w-5 h-5 text-white transition-all duration-200 group-hover:text-black" />
                          <p className="max-md:hidden text-white transition-all duration-200 group-hover:text-black">{link.name}</p>
                          <span className={`w-1.5 h-10 rounded-l right-0 absolute ${isActive && 'bg-primary'}`} />
                      </>
                  )}
              </NavLink>
          ))}
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

export default AdminSidebar
