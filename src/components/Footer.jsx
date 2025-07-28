import React from 'react'
import { assets } from '../assets/assets'
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <footer className='footer-section' style={{ zIndex: 60, position: 'sticky', top: '54px', background: '#000', padding: '40px 0 20px 0' }}>
      {/* Logo with horizontal line design */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
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
