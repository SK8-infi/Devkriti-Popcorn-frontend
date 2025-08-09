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

  }, [user]);

  // Handle payment failures from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentFailed = urlParams.get('payment_failed');
    const bookingId = urlParams.get('booking_id');
    
    if (paymentFailed === 'true' && bookingId) {
      
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
      
          } catch (error) {
        // Error handling payment failure
      }
  }

  const getShow = async () =>{
    try {
  
      const [{ data }, { data: movieData }] = await Promise.all([
        axios.get(`/api/show/${id}`),
        axios.get(`/api/movies/${id}`)
      ]);
      if (data.success && movieData.movie){

        setMovie(movieData.movie);
        // Find the specific showtime using showId
        const allShows = data.dateTime || {};
        let foundShow = null;
        
        
        
        // Search through all dates and showtimes to find the specific showId
        for (const [date, showtimes] of Object.entries(allShows)) {
          
          for (const showtime of showtimes) {
            
            if (showtime.showId === showId) {
              
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

          setShow(foundShow);
          setSelectedTime(foundShow.selectedShowtime);
          
          // Get the theatre layout for the specific room
          
          await getTheatreLayout(foundShow.selectedShowtime.theatre, foundShow.selectedShowtime.roomName);
        } else {
          
          toast.error('Show not found');
        }
      }
    } catch (error) {
      
      toast.error('Failed to load show details');
    }
  }

  // Get theatre layout for the specific room
  const getTheatreLayout = async (theatreId, roomName) => {
    try {
  
      const { data } = await axios.get(`/api/admin/theatre/${theatreId}`);
      if (data.success && data.theatre) {
        const theatre = data.theatre;
        
        
        // Set theatre name and city
        setTheatreName(theatre.name || 'Unknown Theatre');
        setTheatreCity(theatre.city || '');
        
        // Find the specific room by name
        const room = theatre.rooms?.find(r => r.name === roomName);
        if (room && room.layout) {
          
          setTheatreLayout(room.layout);
          setLayoutLoaded(true); // Mark layout as loaded
        } else {
          
          // Use default layout if room not found, but don't override existing layout
          if (!theatreLayout) {
            setTheatreLayout(Array(8).fill().map(() => Array(10).fill(1)));
            setLayoutLoaded(true); // Mark layout as loaded even with default
          }
        }
      } else {
        
        // Only set default layout if no layout exists
        if (!theatreLayout) {
          setTheatreLayout(Array(8).fill().map(() => Array(10).fill(1)));
          setLayoutLoaded(true); // Mark layout as loaded even with default
        }
      }
    } catch (error) {
      
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
      
    }
  }


  const bookTickets = async ()=>{
    try {
      setIsBooking(true);
      
      
      if(!user) {
        
        toast.error('Please login to book tickets')
        setIsBooking(false);
        return
      }

      if(!selectedTime || !selectedSeats.length) {
        setIsBooking(false);
        return toast.error('Please select a time and seats');
      }

      // Calculate total amount based on seat types and prices
      let totalAmount = 0;
      selectedSeats.forEach(seatId => {
        const rowIdx = seatId.charCodeAt(0) - 65;
        const colIdx = parseInt(seatId.slice(1), 10) - 1;
        const seatType = theatreLayout?.[rowIdx]?.[colIdx];
        
        // Skip unavailable seats (value 0) - they shouldn't be selectable anyway
        if (seatType === 0) return;
        
        // Ensure prices exist and are valid numbers
        const silverPrice = Number(selectedTime.silverPrice) || 100;
        const goldPrice = Number(selectedTime.goldPrice) || 150;
        const premiumPrice = Number(selectedTime.premiumPrice) || 200;
        
        if (seatType === 3) {
          totalAmount += premiumPrice;
        } else if (seatType === 2) {
          totalAmount += goldPrice;
        } else {
          totalAmount += silverPrice;
        }
      });
      
      // Validate total amount
      if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
        toast.error('Error calculating ticket price. Please try again.');
        setIsBooking(false);
        return;
      }

      const token = await getToken();

      toast.loading('Creating booking...', { id: 'booking' });

      const {data} = await axios.post('/api/booking/create', {
        showId: selectedTime.showId, 
        selectedSeats,
        totalAmount // Pass the calculated total amount
      }, {headers: { Authorization: `Bearer ${token}` }});

      toast.dismiss('booking');

      if (data.success){
        toast.success('Redirecting to payment...');
        try {
          // Try to redirect to Stripe
          window.location.href = data.url;
        } catch (redirectError) {
          // Fallback: open in new window
          window.open(data.url, '_blank');
          toast.success('Payment page opened in new window');
        }
      }else{
        toast.error(data.message)
        // Clear selected seats if booking failed so user can retry
        setSelectedSeats([]);
      }
    } catch (error) {
      toast.dismiss('booking');
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
              
              // Don't render unavailable seats (value 0) - creates custom theatre shapes
              if (cell === 0) {
                return (
                  <div 
                    key={seatId} 
                    className='seat-empty-space'
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      margin: '2px',
                      display: 'inline-block' 
                    }}
                  />
                );
              }
              
              let seatClass = 'seat-button';
              if (cell === 3) seatClass += ' seat-premium'; // Premium
              if (cell === 2) seatClass += ' seat-gold'; // Gold
              if (selectedSeats.includes(seatId)) seatClass += ' seat-selected';
              if (occupiedSeats.includes(seatId)) seatClass += ' seat-occupied';
              
              return (
                <button
                  key={seatId}
                  onClick={() => !occupiedSeats.includes(seatId) ? handleSeatClick(seatId) : null}
                  className={seatClass}
                  disabled={occupiedSeats.includes(seatId)}
                  title={cell === 3 ? 'Premium' : cell === 2 ? 'Gold' : 'Silver'}
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



  // Calculate seat price tally using show data prices
  let silverCount = 0, goldCount = 0, premiumCount = 0;
  let silverPrice = selectedTime?.silverPrice || 100; // Use show's silver price
  let goldPrice = selectedTime?.goldPrice || 150; // Use show's gold price
  let premiumPrice = selectedTime?.premiumPrice || 200; // Use show's premium price
  let totalPrice = 0;
  

  
  if (theatreLayout && selectedSeats.length > 0) {
    selectedSeats.forEach(seatId => {
      // Parse seatId like 'A1' to row/col
      const rowIdx = seatId.charCodeAt(0) - 65;
      const colIdx = parseInt(seatId.slice(1), 10) - 1;
      const seatType = theatreLayout?.[rowIdx]?.[colIdx];
      
      // Skip unavailable seats (value 0) - they shouldn't be selectable anyway
      if (seatType === 0) return;
      
      if (seatType === 3) {
        premiumCount++;
        totalPrice += premiumPrice;
      } else if (seatType === 2) {
        goldCount++;
        totalPrice += goldPrice;
      } else {
        silverCount++;
        totalPrice += silverPrice;
      }
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
            <span className='legend-seat silver'></span>
            <span className='legend-text'>Silver</span>
          </div>
          <div className='legend-item'>
            <span className='legend-seat gold'></span>
            <span className='legend-text'>Gold</span>
          </div>
          <div className='legend-item'>
            <span className='legend-seat premium'></span>
            <span className='legend-text'>Premium</span>
          </div>
          <div className='legend-item'>
            <span className='legend-seat selected'></span>
            <span className='legend-text'>Selected</span>
          </div>
          <div className='legend-item'>
            <span className='legend-seat occupied'></span>
            <span className='legend-text'>Occupied</span>
          </div>
        </div>

        {/* Seat price tally */}
        {selectedSeats.length > 0 && (
          <div className='price-summary'>
            <div className='total-price'>
              Total: <span className='price-amount'>₹{totalPrice}</span>
            </div>
            <div className='price-breakdown'>
              {silverCount > 0 && <span>{silverCount} x Silver (₹{silverPrice})</span>}
              {silverCount > 0 && (goldCount > 0 || premiumCount > 0) && <span> &nbsp;|&nbsp; </span>}
              {goldCount > 0 && <span>{goldCount} x Gold (₹{goldPrice})</span>}
              {goldCount > 0 && premiumCount > 0 && <span> &nbsp;|&nbsp; </span>}
              {premiumCount > 0 && <span>{premiumCount} x Premium (₹{premiumPrice})</span>}
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
