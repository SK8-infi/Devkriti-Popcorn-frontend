import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'
import './FeaturedSection.css'
import seagreenCurtain from '../assets/seagreen-curtain.svg';

const FeaturedSection = () => {

    const navigate = useNavigate()
    const {shows } = useAppContext()

  return (
    <div className='featured-section' style={{ zIndex: 20, position: 'sticky', top: '54px', background: 'none', color: '#ffefcb', height: 'calc(100vh - 54px)', padding: '0 4vw', overflow: 'hidden' }}>
      <img src={seagreenCurtain} alt="Sea Green Curtain" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className='featured-header' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingTop: '2.5rem', paddingBottom: '1.5rem' }}>
          <p className='featured-title' style={{ textAlign: 'left', margin: 0, fontFamily: 'Gotham, Arial, sans-serif', fontSize: '1.6rem', color: '#ffefcb', letterSpacing: '1px' }}>NOW SHOWING</p>
          <button onClick={()=> navigate('/movies')} className='featured-viewall-btn'>
              View All 
              <ArrowRight style={{transition: 'transform 0.2s'}}/>
          </button>
        </div>
        <div className='featured-movies' style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%' }}>
          {shows.map((show)=>(
              <MovieCard key={show._id} movie={show.movie}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturedSection
