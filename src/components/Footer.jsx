import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import logo from '../assets/logo.png'
import ticket from '../assets/ticket.svg'
import GlareHover from './GlareHover'
import ResponsiveContainer from './ResponsiveContainer'
import useResponsive from '../hooks/useResponsive'

const Footer = () => {
  const navigate = useNavigate();
  const { isTinyMobile, getResponsiveValue } = useResponsive();

  const responsiveLogoSize = getResponsiveValue({
    xl: '144px',
    lg: '120px',
    md: '100px',
    sm: '80px',
    xs: '60px',
    tiny: '50px',
  });

  const responsivePartnerWidth = getResponsiveValue({
    xl: '50%',
    lg: '60%',
    md: '70%',
    sm: '80%',
    xs: '90%',
    tiny: '95%',
  });

  const responsivePartnerPadding = getResponsiveValue({
    xl: '22.5px',
    lg: '20px',
    md: '18px',
    sm: '16px',
    xs: '14px',
    tiny: '12px',
  });

  const responsiveSocialSize = getResponsiveValue({
    xl: '40px',
    lg: '35px',
    md: '30px',
    sm: '25px',
    xs: '20px',
    tiny: '18px',
  });

  return (
    <ResponsiveContainer>
      <footer className='footer-section' style={{ 
        zIndex: 60, 
        position: 'sticky', 
        top: '54px', 
        padding: '0 0 20px 0' 
      }}>
        {/* Logo with horizontal line design */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginTop: isTinyMobile ? '40px' : '60px'
        }}>
          <div style={{ 
            flex: 1, 
            height: '1px', 
            background: '#444', 
            marginRight: isTinyMobile ? '10px' : '20px' 
          }}></div>
          <div style={{ 
            padding: isTinyMobile ? '4px 8px' : '8px 16px', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img src={logo} alt="Popcorn Logo" style={{ 
              height: responsiveLogoSize, 
              width: 'auto' 
            }} />
          </div>
          <div style={{ 
            flex: 1, 
            height: '1px', 
            background: '#444', 
            marginLeft: isTinyMobile ? '10px' : '20px' 
          }}></div>
        </div>

        {/* Partner Banner - Redesigned */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', 
          margin: '0 auto 40px auto', 
          marginTop: '0px',
          padding: responsivePartnerPadding, 
          borderRadius: '16px',
          border: '1px solid #333',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: isTinyMobile ? '15px' : '25px',
          width: responsivePartnerWidth,
          maxWidth: '600px',
          flexDirection: isTinyMobile ? 'column' : 'row',
          textAlign: isTinyMobile ? 'center' : 'left'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            flex: 1, 
            minWidth: isTinyMobile ? '150px' : '200px',
            justifyContent: isTinyMobile ? 'center' : 'flex-start'
          }}>
            <div style={{ color: '#fff' }}>
              <div style={{ 
                fontSize: isTinyMobile ? '16px' : '18px', 
                fontWeight: 'bold', 
                marginBottom: '6px', 
                color: '#FFD6A0' 
              }}>
                List your Show
              </div>
              <div style={{ 
                fontSize: isTinyMobile ? '12px' : '14px', 
                lineHeight: '1.5', 
                color: '#ccc' 
              }}>
                Got a show to be listed? Partner with us & get listed on Popcorn
              </div>
            </div>
          </div>
          <GlareHover
            width="auto"
            height="auto"
            background="linear-gradient(135deg, #FFD6A0 0%, #FFA500 100%)"
            borderRadius="8px"
            borderColor="transparent"
            glareColor="#ffffff"
            glareOpacity={0.3}
            glareAngle={-30}
            glareSize={300}
            transitionDuration={800}
            playOnce={false}
            style={{ display: 'inline-block' }}
          >
            <button 
              onClick={() => {
                navigate('/contact');
                window.scrollTo(0, 0);
              }}
              style={{
                background: 'transparent',
                color: '#000',
                border: 'none',
                padding: isTinyMobile ? '8px 16px' : '10.5px 21px',
                borderRadius: '8px',
                fontSize: isTinyMobile ? '13px' : '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: 'none',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                pointerEvents: 'auto'
              }}>
              Contact today!
            </button>
          </GlareHover>
        </div>

        {/* Social Media Icons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: isTinyMobile ? '15px' : '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{ 
            width: responsiveSocialSize, 
            height: responsiveSocialSize, 
            borderRadius: '50%', 
            background: '#333', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#fff', 
            fontSize: isTinyMobile ? '14px' : '16px' 
          }}>f</div>
          <div style={{ 
            width: responsiveSocialSize, 
            height: responsiveSocialSize, 
            borderRadius: '50%', 
            background: '#333', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#fff', 
            fontSize: isTinyMobile ? '14px' : '16px' 
          }}>X</div>
          <div style={{ 
            width: responsiveSocialSize, 
            height: responsiveSocialSize, 
            borderRadius: '50%', 
            background: '#333', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#fff', 
            fontSize: isTinyMobile ? '14px' : '16px' 
          }}></div>
          <div style={{ 
            width: responsiveSocialSize, 
            height: responsiveSocialSize, 
            borderRadius: '50%', 
            background: '#333', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#fff', 
            fontSize: isTinyMobile ? '14px' : '16px' 
          }}>▶</div>
        </div>

        {/* Copyright */}
        <div style={{ 
          textAlign: 'center', 
          color: '#666', 
          fontSize: isTinyMobile ? '12px' : '14px',
          marginBottom: '20px' 
        }}>
          © 2024 Popcorn. All rights reserved.
        </div>
      </footer>
    </ResponsiveContainer>
  )
}

export default Footer
