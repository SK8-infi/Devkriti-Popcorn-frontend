import React, { useEffect } from 'react'
import AdminNavbar from '../../components/admin/AdminNavbar'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import Loading from '../../components/Loading'
import { useState } from 'react'
import DarkVeil from '../../components/DarkVeil';

const Layout = () => {

  const {isAdmin, fetchIsAdmin, theatre, setAdminTheatre, city, fetchUserFromBackend, loading, isAuthenticated} = useAppContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [theatreInput, setTheatreInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [theatreChecked, setTheatreChecked] = useState(false)
  const [cityOnlyModal, setCityOnlyModal] = useState(false)
  const [cityInput, setCityInput] = useState("")

  useEffect(()=>{
    // Only fetch admin status if user is authenticated
    if (isAuthenticated) {
      fetchIsAdmin()
    }
  },[isAuthenticated])

  useEffect(() => {
    if (isAdmin && typeof theatre !== 'undefined') {
      if (!theatre && !city) {
        setModalOpen(true)
        setCityOnlyModal(false)
      } else if (theatre && !city) {
        setModalOpen(false)
        setCityOnlyModal(true)
      } else {
        setModalOpen(false)
        setCityOnlyModal(false)
      }
    }
  }, [isAdmin, theatre, city])

  // Show loading while checking authentication
  if (loading) return <Loading/>

  // Redirect if not authenticated
  if (!isAuthenticated) {
    window.location.href = '/';
    return <Loading/>;
  }

  // Show loading while checking admin status
  if (typeof isAdmin === 'undefined') return <Loading/>

  // Redirect if not admin
  if (!isAdmin) {
    window.location.href = '/';
    return <Loading/>;
  }

  return <>
    {/* Animated background for admin panel */}
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <DarkVeil noiseIntensity={0.08} scanlineIntensity={0.12} scanlineFrequency={2.5} warpAmount={0.08} speed={0.4} />
    </div>
    {modalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center relative border-2 border-primary">
          <h2 className="text-2xl font-bold mb-2 text-black">Welcome, Admin!</h2>
          <p className="mb-4 text-black text-center">
            Please set your <span className='font-semibold'>theatre name</span> and select your <span className='font-semibold'>city</span> to continue managing your shows.
          </p>
          <select
            className="border border-primary/40 p-3 rounded w-full mb-3 text-lg bg-primary/5 text-black"
            value={cityInput ?? ""}
            onChange={e => setCityInput(e.target.value)}
            disabled={submitting}
          >
            <option value="">Select City</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Gwalior">Gwalior</option>
            <option value="Indore">Indore</option>
            <option value="Pune">Pune</option>
            <option value="Chennai">Chennai</option>
          </select>
          <input
            className="border border-primary/40 p-3 rounded w-full mb-3 focus:outline-primary text-lg bg-primary/5 placeholder:text-black"
            type="text"
            placeholder="Enter theatre name"
            value={theatreInput}
            onChange={e => setTheatreInput(e.target.value)}
            disabled={submitting}
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            className="bg-primary text-white px-6 py-2 rounded-lg w-full mt-2 font-semibold text-lg hover:bg-primary/90 transition disabled:opacity-60 shadow"
            onClick={async () => {
              console.log('Save button clicked', { theatreInput, cityInput });
              setSubmitting(true)
              setError("")
              const res = await setAdminTheatre(theatreInput, cityInput)
              console.log('setAdminTheatre response', res);
              await fetchUserFromBackend();
              setSubmitting(false)
              setTheatreInput("");
              setCityInput("");
              // Only close modal if both are set in context
              if (res.success) {
                setModalOpen(false)
              } else {
                setError(res.message || "Failed to set theatre name")
              }
            }}
            disabled={!theatreInput.trim() || !cityInput || submitting}
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    )}
    {cityOnlyModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center relative border-2 border-primary">
          <h2 className="text-2xl font-bold mb-2 text-black">Set Your City</h2>
          <p className="mb-4 text-black text-center">
            Please select your <span className='font-semibold'>city</span> to continue managing your shows.
          </p>
          <select
            className="border border-primary/40 p-3 rounded w-full mb-3 text-lg bg-primary/5 text-black"
            value={city ?? ""}
            onChange={e => setCity(e.target.value)}
            disabled={submitting}
          >
            <option value="">Select City</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Gwalior">Gwalior</option>
            <option value="Indore">Indore</option>
            <option value="Pune">Pune</option>
            <option value="Chennai">Chennai</option>
          </select>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            className="bg-primary text-white px-6 py-2 rounded-lg w-full mt-2 font-semibold text-lg hover:bg-primary/90 transition disabled:opacity-60 shadow"
            onClick={async () => {
              setSubmitting(true)
              setError("")
              // Call setAdminTheatre with current theatre and new city
              const res = await setAdminTheatre(theatre, city)
              await fetchUserFromBackend();
              setSubmitting(false)
              if (res.success) {
                setCity("");
              } else {
                setError(res.message || "Failed to set city")
              }
            }}
            disabled={!city || submitting}
          >
            {submitting ? "Saving..." : "Save City"}
          </button>
        </div>
      </div>
    )}
    <AdminNavbar />
    <div className='flex' style={{ position: 'relative', zIndex: 1 }}>
      <AdminSidebar/>
      <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-64px)] overflow-y-auto'>
          <Outlet />
      </div>
    </div>
  </>
}

export default Layout
