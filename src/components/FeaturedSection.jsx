import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'
import './FeaturedSection.css'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const {shows } = useAppContext()

    // Get unique movies from shows
    const uniqueMoviesMap = new Map();
    shows.forEach(show => {
      if (show.movie && !uniqueMoviesMap.has(show.movie._id)) {
        uniqueMoviesMap.set(show.movie._id, show);
      }
    });
    const uniqueShows = Array.from(uniqueMoviesMap.values());

  return (
    <section className='featured-section' style={{ width: '100%', color: '#ffefcb', padding: '20px 0 80px 0', position: 'relative', marginBottom: '60px', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className='featured-header' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingTop: '2.5rem', paddingBottom: '1.5rem' }}>
          <p className='featured-title' style={{ textAlign: 'left', margin: 0, fontFamily: 'Gotham, Arial, sans-serif', fontSize: '1.6rem', color: '#ffefcb', letterSpacing: '1px' }}>NOW SHOWING</p>
          <button onClick={()=> navigate('/movies')} className='featured-viewall-btn'>
              View All 
              <ArrowRight style={{transition: 'transform 0.2s'}}/>
          </button>
        </div>
<<<<<<< Updated upstream
        <div className='featured-movies' style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%' }}>
          {uniqueShows.map((show)=>(
              <MovieCard key={show.movie._id || show.movie.id} movie={{ ...show.movie, id: show.movie.id || show.movie._id }}/>
=======
          <div className='featured-movies' style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', flexWrap: 'wrap', marginTop: 32 }}>
            {uniqueShows.map((show)=>(
                <MovieCard key={show.movie._id} movie={show.movie}/>
>>>>>>> Stashed changes
          ))}
        </div>
      </div>
    </div>
    </section>
  )
}

export default FeaturedSection
