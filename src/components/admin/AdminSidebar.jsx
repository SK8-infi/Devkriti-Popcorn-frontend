import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'

const AdminSidebar = () => {

    const { user } = useAppContext();
    const firstName = user?.firstName || 'Admin';
    const lastName = user?.lastName || 'User';
    const imageUrl = user?.imageUrl || assets.profile;

    const adminNavlinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
        { name: 'Listed Shows', path: '/admin/list-shows', icon: ListIcon },
        { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon },
        { name: 'Theatre Layout', path: '/admin/update-layout', icon: LayoutDashboardIcon },
        { name: 'Manage Rooms', path: '/admin/manage-rooms', icon: ListCollapseIcon },
    ]

  return (
    <div className='h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-gray-300/20 text-sm text-white bg-black/70'>
      <img className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto' src={imageUrl} alt="sidebar" />
      <p className='mt-2 text-base max-md:hidden text-white'>{firstName} {lastName}</p>
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
  )
}

export default AdminSidebar
