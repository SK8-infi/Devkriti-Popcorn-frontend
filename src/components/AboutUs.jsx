import React from 'react';
import whiteCurtain from '../assets/white-curtain.svg';

const AboutUs = () => {
  return (
    <section
      style={{
        background: 'none',
        color: '#ffefcb',
        minHeight: 'calc(100vh - 54px)',
        height: 'calc(100vh - 54px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'sticky',
        top: '54px',
        overflow: 'hidden',
        zIndex: 40,
      }}
    >
      <img src={whiteCurtain} alt="White Curtain" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <p className='aboutus-title' style={{ fontSize: '1.6rem', fontFamily: 'Gotham, Arial, sans-serif', margin: 0, marginBottom: '2.5rem', letterSpacing: '1px', color: '#FFD6A0', textAlign: 'left' }}>
          About Us
        </p>
      </div>
    </section>
  );
};

export default AboutUs; 