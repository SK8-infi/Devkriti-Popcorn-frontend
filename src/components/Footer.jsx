import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import logo from '../assets/logo.png'
import ticket from '../assets/ticket.svg'

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className='footer-section' style={{ zIndex: 60, position: 'sticky', top: '54px', background: '#000', padding: '40px 0 20px 0' }}>
      {/* Logo with horizontal line design */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '5px', marginTop: '60px' }}>
        <div style={{ flex: 1, height: '1px', background: '#444', marginRight: '20px' }}></div>
        <div style={{ 
          padding: '8px 16px', 
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img src={logo} alt="Popcorn Logo" style={{ height: '144px', width: 'auto' }} />
        </div>
        <div style={{ flex: 1, height: '1px', background: '#444', marginLeft: '20px' }}></div>
      </div>

      {/* Partner Banner - Redesigned */}
      <div style={{ 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', 
        margin: '0 auto 40px auto', 
        marginTop: '0px',
        padding: '22.5px', 
        borderRadius: '16px',
        border: '1px solid #333',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '25px',
        width: '50%',
        maxWidth: '600px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '200px' }}>
          <div style={{ color: '#fff' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '6px', color: '#FFD600' }}>
              List your Show
            </div>
            <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#ccc' }}>
              Got a show to be listed? Partner with us & get listed on Popcorn
            </div>
          </div>
        </div>
        <button 
          onClick={() => {
            navigate('/contact');
            window.scrollTo(0, 0);
          }}
          style={{
            background: 'linear-gradient(135deg, #FFD600 0%, #FFA500 100%)',
            color: '#000',
            border: 'none',
            padding: '10.5px 21px',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(255, 214, 0, 0.3)',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 214, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 16px rgba(255, 214, 0, 0.3)';
          }}>
          Contact today!
        </button>
      </div>

      {/* Social Media Icons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px' }}>f</div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px' }}>X</div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px' }}>📷</div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px' }}>▶</div>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px' }}>in</div>
      </div>

      {/* Copyright */}
      <div style={{ textAlign: 'center', color: '#888', fontSize: '12px', lineHeight: '1.5' }}>
        <p>Copyright {new Date().getFullYear()} © Popcorn. All Rights Reserved.</p>
        <p style={{ marginTop: '8px', fontSize: '11px' }}>
          All content on this website is protected by copyright law. Unauthorized use or reproduction of any content is strictly prohibited.
        </p>
      </div>
    </footer>
  )
}

export default Footer
