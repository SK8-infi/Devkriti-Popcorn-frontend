import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircleIcon, LoaderIcon } from 'lucide-react'
import Loading from '../components/Loading'

const LoadingPage = () => {
  const [countdown, setCountdown] = useState(3)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          // Use setTimeout to avoid state update during render
          setTimeout(() => navigate('/my-bookings'), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#181818] to-[#232323] flex items-center justify-center'>
      <div className='text-center'>
        <div className='mb-6'>
          <CheckCircleIcon className='w-16 h-16 text-green-500 mx-auto mb-4' />
          <h1 className='text-3xl font-bold text-primary mb-2'>Payment Successful!</h1>
          <p className='text-gray-300 mb-4'>Your booking has been confirmed</p>
        </div>
        
        <div className='flex items-center justify-center gap-2 text-gray-400'>
          <LoaderIcon className='w-5 h-5 animate-spin' />
          <span>Redirecting to My Bookings in {countdown} seconds...</span>
        </div>
        
        <button 
          onClick={() => navigate('/my-bookings')}
          className='mt-6 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/80 transition'
        >
          Go to My Bookings
        </button>
      </div>
    </div>
  )
}

export default LoadingPage 