import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
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
import Loading from './components/Loading'
import Theatres from './pages/Theatres';
import Theatre from './pages/Theatre';
import ManageRooms from './pages/admin/ManageRooms';
import ManageUsers from './pages/admin/ManageUsers';

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false, requireAdAccess = false }) => {
  const { user, isAuthenticated, isAdmin, hasAdAccess, loading } = useAppContext();

  if (loading) {
    return <Loading />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireAdAccess && !hasAdAccess) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

const App = () => {

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/movies' element={<Movies/>} />
        <Route path='/movies/:id' element={<MovieDetails/>} />
        <Route path='/movies/:id/:date' element={<SeatLayout/>} />
        <Route path='/my-bookings' element={
          <ProtectedRoute>
            <MyBookings/>
          </ProtectedRoute>
        } />
        <Route path='/loading/:nextUrl' element={<Loading/>} />
        <Route path='/favorite' element={
          <ProtectedRoute>
            <Favorite/>
          </ProtectedRoute>
        } />
        <Route path='/notifications' element={
          <ProtectedRoute>
            <Notifications/>
          </ProtectedRoute>
        } />
        <Route path='/theatres' element={<Theatres/>} />
        <Route path='/theatres/:theatreId' element={<Theatre/>} />
        <Route path='/manage-users' element={
          <ProtectedRoute requireAdmin={true} requireAdAccess={true}>
            <ManageUsers/>
          </ProtectedRoute>
        } />
        <Route path='/admin/*' element={
          <ProtectedRoute requireAdmin={true}>
            <Layout/>
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard/>}/>
          <Route path="add-shows" element={<AddShows/>}/>
          <Route path="list-shows" element={<ListShows/>}/>
          <Route path="manage-rooms" element={<ManageRooms/>}/>
        </Route>
      </Routes>
      {/* Render Footer on all pages except the homepage */}
      {!isAdminRoute && !isHome && <Footer />}
    </>
  )
}

export default App
