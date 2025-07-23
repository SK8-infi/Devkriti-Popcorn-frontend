import React, { useState } from 'react';
import { dummyTrailers } from '../assets/assets';
import ReactPlayer from 'react-player';
import './TrailersSection.css';

const TrailersSection = () => {
  const [centerIdx, setCenterIdx] = useState(2); // Start with a middle trailer
  const [animDirection, setAnimDirection] = useState(null); // 'left' or 'right' or null

  const handleLeft = () => {
    if (centerIdx > 0) {
      setAnimDirection('left');
      setTimeout(() => {
        setCenterIdx(idx => idx - 1);
        setAnimDirection(null);
      }, 250);
    }
  };
  const handleRight = () => {
    if (centerIdx < dummyTrailers.length - 1) {
      setAnimDirection('right');
      setTimeout(() => {
        setCenterIdx(idx => idx + 1);
        setAnimDirection(null);
      }, 250);
    }
  };

  return (
    <section className="trailers-section" style={{ width: '100%', color: '#ffefcb', padding: '60px 0 80px 0', position: 'relative', marginBottom: '100px', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <p className="trailers-title" style={{ fontSize: '1.6rem', color: '#FFD6A0', letterSpacing: '1px', marginBottom: 32 }}>Trailers</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, position: 'relative', minHeight: 380 }}>
          <button onClick={handleLeft} disabled={centerIdx === 0} style={{ background: 'none', border: 'none', color: '#FFD6A0', fontSize: 40, cursor: centerIdx === 0 ? 'not-allowed' : 'pointer', padding: 0, marginRight: 12, zIndex: 2 }}>&#8592;</button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, width: 1100, overflow: 'visible', position: 'relative' }}>
            {/* Left trailer (if exists) */}
            {centerIdx > 0 && (
              <div style={{
                minWidth: 340,
                maxWidth: 380,
                height: 260,
                opacity: 0.6,
                transform: 'scale(0.8) translateX(40px)',
                zIndex: 1,
                borderRadius: 16,
                overflow: 'hidden',
                background: '#111',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                marginRight: -60,
                transition: 'all 0.3s',
              }}>
                <ReactPlayer
                  url={dummyTrailers[centerIdx - 1].videoUrl}
                  controls={false}
                  width="100%"
                  height="260px"
                  style={{ borderRadius: 16, background: '#111' }}
                />
              </div>
            )}
            {/* Center trailer with animation */}
            <div
              className={`center-trailer-anim${animDirection ? ' anim-' + animDirection : ''}`}
              style={{
                minWidth: 900,
                maxWidth: 1100,
                height: 520,
                zIndex: 2,
                borderRadius: 28,
                overflow: 'hidden',
                background: '#111',
                boxShadow: '0 8px 32px 0 rgba(255,214,0,0.10)',
                margin: '0 0',
                transition: 'all 0.3s',
                position: 'relative',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <ReactPlayer
                url={dummyTrailers[centerIdx].videoUrl}
                controls={true}
                width="100%"
                height="520px"
                style={{ borderRadius: 28, background: '#111' }}
              />
            </div>
            {/* Right trailer (if exists) */}
            {centerIdx < dummyTrailers.length - 1 && (
              <div style={{
                minWidth: 340,
                maxWidth: 380,
                height: 260,
                opacity: 0.6,
                transform: 'scale(0.8) translateX(-40px)',
                zIndex: 1,
                borderRadius: 16,
                overflow: 'hidden',
                background: '#111',
                boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)',
                marginLeft: -60,
                transition: 'all 0.3s',
              }}>
                <ReactPlayer
                  url={dummyTrailers[centerIdx + 1].videoUrl}
                  controls={false}
                  width="100%"
                  height="260px"
                  style={{ borderRadius: 16, background: '#111' }}
                />
              </div>
            )}
          </div>
          <button onClick={handleRight} disabled={centerIdx === dummyTrailers.length - 1} style={{ background: 'none', border: 'none', color: '#FFD6A0', fontSize: 40, cursor: centerIdx === dummyTrailers.length - 1 ? 'not-allowed' : 'pointer', padding: 0, marginLeft: 12, zIndex: 2 }}>&#8594;</button>
        </div>
      </div>
    </section>
  );
};

export default TrailersSection;
