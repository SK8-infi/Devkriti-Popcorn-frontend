import React from 'react';

const AboutUs = () => {
  return (
    <section
      style={{
        background: '#000',
        color: '#ffefcb',
        minHeight: '40vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '60px 0 40px 0',
        position: 'relative',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <p className='aboutus-title' style={{ fontSize: '1.6rem', fontFamily: 'Gotham, Arial, sans-serif', margin: 0, marginBottom: '2.5rem', letterSpacing: '1px', color: '#FFD6A0', textAlign: 'left' }}>
          About Us
        </p>
      </div>
    </section>
  );
};

export default AboutUs; 