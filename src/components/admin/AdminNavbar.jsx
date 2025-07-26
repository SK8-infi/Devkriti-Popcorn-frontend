import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { assets } from '../../assets/assets'

const pathTitleMap = {
  '/admin/list-bookings': 'List Bookings',
  '/admin/list-shows': 'Listed Shows',
  '/admin/add-shows': 'Add Shows',
  '/admin': 'Admin Dashboard',
}

const AdminNavbar = () => {
  const location = useLocation();
  // Match the longest path first
  const currentPath = Object.keys(pathTitleMap)
    .sort((a, b) => b.length - a.length)
    .find((path) => location.pathname === path || location.pathname.startsWith(path + '/'));
  const title = currentPath ? pathTitleMap[currentPath] : '';

  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-gray-300/30 relative bg-black/70'>
      <Link to="/">
        <img src={assets.logo} alt="logo" className="w-36 h-auto hidden xs:block sm:block md:block lg:block xl:block" style={{ display: window.innerWidth < 500 ? 'none' : undefined }} />
      </Link>
      {/* Right-justified Title */}
      {title && (
        <div className="flex-1 flex justify-end items-center h-full">
          <span className="text-base uppercase tracking-wide text-white text-right select-none">
            {title}
          </span>
        </div>
      )}
    </div>
  )
}

export default AdminNavbar
