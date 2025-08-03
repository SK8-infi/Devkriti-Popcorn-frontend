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
import ListBookings from './pages/admin/ListBookings'
import UpdateLayout from './pages/admin/UpdateLayout'
import { useAppContext } from './context/AppContext'
import Loading from './components/Loading'
import LoadingPage from './pages/Loading'
import Theatres from './pages/Theatres'
import Theatre from './pages/Theatre'
import ManageRooms from './pages/admin/ManageRooms'
import ManageUsers from './pages/admin/ManageUsers'
import ContactUs from './pages/ContactUs'
import SelectShowtime from './pages/SelectShowtime'
// SignIn component removed - redirecting non-admin users to home instead
import DebugAccess from './pages/admin/DebugAccess'
import UserImageDebug from './components/UserImageDebug'
import TestOwnerAccess from './pages/admin/TestOwnerAccess'

const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false, requireOwnerAccess = false }) => {
  const { user, isAuthenticated, isAdmin, hasOwnerAccess, loading } = useAppContext();

  if (loading) return <Loading />;

  if (requireAuth && !isAuthenticated) return <Navigate to="/" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  if (requireOwnerAccess && !hasOwnerAccess) return <Navigate to="/admin" replace />;

  return children;
};

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHome = location.pathname === '/';

  const { user } = useAppContext();

  return (
    <>
      <Toaster />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:showId' element={<SeatLayout />} />
        <Route path='/movies/:id/select-showtime' element={<SelectShowtime />} />
        <Route path='/my-bookings' element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } />
        <Route path='/favorite' element={
          <ProtectedRoute>
            <Favorite />
          </ProtectedRoute>
        } />
        <Route path='/notifications' element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />
        <Route path='/theatres' element={<Theatres />} />
        <Route path='/theatres/:theatreId' element={<Theatre />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/loading/:nextUrl' element={<Loading />} />
        <Route path='/payment-success' element={<LoadingPage />} />

        {/* 🔐 Admin-only route for managing users */}
        <Route path='/manage-users' element={
          <ProtectedRoute requireAdmin={true} requireOwnerAccess={true}>
            <ManageUsers />
          </ProtectedRoute>
        } />

        {/* 🔍 Debug route for troubleshooting access issues */}
        <Route path='/debug-access' element={<DebugAccess />} />
        
        {/* 🖼️ Debug route for user image issues */}
        <Route path='/debug-user-image' element={<UserImageDebug />} />

        {/* 🧪 Test route for owner access debugging */}
        <Route path='/test-owner-access' element={<TestOwnerAccess />} />

        {/* 🔐 Admin layout and nested routes */}
        <Route path='/admin/*' element={
          <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
          <Route path="manage-rooms" element={<ManageRooms />} />
          {/* Add more nested admin routes here as needed */}
        </Route>
      </Routes>

      {/* Footer shown on all non-admin, non-home pages */}
      {!isAdminRoute && !isHome && <Footer />}
    </>
  )
}

export default App;
