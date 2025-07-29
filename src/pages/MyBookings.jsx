import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../assets/assets'
import Loading from '../components/Loading'
import timeFormat from '../lib/timeFormat'
import { dateFormat } from '../lib/dateFormat'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'
import './MyBookings.css'

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY

  const { api, user, image_base_url, login } = useAppContext()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getMyBookings = async () =>{
    try {
      const {data} = await api.get('/api/user/bookings')
      if (data.success) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    if(user){
      getMyBookings()
    } else {
      setIsLoading(false)
    }
  },[user])

  if (!user) {
    return (
      <div className='mybookings-empty' style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 className='mybookings-empty-title'>You need to be logged in to view your bookings.</h1>
        <div style={{ marginTop: '1.5rem' }}>
          <button onClick={login} className='mybookings-pay-btn'>Login with Google</button>
        </div>
      </div>
    )
  }

  if (isLoading) return <Loading />

  // Only show paid bookings
  const paidBookings = bookings.filter(item => item.isPaid);

  if (paidBookings.length === 0) {
    return (
      <div className='mybookings-container'>
        <h1 className='mybookings-title'>My Bookings</h1>
        <div className='mybookings-empty'>
          <h2 className='mybookings-empty-title'>You have not made any bookings yet.</h2>
        </div>
      </div>
    )
  }

  return (
    <div className='mybookings-container'>
      <h1 className='mybookings-title'>My Bookings</h1>

      {paidBookings.map((item,index)=>(
        <div key={index} className='mybookings-card'>
          <div className='mybookings-card-inner'>
            <img src={image_base_url + item.show.movie.poster_path} alt="" className='mybookings-poster'/>
            <div className='mybookings-details'>
              <p className='mybookings-movie-title alta-font'>{item.show.movie.title}</p>
              <p className='mybookings-meta'>{timeFormat(item.show.movie.runtime)}</p>
              <p className='mybookings-meta'>{dateFormat(item.show.showDateTime)}</p>
            </div>
          </div>

          <div className='mybookings-side'>
            <div className='mybookings-side-top'>
              <p className='mybookings-amount'>{currency}{item.amount}</p>
            </div>
            <div className='mybookings-tickets'>
              <p><span>Total Tickets:</span> {item.bookedSeats.length}</p>
              <p><span>Seat Number:</span> {item.bookedSeats.join(", ")}</p>
            </div>
          </div>

        </div>
      ))}

    </div>
  )
}

export default MyBookings
