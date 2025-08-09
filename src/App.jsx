import React from 'react'
import Navbar from './components/Navbar'
<<<<<<< Updated upstream
import { Route, Routes, useLocation } from 'react-router-dom'
=======
import BottomNavigation from './components/BottomNavigation'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
>>>>>>> Stashed changes
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import Notifications from './pages/Notifications'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import UpdateLayout from './pages/admin/UpdateLayout'
import { useAppContext } from './context/AppContext'
import { SignIn } from '@clerk/clerk-react'
import Loading from './components/Loading'

const App = () => {

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';

  const { user } = useAppContext()

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/movies' element={<Movies/>} />
        <Route path='/movies/:id' element={<MovieDetails/>} />
        <Route path='/movies/:id/:date' element={<SeatLayout/>} />
        <Route path='/my-bookings' element={<MyBookings/>} />
        <Route path='/loading/:nextUrl' element={<Loading/>} />

        <Route path='/favorite' element={<Favorite/>} />
        <Route path='/notifications' element={<Notifications/>} />
        <Route path='/admin/*' element={user ? <Layout/> : (
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl={'/admin'} />
          </div>
        )}>
          <Route index element={<Dashboard/>}/>
          <Route path="add-shows" element={<AddShows/>}/>
          <Route path="list-shows" element={<ListShows/>}/>
          <Route path="update-layout" element={<UpdateLayout/>}/>
        </Route>
      </Routes>
      {/* Render Footer on all pages except the homepage */}
      {!isAdminRoute && !isHome && <Footer />}
      
      {/* Bottom Navigation for Mobile */}
      {!isAdminRoute && <BottomNavigation />}
    </>
  )
}

export default App
