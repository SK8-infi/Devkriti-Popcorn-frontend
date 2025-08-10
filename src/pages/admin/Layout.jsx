import React, { useEffect } from 'react'
import AdminNavbar from '../../components/admin/AdminNavbar'
import AdminSubNavbar from '../../components/admin/AdminSubNavbar'
import { Outlet, Navigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import Loading from '../../components/Loading'
import { useState } from 'react'


const Layout = () => {
  const {isAdmin, fetchIsAdmin, theatre, setAdminTheatre, theatreCity, theatreAddress, userCity, fetchUserFromBackend, loading, isAuthenticated, user} = useAppContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [theatreInput, setTheatreInput] = useState("")
  const [cityOnlyModal, setCityOnlyModal] = useState(false)
  const [cityInput, setCityInput] = useState("")
  const [addressInput, setAddressInput] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isAdmin && typeof theatre !== 'undefined' && typeof theatreCity !== 'undefined') {
      // Check if both theatre and city are missing
      if (!theatre && !theatreCity) {
        setModalOpen(true)
        setCityOnlyModal(false)
      }
      // Check if theatre exists but city is missing
      else if (theatre && !theatreCity) {
        setModalOpen(false)
        setCityOnlyModal(true)
      }
      // Check if city exists but theatre is missing
      else if (!theatre && theatreCity) {
        setModalOpen(true)
        setCityOnlyModal(false)
      }
      // Both exist
      else {
        setModalOpen(false)
        setCityOnlyModal(false)
      }
    } else {
      setModalOpen(false)
      setCityOnlyModal(false)
    }
  }, [isAdmin, theatre, theatreCity])

  // Show loading while checking authentication
  if (loading) return <Loading />

  // Redirect non-authenticated users
  if (!isAuthenticated) {
    return <Navigate to="/" />
  }

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" />
  }

  return (
    <>

      
      {/* Main Theatre Setup Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center relative border-2 border-primary">
            <h2 className="text-2xl font-bold mb-2 text-black">Welcome, {user?.name || 'Admin'}!</h2>
            <p className="mb-4 text-black text-center">
              {!theatre && !theatreCity ? (
                <>Please set your <span className='font-semibold'>theatre name</span> and select your <span className='font-semibold'>city</span> to continue managing your shows.</>
              ) : !theatre ? (
                <>Please set your <span className='font-semibold'>theatre name</span> to continue managing your shows.</>
              ) : !theatreCity ? (
                <>Please select your <span className='font-semibold'>city</span> to continue managing your shows.</>
              ) : (
                <>Update your theatre details below.</>
              )}
            </p>
            
            {!theatre && (
              <input
                className="border border-primary/40 p-3 rounded w-full mb-3 text-lg bg-primary/5 text-black"
                type="text"
                placeholder="Enter theatre name"
                value={theatreInput}
                onChange={e => setTheatreInput(e.target.value)}
                disabled={submitting}
                autoFocus
              />
            )}
            
            {!theatreCity && (
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
            )}
            
            {!theatreAddress && (
              <textarea
                className="border border-primary/40 p-3 rounded w-full mb-3 text-lg bg-primary/5 text-black resize-none"
                placeholder="Enter theatre address (optional)"
                value={addressInput ?? ""}
                onChange={e => setAddressInput(e.target.value)}
                disabled={submitting}
                rows={3}
              />
            )}
            
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            
            <div className="flex gap-3 w-full">
              <button
                className="bg-gray-300 text-black px-6 py-2 rounded-lg flex-1 font-semibold text-lg hover:bg-red-200 transition"
                onClick={() => setModalOpen(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="bg-primary text-white px-6 py-2 rounded-lg flex-1 font-semibold text-lg hover:bg-primary/90 transition disabled:opacity-60 shadow"
                onClick={async () => {
                  setSubmitting(true)
                  setError("")
                  
                  try {
                    // Use existing values if not provided in form
                    const theatreName = theatreInput.trim() || theatre || "";
                    const cityName = cityInput || theatreCity || "";
                    const addressName = addressInput.trim() || theatreAddress || "";
                    
                    const res = await setAdminTheatre(theatreName, cityName, addressName)
                    await fetchUserFromBackend();
                    setSubmitting(false)
                    if (res.success) {
                      setTheatreInput("");
                      setCityInput("");
                      setAddressInput("");
                      setModalOpen(false)
                    } else {
                      setError(res.message || "Failed to set theatre details")
                    }
                  } catch (error) {
                    setSubmitting(false)
                    setError("Failed to set theatre details")
                  }
                }}
                disabled={(!theatre && !theatreInput.trim()) || (!theatreCity && !cityInput) || submitting}
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* City Only Modal */}
      {cityOnlyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center relative border-2 border-primary">
            <h2 className="text-2xl font-bold mb-2 text-black">Set Your City</h2>
            <p className="mb-4 text-black text-center">
              Please select your <span className='font-semibold'>city</span> to continue managing your shows.
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
            
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            
            <div className="flex gap-3 w-full">
              <button
                className="bg-gray-300 text-black px-6 py-2 rounded-lg flex-1 font-semibold text-lg hover:bg-red-200 transition"
                onClick={() => setCityOnlyModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="bg-primary text-white px-6 py-2 rounded-lg flex-1 font-semibold text-lg hover:bg-primary/90 transition disabled:opacity-60 shadow"
                onClick={async () => {
                  setSubmitting(true)
                  setError("")
                  
                  try {
                    // Call setAdminTheatre with current theatre and new city
                    const res = await setAdminTheatre(theatre, cityInput)
                    await fetchUserFromBackend();
                    setSubmitting(false)
                    if (res.success) {
                      setCityInput("");
                      setCityOnlyModal(false)
                    } else {
                      setError(res.message || "Failed to set city")
                    }
                  } catch (error) {
                    setSubmitting(false)
                    setError("Failed to set city")
                  }
                }}
                disabled={!cityInput || submitting}
              >
                {submitting ? "Saving..." : "Save City"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Layout with SubNavbar */}
      <AdminNavbar />
      <AdminSubNavbar />
      <div className='flex-1 px-4 py-10 md:px-10 h-[calc(100vh-128px)] overflow-y-auto' style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </div>
    </>
  )
}

export default Layout
