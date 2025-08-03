import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { ClockIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon, RefreshCwIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import Loading from '../components/Loading'
import isoTimeFormat from '../lib/isoTimeFormat'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [retryingPayment, setRetryingPayment] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState({})
  const [refreshing, setRefreshing] = useState(false)
  
  const navigate = useNavigate()
  const { axios, getToken } = useAppContext()

  useEffect(() => {
    fetchBookings()
  }, [])

  // Real-time timer for pending payments
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining = {}
      bookings.forEach(booking => {
        if (!booking.isPaid) {
          if (booking.status === 'pending' && !isPendingExpired(booking.createdAt)) {
            // 30 minutes for pending payments
            const created = new Date(booking.createdAt)
            const now = new Date()
            const timeDiff = created.getTime() + (30 * 60 * 1000) - now.getTime()
            if (timeDiff > 0) {
              const minutes = Math.floor(timeDiff / (1000 * 60))
              const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
              newTimeRemaining[booking._id] = `${minutes}:${seconds.toString().padStart(2, '0')}`
            }
          } else if (booking.status === 'payment_failed' && !isExpired(booking.createdAt)) {
            // 10 minutes for failed payments
            const created = new Date(booking.createdAt)
            const now = new Date()
            const timeDiff = created.getTime() + (10 * 60 * 1000) - now.getTime()
            if (timeDiff > 0) {
              const minutes = Math.floor(timeDiff / (1000 * 60))
              const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
              newTimeRemaining[booking._id] = `${minutes}:${seconds.toString().padStart(2, '0')}`
            }
          }
        }
      })
      setTimeRemaining(newTimeRemaining)
    }, 1000)

    return () => clearInterval(interval)
  }, [bookings])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const token = await getToken()
      const { data } = await axios.get('/api/booking/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (data.success) {
        console.log('🔍 MyBookings: Received bookings data:', data.bookings);
        setBookings(data.bookings)
      } else {
        toast.error(data.message || 'Failed to fetch bookings')
      }
    } catch (error) {
      console.log('❌ MyBookings: Error fetching bookings:', error)
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const refreshBookings = async () => {
    try {
      setRefreshing(true)
      await fetchBookings()
      toast.success('Bookings refreshed')
    } catch (error) {
      console.log('❌ MyBookings: Error refreshing bookings:', error)
      toast.error('Failed to refresh bookings')
    } finally {
      setRefreshing(false)
    }
  }

  const retryPayment = async (bookingId) => {
    try {
      setRetryingPayment(bookingId)
      const token = await getToken()
      
      const { data } = await axios.post(`/api/booking/retry-payment/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (data.success) {
        toast.success('Redirecting to payment...')
        window.location.href = data.url
      } else {
        toast.error(data.message || 'Failed to retry payment')
      }
    } catch (error) {
      console.log('❌ MyBookings: Error retrying payment:', error)
      toast.error('Failed to retry payment')
    } finally {
      setRetryingPayment(null)
    }
  }

  const getStatusIcon = (status, isPaid) => {
    if (isPaid) return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    if (status === 'payment_failed') return <XCircleIcon className="w-5 h-5 text-red-500" />
    if (status === 'pending') return <ClockIcon className="w-5 h-5 text-yellow-500" />
    return <AlertCircleIcon className="w-5 h-5 text-gray-500" />
  }

  const getStatusText = (status, isPaid) => {
    if (isPaid) return 'Confirmed'
    if (status === 'payment_failed') return 'Payment Failed'
    if (status === 'pending') return 'Pending Payment'
    return 'Unknown'
  }

  const getStatusColor = (status, isPaid) => {
    if (isPaid) return 'text-green-500 bg-green-100'
    if (status === 'payment_failed') return 'text-red-500 bg-red-100'
    if (status === 'pending') return 'text-yellow-500 bg-yellow-100'
    return 'text-gray-500 bg-gray-100'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeRemaining = (createdAt) => {
    const created = new Date(createdAt)
    const now = new Date()
    const timeDiff = created.getTime() + (10 * 60 * 1000) - now.getTime() // 10 minutes for failed payments
    const thirtyMinTimeDiff = created.getTime() + (30 * 60 * 1000) - now.getTime() // 30 minutes for pending payments
    
    if (timeDiff <= 0) return 'Expired'
    
    const minutes = Math.floor(timeDiff / (1000 * 60))
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const isExpired = (createdAt) => {
    const created = new Date(createdAt)
    const now = new Date()
    return (created.getTime() + (10 * 60 * 1000)) <= now.getTime() // 10 minutes for failed payments
  }

  const isPendingExpired = (createdAt) => {
    const created = new Date(createdAt)
    const now = new Date()
    return (created.getTime() + (30 * 60 * 1000)) <= now.getTime() // 30 minutes for pending payments
  }

  if (loading) return <Loading />

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#181818] to-[#232323] py-10 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold text-primary mb-4'>My Bookings</h1>
          <p className='text-gray-300'>View and manage your movie ticket bookings</p>
          
          {/* Refresh Button */}
          <button
            onClick={refreshBookings}
            disabled={refreshing}
            className='mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition disabled:opacity-50 flex items-center gap-2 mx-auto'
          >
            <RefreshCwIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Bookings'}
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className='text-center py-20'>
            <div className='text-gray-400 text-xl mb-4'>No bookings found</div>
            <button 
              onClick={() => navigate('/')}
              className='bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition'
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {bookings.map((booking) => (
              <div key={booking._id} className='bg-white/10 border border-primary/20 rounded-xl p-6 hover:shadow-lg transition'>
                {/* Booking Header */}
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-2'>
                    {getStatusIcon(booking.status, booking.isPaid)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status, booking.isPaid)}`}>
                      {getStatusText(booking.status, booking.isPaid)}
                    </span>
                  </div>
                  <div className='text-sm text-gray-400'>
                    {formatDate(booking.createdAt)}
                  </div>
                </div>

                {/* Movie Info */}
                <div className='mb-4'>
                  <h3 className='text-lg font-semibold text-white mb-2'>
                    {booking.show?.movie?.title || 'Movie Title'}
                  </h3>
                  <div className='text-sm text-gray-300 space-y-1'>
                    <div>Show: {booking.show?.time ? isoTimeFormat(booking.show.time) : 'N/A'}</div>
                    <div>Language: {booking.show?.language || 'N/A'}</div>
                    <div>Format: {booking.show?.format || 'N/A'}</div>
                    <div>Theatre: {booking.show?.theatreName || 'N/A'}</div>
                    {booking.show?.theatreCity && <div>City: {booking.show.theatreCity}</div>}
                  </div>
                </div>

                {/* Seats Info */}
                <div className='mb-4'>
                  <div className='text-sm text-gray-300 mb-2'>
                    Seats: {booking.bookedSeats.join(', ')}
                  </div>
                  <div className='text-lg font-bold text-primary'>
                    ₹{booking.amount}
                  </div>
                </div>

                {/* Payment Status */}
                {booking.isPaid ? (
                  <div className='text-green-400 text-sm mb-4'>
                    ✅ Payment completed on {booking.paymentDate ? formatDate(booking.paymentDate) : 'N/A'}
                  </div>
                ) : (
                  <div className='mb-4'>
                    {booking.status === 'pending' && !isPendingExpired(booking.createdAt) && (
                      <div className='text-yellow-400 text-sm mb-2'>
                        ⏰ Time remaining: {timeRemaining[booking._id] || 'Calculating...'}
                      </div>
                    )}
                    {booking.status === 'payment_failed' && !isExpired(booking.createdAt) && (
                      <div className='text-orange-400 text-sm mb-2'>
                        ⏰ Continue payment within: {timeRemaining[booking._id] || 'Calculating...'}
                      </div>
                    )}
                    {booking.status === 'payment_failed' && isExpired(booking.createdAt) && (
                      <div className='text-red-400 text-sm mb-2'>
                        ❌ Payment session expired (10 min limit)
                      </div>
                    )}
                    {booking.status === 'pending' && isPendingExpired(booking.createdAt) && (
                      <div className='text-red-400 text-sm mb-2'>
                        ⏰ Payment session expired (30 min limit)
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className='flex gap-2'>
                  {!booking.isPaid && booking.status !== 'cancelled' && (
                    <>
                      {booking.status === 'pending' && !isPendingExpired(booking.createdAt) ? (
                        <button
                          onClick={() => retryPayment(booking._id)}
                          disabled={retryingPayment === booking._id}
                          className='flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition disabled:opacity-50 flex items-center justify-center gap-2'
                        >
                          {retryingPayment === booking._id ? (
                            <>
                              <RefreshCwIcon className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <RefreshCwIcon className="w-4 h-4" />
                              Retry Payment
                            </>
                          )}
                        </button>
                      ) : booking.status === 'payment_failed' && !isExpired(booking.createdAt) ? (
                        <button
                          onClick={() => retryPayment(booking._id)}
                          disabled={retryingPayment === booking._id}
                          className='flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-400 transition disabled:opacity-50 flex items-center justify-center gap-2'
                        >
                          {retryingPayment === booking._id ? (
                            <>
                              <RefreshCwIcon className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <RefreshCwIcon className="w-4 h-4" />
                              Continue Payment
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            console.log('🔍 MyBookings: Book Again clicked for booking:', {
                              bookingId: booking._id,
                              movieId: booking.show?.movie?._id,
                              movieTitle: booking.show?.movie?.title
                            });
                            if (booking.show?.movie?._id) {
                              navigate(`/movies/${booking.show.movie._id}`);
                            } else {
                              toast.error('Movie information not available. Redirecting to movies list.');
                              navigate('/movies');
                            }
                          }}
                          className='flex-1 bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition'
                        >
                          Book Again
                        </button>
                      )}
                    </>
                  )}
                  
                  {booking.isPaid && (
                    <button className='flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition'>
                      View Ticket
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings
