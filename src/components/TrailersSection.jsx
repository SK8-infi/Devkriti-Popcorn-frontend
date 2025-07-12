import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import ReactPlayer from 'react-player'
import { PlayCircleIcon } from 'lucide-react'
import './TrailersSection.css'
import redCurtain from '../assets/red-curtain.svg';

const TrailersSection = () => {
  const [currentIdx, setCurrentIdx] = useState(0)

  return (
    <div className='trailers-section' style={{ zIndex: 30, position: 'sticky', top: '54px', background: 'none', color: '#ffefcb', height: 'calc(100vh - 54px)', overflow: 'hidden' }}>
      <img src={redCurtain} alt="Red Curtain" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.45)', zIndex: 1, pointerEvents: 'none' }} />
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
    </div>
  )
}

export default TrailersSection
