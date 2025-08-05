import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon, MapPinIcon, StarIcon, Calendar } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'
import './SeatLayout.css'

const SeatLayout = () => {

  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

  const {id, showId } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])
  const [theatreLayout, setTheatreLayout] = useState(null)
  const [theatreName, setTheatreName] = useState("")
  const [theatreCity, setTheatreCity] = useState("")
  const [layoutLoaded, setLayoutLoaded] = useState(false)
  const [isBooking, setIsBooking] = useState(false)
  const [movie, setMovie] = useState(null)

  const navigate = useNavigate()

  const {axios, getToken, user, image_base_url} = useAppContext();

  // Check if user is loaded
  useEffect(() => {
    console.log('🔍 SeatLayout: User context:', user);
    console.log('🔍 SeatLayout: User ID:', user?._id);
  }, [user]);

  // Handle payment failures from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentFailed = urlParams.get('payment_failed');
    const bookingId = urlParams.get('booking_id');
    
    if (paymentFailed === 'true' && bookingId) {
      console.log('🔍 SeatLayout: Payment failed detected, releasing seats');
      toast.error('Payment failed. Seats have been released. You can try booking again.');
      // Clear any selected seats to allow rebooking
      setSelectedSeats([]);
      // Optionally call backend to release seats
      handlePaymentFailure(bookingId);
    }
  }, []);

  const handlePaymentFailure = async (bookingId) => {
    try {
      await axios.post('/api/booking/payment-failed', { bookingId });
      console.log('✅ SeatLayout: Payment failure handled');
    } catch (error) {
      console.log('❌ SeatLayout: Error handling payment failure:', error);
    }
  }

  const getShow = async () =>{
    try {
      console.log('🔍 SeatLayout: Getting show for movieId:', id, 'showId:', showId);
      const [{ data }, { data: movieData }] = await Promise.all([
        axios.get(`/api/show/${id}`),
        axios.get(`/api/movies/${id}`)
      ]);
      if (data.success && movieData.movie){
        console.log('🔍 SeatLayout: Show data received:', data);
        setMovie(movieData.movie);
        // Find the specific showtime using showId
        const allShows = data.dateTime || {};
        let foundShow = null;
        
        console.log('🔍 SeatLayout: Looking for showId:', showId);
        console.log('🔍 SeatLayout: Available showtimes:', allShows);
        
        // Search through all dates and showtimes to find the specific showId
        for (const [date, showtimes] of Object.entries(allShows)) {
          console.log('🔍 SeatLayout: Checking date:', date);
          for (const showtime of showtimes) {
            console.log('🔍 SeatLayout: Checking showtime:', showtime.showId, 'vs', showId);
            if (showtime.showId === showId) {
              console.log('✅ SeatLayout: Found matching show!');
              foundShow = {
                ...data,
                selectedShowtime: showtime,
                selectedDate: date
              };
              break;
            }
          }
          if (foundShow) break;
        }
        
        if (foundShow) {
          console.log('✅ SeatLayout: Setting show data:', foundShow);
          setShow(foundShow);
          setSelectedTime(foundShow.selectedShowtime);
          
          // Get the theatre layout for the specific room
          console.log('🔍 SeatLayout: Room info from showtime:', foundShow.selectedShowtime);
          await getTheatreLayout(foundShow.selectedShowtime.theatre, foundShow.selectedShowtime.roomName);
        } else {
          console.log('❌ SeatLayout: Show not found for showId:', showId);
          toast.error('Show not found');
        }
      }
    } catch (error) {
      console.log('❌ SeatLayout: Error getting show:', error)
      toast.error('Failed to load show details');
    }
  }

  // Get theatre layout for the specific room
  const getTheatreLayout = async (theatreId, roomName) => {
    try {
      console.log('🔍 SeatLayout: Getting theatre layout for theatreId:', theatreId, 'roomName:', roomName);
      const { data } = await axios.get(`/api/admin/theatre/${theatreId}`);
      if (data.success && data.theatre) {
        const theatre = data.theatre;
        console.log('🔍 SeatLayout: Theatre data:', theatre);
        console.log('🔍 SeatLayout: Available rooms:', theatre.rooms);
        
        // Set theatre name and city
        setTheatreName(theatre.name || 'Unknown Theatre');
        setTheatreCity(theatre.city || '');
        
        // Find the specific room by name
        const room = theatre.rooms?.find(r => r.name === roomName);
        if (room && room.layout) {
          console.log('✅ SeatLayout: Found room layout:', room.layout);
          setTheatreLayout(room.layout);
          setLayoutLoaded(true); // Mark layout as loaded
        } else {
          console.log('⚠️ SeatLayout: Room not found or no layout, using default');
          console.log('🔍 SeatLayout: Looking for room:', roomName);
          console.log('🔍 SeatLayout: Available room names:', theatre.rooms?.map(r => r.name));
          // Use default layout if room not found, but don't override existing layout
          if (!theatreLayout) {
            setTheatreLayout(Array(8).fill().map(() => Array(10).fill(1)));
            setLayoutLoaded(true); // Mark layout as loaded even with default
          }
        }
      } else {
        console.log('⚠️ SeatLayout: Theatre not found, using default layout');
        // Only set default layout if no layout exists
        if (!theatreLayout) {
          setTheatreLayout(Array(8).fill().map(() => Array(10).fill(1)));
          setLayoutLoaded(true); // Mark layout as loaded even with default
        }
      }
    } catch (error) {
      console.log('❌ SeatLayout: Error getting theatre layout:', error);
      // Only use default layout on error if no layout exists
      if (!theatreLayout) {
        setTheatreLayout(Array(8).fill().map(() => Array(10).fill(1)));
        setLayoutLoaded(true); // Mark layout as loaded even with default
      }
    }
  }

  const handleSeatClick = (seatId) =>{
      if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
        return toast("You can only select 5 seats")
      }
      if(occupiedSeats.includes(seatId)){
        return toast('This seat is already booked')
      }
      setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const renderSeats = (row, count = 9)=>(
    <div key={row} className="seat-row">
            <div className="seat-group">
                {Array.from({ length: count }, (_, i) => {
                    const seatId = `${row}${i + 1}`;
                    return (
                        <button key={seatId} onClick={() => handleSeatClick(seatId)} className={`seat-button${selectedSeats.includes(seatId) ? ' seat-selected' : ''}${occupiedSeats.includes(seatId) ? ' seat-occupied' : ''}`}>
                            {seatId}
                        </button>
                    );
                })}
            </div>
        </div>
  )

  const getOccupiedSeats = async ()=>{
    try {
      const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`)
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }


  const bookTickets = async ()=>{
    try {
      setIsBooking(true);
      console.log('🔍 SeatLayout: Starting booking process...');
      console.log('🔍 SeatLayout: User object:', user);
      
      if(!user) {
        console.log('❌ SeatLayout: User is not logged in');
        toast.error('Please login to book tickets')
        setIsBooking(false);
        return
      }

      if(!selectedTime || !selectedSeats.length) {
        console.log('❌ SeatLayout: Missing time or seats');
        setIsBooking(false);
        return toast.error('Please select a time and seats');
      }

      // Calculate total amount based on seat types and prices
      let totalAmount = 0;
      selectedSeats.forEach(seatId => {
        const rowIdx = seatId.charCodeAt(0) - 65;
        const colIdx = parseInt(seatId.slice(1), 10) - 1;
        const seatType = theatreLayout?.[rowIdx]?.[colIdx];
        if (seatType === 2) {
          totalAmount += selectedTime.vipPrice;
        } else {
          totalAmount += selectedTime.normalPrice;
        }
      });

      console.log('🔍 SeatLayout: Booking calculation:', {
        selectedSeats,
        totalAmount,
        normalPrice: selectedTime.normalPrice,
        vipPrice: selectedTime.vipPrice,
        userId: user._id
      });

      const token = await getToken();
      console.log('🔍 SeatLayout: Auth token:', token ? 'Present' : 'Missing');

      toast.loading('Creating booking...', { id: 'booking' });

      const {data} = await axios.post('/api/booking/create', {
        showId: selectedTime.showId, 
        selectedSeats,
        totalAmount // Pass the calculated total amount
      }, {headers: { Authorization: `Bearer ${token}` }});

      toast.dismiss('booking');

      if (data.success){
        console.log('✅ SeatLayout: Booking successful, redirecting to payment');
        toast.success('Redirecting to payment...');
        try {
          // Try to redirect to Stripe
          window.location.href = data.url;
        } catch (redirectError) {
          console.log('⚠️ SeatLayout: Redirect failed, opening in new window');
          // Fallback: open in new window
          window.open(data.url, '_blank');
          toast.success('Payment page opened in new window');
        }
      }else{
        console.log('❌ SeatLayout: Booking failed:', data.message);
        toast.error(data.message)
        // Clear selected seats if booking failed so user can retry
        setSelectedSeats([]);
      }
    } catch (error) {
      toast.dismiss('booking');
      console.log('❌ SeatLayout: Booking error:', error);
      console.log('❌ SeatLayout: Error details:', error.response?.data);
      toast.error(error.response?.data?.message || error.message || 'Booking failed')
    } finally {
      setIsBooking(false);
    }
  }

  useEffect(() => {
    getShow();
  }, [id, showId]);

  // Reset layout state when showId changes
  useEffect(() => {
    setLayoutLoaded(false);
    setTheatreLayout(null);
    setSelectedSeats([]);
    setOccupiedSeats([]);
  }, [showId]);

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats();
    }
  }, [selectedTime]);

  // Fetch theatre layout when show and selectedTime are set
  useEffect(() => {
    if (show && selectedTime && selectedTime.theatre && selectedTime.roomName && !layoutLoaded) {
      console.log('🔍 SeatLayout: useEffect triggered for theatre layout');
      console.log('🔍 SeatLayout: Theatre ID:', selectedTime.theatre);
      console.log('🔍 SeatLayout: Room Name:', selectedTime.roomName);
      
      // Use the getTheatreLayout function that properly finds the specific room
      getTheatreLayout(selectedTime.theatre, selectedTime.roomName);
    }
  }, [show, selectedTime, layoutLoaded]);

  // Render dynamic seats
  const renderDynamicSeats = (layout) => (
    <div className='seat-layout-container'>
      <div className='seat-grid'>
        {layout.map((row, rowIdx) => (
          <div key={rowIdx} className='seat-row'>
            {row.map((cell, colIdx) => {
              const seatId = `${String.fromCharCode(65 + rowIdx)}${colIdx + 1}`;
              let seatClass = 'seat-button';
              if (cell === 2) seatClass += ' seat-vip'; // VIP
              if (cell === 0) seatClass += ' seat-unavailable'; // Unavailable
              if (selectedSeats.includes(seatId)) seatClass += ' seat-selected';
              if (occupiedSeats.includes(seatId)) seatClass += ' seat-occupied';
              return (
                <button
                  key={seatId}
                  onClick={() => cell !== 0 && !occupiedSeats.includes(seatId) ? handleSeatClick(seatId) : null}
                  className={seatClass}
                  disabled={cell === 0 || occupiedSeats.includes(seatId)}
                  title={cell === 2 ? 'VIP' : cell === 0 ? 'Unavailable' : 'Regular'}
                >
                  {seatId}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  // Debug log before rendering
  if (theatreLayout) {
    console.log('🔍 SeatLayout: Rendering layout:', theatreLayout);
    console.log('🔍 SeatLayout: Layout loaded status:', layoutLoaded);
  }

  // Calculate seat price tally using show data prices
  let normalCount = 0, vipCount = 0;
  let seatPrice = selectedTime?.normalPrice || 100; // Use show's normal price
  let vipSeatPrice = selectedTime?.vipPrice || 150; // Use show's VIP price
  let totalPrice = 0;
  
  console.log('🔍 SeatLayout: Price info:', {
    normalPrice: selectedTime?.normalPrice,
    vipPrice: selectedTime?.vipPrice,
    selectedSeats: selectedSeats.length
  });
  
  if (theatreLayout && selectedSeats.length > 0) {
    selectedSeats.forEach(seatId => {
      // Parse seatId like 'A1' to row/col
      const rowIdx = seatId.charCodeAt(0) - 65;
      const colIdx = parseInt(seatId.slice(1), 10) - 1;
      const seatType = theatreLayout?.[rowIdx]?.[colIdx];
      if (seatType === 2) {
        vipCount++;
        totalPrice += vipSeatPrice;
      } else {
        normalCount++;
        totalPrice += seatPrice;
      }
    });
    
    console.log('🔍 SeatLayout: Price calculation:', {
      normalCount,
      vipCount,
      seatPrice,
      vipSeatPrice,
      totalPrice
    });
  }

  return show ? (
    <div className='seat-layout-page'>
      {/* Backdrop Background */}
      {movie && (
        <div 
          className="backdrop-overlay"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${movie.backdrop_url || image_base_url + movie.backdrop_path})`,
          }}
        />
      )}
      
      {/* Selected Show Information */}
      <div className='show-info-card'>
        <h2 className='show-info-title'>{movie?.title || 'Selected Movie'}</h2>
        <div className='show-info-details'>
          <div className='show-info-item'>
            <ClockIcon className='info-icon'/>
            <span className='info-text'>{selectedTime ? isoTimeFormat(selectedTime.time) : 'Loading...'}</span>
          </div>
          <div className='show-info-divider'>|</div>
          <div className='show-info-item'>
            <span className='info-text'>{selectedTime?.language || 'Unknown Language'}</span>
          </div>
          <div className='show-info-divider'>|</div>
          <div className='show-info-item'>
            <span className='info-text'>{selectedTime?.format || 'Normal'}</span>
          </div>
        </div>
        <div className='show-date-info'>
          <Calendar className='calendar-icon'/>
          <span className='date-text'>{show?.selectedDate ? new Date(show.selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : 'Loading...'}</span>
        </div>
        <div className='theatre-info-display'>
          <MapPinIcon className='location-icon'/>
          <span className='theatre-name-display'>{theatreName}</span>
          {theatreCity && <span className='theatre-city'>({theatreCity})</span>}
        </div>
      </div>

      {/* Seats Layout Card */}
      <div className='seat-layout-card'>
        <h1 className='seat-layout-title'>Select Your Seat</h1>
        <div className='screen-container'>
          <img src={assets.screenImage} alt="screen" className='screen-image'/>
          <p className='screen-label'>SCREEN SIDE</p>
        </div>

        {/* Seat Legend */}
        <div className='seat-legend'>
          <div className='legend-item'>
            <span className='legend-seat regular'></span>
            <span className='legend-text'>Regular</span>
          </div>
          <div className='legend-item'>
            <span className='legend-seat vip'></span>
            <span className='legend-text'>VIP</span>
          </div>
          <div className='legend-item'>
            <span className='legend-seat unavailable'></span>
            <span className='legend-text'>Unavailable</span>
          </div>
          <div className='legend-item'>
            <span className='legend-seat selected'></span>
            <span className='legend-text'>Selected</span>
          </div>
        </div>

        {/* Seat price tally */}
        {selectedSeats.length > 0 && (
          <div className='price-summary'>
            <div className='total-price'>
              Total: <span className='price-amount'>₹{totalPrice}</span>
            </div>
            <div className='price-breakdown'>
              {normalCount > 0 && <span>{normalCount} x Regular (₹{seatPrice})</span>}
              {normalCount > 0 && vipCount > 0 && <span> &nbsp;|&nbsp; </span>}
              {vipCount > 0 && <span>{vipCount} x VIP (₹{vipSeatPrice})</span>}
            </div>
          </div>
        )}

        {/* Show seat layout or prompt to select time */}
        {!selectedTime ? (
          <div className='loading-message'>Loading show details...</div>
        ) : Array.isArray(theatreLayout) && theatreLayout.length > 0
          ? renderDynamicSeats(theatreLayout)
          : (
            <div className='loading-message'>
              Loading layout...
            </div>
          )
        }

        <div className='checkout-button-container'>
          <button
            onClick={bookTickets}
            className='checkout-button'
            disabled={isBooking}
          >
            {isBooking ? 'Processing...' : 'Proceed to Checkout'}
            <ArrowRightIcon className="arrow-icon"/>
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayout
