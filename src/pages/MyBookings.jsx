import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { ClockIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon, RefreshCwIcon, Download, Mail, QrCode, CalendarIcon, MapPinIcon, Ban } from 'lucide-react'
import toast from 'react-hot-toast'
import Loading from '../components/Loading'
import isoTimeFormat from '../lib/isoTimeFormat'
import TicketQRModal from '../components/TicketQRModal'
import CancellationModal from '../components/CancellationModal'
import './MyBookings.css'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [retryingPayment, setRetryingPayment] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState({})
  const [refreshing, setRefreshing] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrData, setQrData] = useState(null)
  const [cancellationModalOpen, setCancellationModalOpen] = useState(false)
  const [selectedBookingForCancellation, setSelectedBookingForCancellation] = useState(null)
  
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
        setBookings(data.bookings)
      } else {
        toast.error(data.message || 'Failed to fetch bookings')
      }
          } catch (error) {
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
              toast.error('Failed to retry payment')
    } finally {
      setRetryingPayment(null)
    }
  }

  // Download ticket PDF
  const downloadTicket = async (bookingId) => {
    try {
      const token = await getToken()
      const response = await axios.get(`/api/tickets/download/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      })
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `ticket-${bookingId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success('Ticket downloaded successfully')
    } catch (error) {
      console.error('Error downloading ticket:', error)
      toast.error('Failed to download ticket')
    }
  }

  // Resend ticket email
  const resendTicketEmail = async (bookingId) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(`/api/tickets/resend-email/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (data.success) {
        toast.success('Ticket email sent successfully')
      } else {
        toast.error(data.message || 'Failed to send ticket email')
      }
    } catch (error) {
      console.error('Error resending ticket email:', error)
      toast.error('Failed to send ticket email')
    }
  }

  // View ticket QR code
  const viewTicketQR = async (bookingId) => {
    try {
      const token = await getToken()
      const { data } = await axios.get(`/api/tickets/qr-code/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (data.success) {
        setQrData(data.qrData)
        setQrModalOpen(true)
      } else {
        toast.error(data.message || 'Failed to get QR code')
      }
    } catch (error) {
      console.error('Error getting QR code:', error)
      toast.error('Failed to get QR code')
    }
  }

  // Cancellation functions
  const openCancellationModal = (booking) => {
    setSelectedBookingForCancellation(booking)
    setCancellationModalOpen(true)
  }

  const closeCancellationModal = () => {
    setSelectedBookingForCancellation(null)
    setCancellationModalOpen(false)
  }

  const handleCancellationSuccess = (cancellationData) => {
    // Refresh bookings to show updated status
    fetchBookings()
    toast.success(`Booking cancelled! Refund: ₹${cancellationData.refundAmount}`)
  }

  // Check if booking can be cancelled (not cancelled, paid, and show hasn't passed)
  const canCancelBooking = (booking) => {
    if (booking.isCancelled || booking.status === 'cancelled') return false
    if (!booking.isPaid) return false
    if (!booking.show?.time) return false
    
    const showTime = new Date(booking.show.time)
    const now = new Date()
    return showTime > now // Show hasn't started yet
  }

  const getStatusIcon = (status, isPaid, isCancelled) => {
    if (isCancelled) return <Ban className="w-5 h-5 text-red-500" />
    if (isPaid) return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    if (status === 'payment_failed') return <XCircleIcon className="w-5 h-5 text-red-500" />
    if (status === 'pending') return <ClockIcon className="w-5 h-5 text-yellow-500" />
    return <AlertCircleIcon className="w-5 h-5 text-gray-500" />
  }

  const getStatusText = (status, isPaid, isCancelled) => {
    if (isCancelled) return 'Cancelled'
    if (isPaid) return 'Confirmed'
    if (status === 'payment_failed') return 'Payment Failed'
    if (status === 'pending') return 'Pending Payment'
    return 'Unknown'
  }



  const getStatusColor = (status, isPaid, isCancelled) => {
    if (isCancelled) return 'text-red-500 bg-red-100'
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

  // Filter bookings to show only successful ones or those within 30-minute buffer
  const shouldShowBooking = (booking) => {
    // Show successful bookings
    if (booking.isPaid) return true
    
    // Show pending bookings within 30-minute buffer
    if (booking.status === 'pending' && !isPendingExpired(booking.createdAt)) return true
    
    // Show failed bookings within 10-minute buffer (for continue payment option)
    if (booking.status === 'payment_failed' && !isExpired(booking.createdAt)) return true
    
    // Don't show expired or cancelled bookings
    return false
  }

  // Filter the bookings array
  const filteredBookings = bookings.filter(shouldShowBooking)

  if (loading) return <Loading />

  return (
    <div className='min-h-screen bg-black pt-20 py-10 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold mb-4' style={{ fontFamily: 'Times New Roman, Times, serif', color: '#FFD6A0' }}>My Bookings</h1>
          <p className='text-gray-300'>View and manage your movie ticket bookings</p>
          
          {/* Booking Count Info */}
          {bookings.length > 0 && (
            <div className='mt-2 text-sm text-gray-400'>
              Showing {filteredBookings.length} of {bookings.length} bookings 
              {bookings.length !== filteredBookings.length && (
                <span className='text-yellow-400'> (expired bookings hidden)</span>
              )}
            </div>
          )}
          
          {/* Refresh Button */}
          <button
            onClick={refreshBookings}
            disabled={refreshing}
            className='mt-4 bg-primary text-black px-6 py-3 rounded-lg hover:bg-primary/80 transition disabled:opacity-50 flex items-center gap-2 mx-auto font-medium'
          >
            <RefreshCwIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Bookings'}
          </button>
        </div>

        {filteredBookings.length === 0 ? (
          <div className='text-center py-20'>
            <div className='mb-6'>
              <div className='w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center'>
                <CalendarIcon className='w-10 h-10 text-gray-500' />
              </div>
              <div className='text-gray-400 text-xl mb-4'>
                {bookings.length === 0 ? 'No bookings found' : 'No active bookings found'}
              </div>
              <p className='text-gray-500 mb-6'>
                {bookings.length === 0 
                  ? 'Start booking your movie tickets!' 
                  : 'Only successful bookings and those within payment buffer time are shown here.'
                }
              </p>
            </div>
            <button 
              onClick={() => navigate('/movies')}
              className='bg-primary text-black px-8 py-3 rounded-lg hover:bg-primary/80 transition font-medium'
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {filteredBookings.map((booking) => (
              <div 
                key={booking._id} 
                className='border border-primary/30 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl'
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                }}
              >
                {/* Booking Header */}
                <div 
                  className='p-4 border-b border-gray-700/50'
                  style={{
                    background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                  }}
                >
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      {getStatusIcon(booking.status, booking.isPaid, booking.isCancelled)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status, booking.isPaid, booking.isCancelled)}`}>
                        {getStatusText(booking.status, booking.isPaid, booking.isCancelled)}
                      </span>
                    </div>
                    <div className='text-xs text-gray-400'>
                      {formatDate(booking.createdAt)}
                    </div>
                  </div>
                  <h3 className='text-lg font-semibold text-white mb-1'>
                    {booking.show?.movie?.title || 'Movie Title'}
                  </h3>
                </div>

                {/* Movie & Show Info */}
                <div className='p-4'>
                  <div 
                    className='rounded-lg p-3 mb-4'
                    style={{
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                      border: '1px solid rgba(75, 85, 99, 0.3)'
                    }}
                  >
                    <div className='text-sm text-gray-300 space-y-2'>
                      <div className='flex items-center gap-2'>
                        <CalendarIcon className='w-4 h-4 text-primary' />
                        <span>{booking.show?.time ? isoTimeFormat(booking.show.time) : 'N/A'}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <MapPinIcon className='w-4 h-4 text-primary' />
                        <span>{booking.show?.theatreName || 'N/A'}</span>
                        {booking.show?.theatreCity && <span className='text-gray-400'>• {booking.show.theatreCity}</span>}
                      </div>
                      <div className='text-xs text-gray-400'>
                        {booking.show?.language || 'N/A'} • {booking.show?.format || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Seats & Amount */}
                  <div className='flex justify-between items-center mb-4'>
                    <div>
                      <div className='text-xs text-gray-400 mb-1'>Seats</div>
                      <div className='text-sm font-medium text-white'>
                        {booking.bookedSeats.join(', ')}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-xs text-gray-400 mb-1'>Total</div>
                      <div className='text-xl font-bold text-primary'>
                        ₹{booking.amount}
                      </div>
                    </div>
                  </div>

                {/* Payment Status */}
                {booking.isPaid ? (
                  <div className='text-green-400 text-sm mb-4'>
                    Payment completed on {booking.paymentDate ? formatDate(booking.paymentDate) : 'N/A'}
                  </div>
                ) : (
                  <div className='mb-4'>
                    {booking.status === 'pending' && !isPendingExpired(booking.createdAt) && (
                      <div className='text-yellow-400 text-sm mb-2'>
                        Time remaining: {timeRemaining[booking._id] || 'Calculating...'}
                      </div>
                    )}
                    {booking.status === 'payment_failed' && !isExpired(booking.createdAt) && (
                      <div className='text-orange-400 text-sm mb-2'>
                        Continue payment within: {timeRemaining[booking._id] || 'Calculating...'}
                      </div>
                    )}
                    {booking.status === 'payment_failed' && isExpired(booking.createdAt) && (
                      <div className='text-red-400 text-sm mb-2'>
                        Payment session expired (10 min limit)
                      </div>
                    )}
                    {booking.status === 'pending' && isPendingExpired(booking.createdAt) && (
                      <div className='text-red-400 text-sm mb-2'>
                        Payment session expired (30 min limit)
                      </div>
                    )}
                  </div>
                )}

                  {/* Action Buttons */}
                  <div className='space-y-2'>
                    {!booking.isPaid && booking.status !== 'cancelled' && (
                      <>
                        {booking.status === 'pending' && !isPendingExpired(booking.createdAt) ? (
                          <button
                            onClick={() => retryPayment(booking._id)}
                            disabled={retryingPayment === booking._id}
                            className='w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/80 transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium'
                          >
                            {retryingPayment === booking._id ? (
                              <>
                                <RefreshCwIcon className="w-4 h-4 animate-spin text-white" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <RefreshCwIcon className="w-4 h-4 text-white" />
                                Complete Payment
                              </>
                            )}
                          </button>
                        ) : booking.status === 'payment_failed' && !isExpired(booking.createdAt) ? (
                          <button
                            onClick={() => retryPayment(booking._id)}
                            disabled={retryingPayment === booking._id}
                            className='w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-400 transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium'
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
                              if (booking.show?.movie?._id) {
                                navigate(`/movies/${booking.show.movie._id}`);
                              } else {
                                toast.error('Movie information not available. Redirecting to movies list.');
                                navigate('/movies');
                              }
                            }}
                            className='w-full bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-500 transition font-medium'
                          >
                            Book Again
                          </button>
                        )}
                      </>
                    )}
                    
                    {booking.isPaid && !booking.isCancelled && (
                      <div className='grid grid-cols-3 gap-2 mb-3'>
                        <button 
                          onClick={() => downloadTicket(booking._id)}
                          className='bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-500 transition flex items-center justify-center gap-1 text-sm font-medium'
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button 
                          onClick={() => resendTicketEmail(booking._id)}
                          className='bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-500 transition flex items-center justify-center gap-1 text-sm font-medium'
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </button>
                        <button 
                          onClick={() => viewTicketQR(booking._id)}
                          className='bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-500 transition flex items-center justify-center gap-1 text-sm font-medium'
                        >
                          <QrCode className="w-4 h-4" />
                          QR
                        </button>
                      </div>
                    )}

                    {/* Cancellation button for eligible bookings */}
                    {canCancelBooking(booking) && (
                      <button 
                        onClick={() => openCancellationModal(booking)}
                        className='w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm font-medium'
                      >
                        <Ban className="w-4 h-4" />
                        Cancel Booking
                      </button>
                    )}

                    {/* Show refund info for cancelled bookings */}
                    {booking.isCancelled && booking.refundAmount > 0 && (
                      <div className='bg-blue-50 border border-blue-200 p-3 rounded-lg'>
                        <p className='text-blue-800 text-sm'>
                          <span className='font-medium'>Refund:</span> ₹{booking.refundAmount} ({booking.refundPercentage}%)
                        </p>
                        <p className='text-blue-600 text-xs mt-1'>
                          Status: {booking.refundStatus}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* QR Code Modal */}
      <TicketQRModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        qrData={qrData}
      />

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={cancellationModalOpen}
        onClose={closeCancellationModal}
        booking={selectedBookingForCancellation}
        onCancellationSuccess={handleCancellationSuccess}
      />
    </div>
  )
}

export default MyBookings
