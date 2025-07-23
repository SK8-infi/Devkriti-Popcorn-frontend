import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'
import './SeatLayout.css'

const SeatLayout = () => {

  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]]

  const {id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const [occupiedSeats, setOccupiedSeats] = useState([])
  const [theatreLayout, setTheatreLayout] = useState(null)
  const [theatreName, setTheatreName] = useState("")
  const [theatreCity, setTheatreCity] = useState("")

  const navigate = useNavigate()

  const {axios, getToken, user} = useAppContext();

  const getShow = async () =>{
    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success){
        setShow(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSeatClick = (seatId) =>{
      if (!selectedTime) {
        return toast("Please select time first")
      }
      if(!selectedSeats.includes(seatId) && selectedSeats.length > 4){
        return toast("You can only select 5 seats")
      }
      if(occupiedSeats.includes(seatId)){
        return toast('This seat is already booked')
      }
      setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(seat => seat !== seatId) : [...prev, seatId])
  }

  const renderSeats = (row, count = 9)=>(
    <div key={row} className="flex gap-2 mt-2">
            <div className="flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: count }, (_, i) => {
                    const seatId = `${row}${i + 1}`;
                    return (
                        <button key={seatId} onClick={() => handleSeatClick(seatId)} className={`h-8 w-8 rounded border border-primary/60 cursor-pointer${selectedSeats.includes(seatId) ? ' seat-selected-yellow' : ''}${occupiedSeats.includes(seatId) ? ' opacity-50' : ''}`}>
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
      if(!user) return toast.error('Please login to proceed')

        if(!selectedTime || !selectedSeats.length) return toast.error('Please select a time and seats');

        const {data} = await axios.post('/api/booking/create', {showId: selectedTime.showId, selectedSeats}, {headers: { Authorization: `Bearer ${await getToken()}` }});

        if (data.success){
          window.location.href = data.url;
        }else{
          toast.error(data.message)
        }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(()=>{
    getShow()
  },[])

  useEffect(()=>{
    if(selectedTime){
      getOccupiedSeats()
    }
  },[selectedTime])

  // Fetch theatre layout when show and selectedTime are set
  useEffect(() => {
    if (show && selectedTime) {
      const theatreId = selectedTime.theatre;
      if (!theatreId) return;
      axios.get(`/api/admin/theatre/${theatreId}`)
        .then(res => {
          if (res.data.success && res.data.theatre) {
            setTheatreLayout(res.data.theatre.layout);
            setTheatreName(res.data.theatre.name);
            setTheatreCity(res.data.theatre.city);
            console.log('Loaded layout:', res.data.theatre.layout);
          }
        })
        .catch(() => {});
    }
  }, [show, selectedTime, axios]);

  // Render dynamic seats
  const renderDynamicSeats = (layout) => (
    <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
      <div className='flex flex-col gap-2'>
        {layout.map((row, rowIdx) => (
          <div key={rowIdx} className='flex gap-2 mb-2'>
            {row.map((cell, colIdx) => {
              const seatId = `${String.fromCharCode(65 + rowIdx)}${colIdx + 1}`;
              let seatClass = 'h-8 w-8 rounded border border-primary/60 cursor-pointer';
              if (cell === 2) seatClass += ' bg-yellow-300 text-black font-bold'; // VIP
              if (cell === 0) seatClass += ' opacity-30 cursor-not-allowed'; // Unavailable
              if (selectedSeats.includes(seatId)) seatClass += ' seat-selected-yellow';
              if (occupiedSeats.includes(seatId)) seatClass += ' opacity-50';
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
    console.log('Rendering layout:', theatreLayout);
  }

  // Calculate seat price tally (hardcoded: base 100, VIP 150)
  let normalCount = 0, vipCount = 0;
  let seatPrice = 100;
  let vipSeatPrice = 150;
  let totalPrice = 0;
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
  }

  return show ? (
    <div className='flex flex-col md:flex-row gap-8 px-2 md:px-10 lg:px-32 py-10 md:pt-20 bg-gradient-to-br from-[#181818] to-[#232323] min-h-[90vh]'>
      {/* Available Timings */}
      <div className='w-full md:w-72 bg-white/10 border border-primary/20 rounded-2xl py-8 h-max md:sticky md:top-28 shadow-lg flex flex-col items-center'>
        <p className='text-xl font-bold px-6 mb-4 text-primary tracking-wide'>Available Timings</p>
        <div className='flex flex-col gap-2 w-full px-4'>
          {show.dateTime[date].map((item)=>(
<<<<<<< Updated upstream
            <button
              key={item.time}
              onClick={()=> setSelectedTime(item)}
              className={`flex items-center gap-2 px-5 py-3 w-full rounded-lg cursor-pointer transition font-semibold text-base border-2 ${selectedTime?.time === item.time ? 'bg-primary text-white border-primary scale-105 shadow' : 'bg-white/20 text-primary border-primary/20 hover:bg-primary/10'}`}
              style={{outline: selectedTime?.time === item.time ? '2px solid #FFD600' : 'none'}}
            >
              <ClockIcon className={`w-5 h-5 ${selectedTime?.time === item.time ? 'text-yellow-300' : 'text-primary'}`}/>
              <span>{isoTimeFormat(item.time)}</span>
            </button>
=======
            <div
              key={item.time}
              onClick={()=> setSelectedTime(item)}
              className={`timing-glass${selectedTime?.time === item.time ? ' selected' : ''}`}
            >
              <ClockIcon className='w-4 h-4'/>
              <span>{isoTimeFormat(item.time)}</span>
            </div>
>>>>>>> Stashed changes
          ))}
        </div>
      </div>

      {/* Seats Layout Card */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-10'>
        <div className='w-full max-w-2xl bg-white/10 border border-primary/20 rounded-2xl shadow-2xl p-8 flex flex-col items-center'>
          <h1 className='text-3xl font-bold mb-2 text-primary tracking-tight'>Select Your Seat</h1>
          <div className='mb-2 text-lg font-semibold text-primary'>{theatreName} <span className='text-gray-400 text-base font-normal'>({theatreCity})</span></div>
          <img src={assets.screenImage} alt="screen" className='w-2/3 max-w-xs my-2'/>
          <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

          {/* Seat Legend */}
          <div className='flex gap-6 mb-6 items-center'>
            <div className='flex items-center gap-2'><span className='inline-block w-6 h-6 rounded bg-green-500 border-2 border-primary'></span> <span className='text-white text-sm'>Regular</span></div>
            <div className='flex items-center gap-2'><span className='inline-block w-6 h-6 rounded bg-yellow-300 border-2 border-yellow-500'></span> <span className='text-yellow-200 text-sm'>VIP</span></div>
            <div className='flex items-center gap-2'><span className='inline-block w-6 h-6 rounded bg-gray-400 border-2 border-gray-500 opacity-40'></span> <span className='text-gray-300 text-sm'>Unavailable</span></div>
            <div className='flex items-center gap-2'><span className='inline-block w-6 h-6 rounded bg-primary border-2 border-yellow-300'></span> <span className='text-yellow-300 text-sm'>Selected</span></div>
          </div>

<<<<<<< Updated upstream
          {/* Seat price tally (sticky on desktop) */}
          {selectedSeats.length > 0 && (
            <div className='mb-6 text-base font-medium text-white bg-primary/90 px-8 py-4 rounded-xl flex flex-col items-center gap-1 shadow-lg md:sticky md:top-8 z-10'>
              <div>Total: <span className='text-yellow-300 font-bold text-xl'>₹{totalPrice}</span></div>
              <div className='text-xs text-gray-200'>
                {normalCount > 0 && <span>{normalCount} x Regular (₹{seatPrice})</span>}
                {normalCount > 0 && vipCount > 0 && <span> &nbsp;|&nbsp; </span>}
                {vipCount > 0 && <span>{vipCount} x VIP (₹{vipSeatPrice})</span>}
              </div>
            </div>
          )}
=======
          <button onClick={bookTickets} className='proceed-btn flex items-center gap-1'>
            Proceed to Checkout
            <ArrowRightIcon strokeWidth={3} className="w-4 h-4"/>
          </button>
>>>>>>> Stashed changes

          {/* Show seat layout or prompt to select time */}
          {!selectedTime ? (
            <div className='mt-10 text-lg text-yellow-300 font-semibold'>Please select a time first</div>
          ) : Array.isArray(theatreLayout) && theatreLayout.length > 0
            ? renderDynamicSeats(theatreLayout)
            : (
              <div className='mt-10'>
                Loading layout...
                <pre style={{color: 'red', fontSize: 12}}>
                  {JSON.stringify(theatreLayout, null, 2)}
                </pre>
              </div>
            )
          }

          <button
            onClick={bookTickets}
            className='flex items-center gap-2 mt-10 px-12 py-4 text-lg bg-yellow-300 text-primary font-bold rounded-full shadow-lg hover:bg-yellow-400 transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2'
            style={{minWidth: 200}}
          >
            Proceed to Checkout
            <ArrowRightIcon strokeWidth={3} className="w-6 h-6"/>
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default SeatLayout
