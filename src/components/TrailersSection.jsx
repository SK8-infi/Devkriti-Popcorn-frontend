import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import { PlayCircleIcon } from 'lucide-react'
import './TrailersSection.css'

const TrailersSection = () => {
  const [currentIdx, setCurrentIdx] = useState(0)

  return (
    <section className='trailers-section' style={{ width: '100%', background: '#000', color: '#ffefcb', padding: '60px 0 40px 0', position: 'relative' }}>
      <div style={{ position: 'relative', zIndex: 2 }}>
        <p className='trailers-title' style={{ textAlign: 'left', margin: 0, fontFamily: 'Gotham, Arial, sans-serif', fontSize: '1.6rem', color: '#FFD6A0', letterSpacing: '1px' }}>Trailers</p>
        <div className='trailers-inline-row'>
          {dummyTrailers.map((trailer, idx) => (
            <div key={idx} className='trailer-card'>
              <img src={trailer.image} alt={trailer.videoUrl || 'Trailer'} className='trailer-thumbnail' />
              <div className='trailer-info'>
                <h4>{trailer.title || 'Trailer'}</h4>
                <p>{trailer.duration || ''}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrailersSection
