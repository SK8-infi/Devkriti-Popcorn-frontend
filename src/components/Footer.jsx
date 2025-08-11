import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import logo from '../assets/logo.png'
import ticket from '../assets/ticket.svg'
import GlareHover from './GlareHover'
import ResponsiveContainer from './ResponsiveContainer'
import useResponsive from '../hooks/useResponsive'
import { Linkedin, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Star } from 'lucide-react'

const Footer = () => {
  const navigate = useNavigate();
  const { isTinyMobile, getResponsiveValue } = useResponsive();

  const responsiveLogoSize = getResponsiveValue({
    xl: '120px',
    lg: '100px',
    md: '80px',
    sm: '60px',
    xs: '50px',
    tiny: '40px',
  });

  return (
    <footer className="footer-section" style={{
      background: 'radial-gradient(circle at center, #1A0000 0%, #000000 100%)',
      borderTop: '1px dashed #FFD6A0',
      color: '#fff',
      padding: isTinyMobile ? '15px 0 0 0' : '60px 0 85px 0',
      position: 'relative',
      zIndex: 60
    }}>
      <ResponsiveContainer>
        <div className="footer-content" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 15px'
        }}>
          
          {/* Main Footer Content */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isTinyMobile ? '1fr' : '2fr 1fr 1fr 1fr 1.5fr',
            gap: isTinyMobile ? '30px' : '30px',
            alignItems: 'start',
            marginBottom: isTinyMobile ? '0' : '40px'
          }}>
            
            {/* Left Side - Logo and Tagline */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingTop: isTinyMobile ? '0' : '15px'
            }}>
              
              {/* Logo Section */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isTinyMobile ? 'center' : 'flex-start',
                gap: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '7px'
                }}>
                  <img 
                    src={logo} 
                    alt="Popcorn Logo" 
                    style={{
                      height: `calc(${responsiveLogoSize} * 1.5)`,
                      width: 'auto'
                    }}
                  />
                </div>
                
                {/* Tagline */}
                <p style={{
                  color: '#ccc',
                  fontSize: isTinyMobile ? '14px' : '16px',
                  margin: '0',
                  lineHeight: '1.5',
                  maxWidth: '300px'
                }}>
                  Experience the magic of cinema with seamless ticket booking and unforgettable moments.
                </p>
              </div>
            </div>

            {/* Quick Links Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <h3 style={{
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
                margin: '0 0 15px 0'
              }}>
                Quick Links
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <a href="/" style={{
                  color: '#ccc',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s ease',
                  lineHeight: '1.8'
                }}>Home</a>
                <a href="https://github.com/SK8-infi/Devkriti-Popcorn-frontend" target="_blank" rel="noopener noreferrer" style={{
                  color: '#ccc',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s ease',
                  lineHeight: '1.8'
                }}>About Us</a>
                <a href="/movies" style={{
                  color: '#ccc',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s ease',
                  lineHeight: '1.8'
                }}>Movies</a>
                <a href="/contact" style={{
                  color: '#ccc',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s ease',
                  lineHeight: '1.8'
                }}>Contact Us</a>
              </div>
            </div>

            {/* Support Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <h3 style={{
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
                margin: '0 0 15px 0'
              }}>
                Support
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <a href="/contact" style={{
                  color: '#ccc',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s ease',
                  lineHeight: '1.8'
                }}>Help Center</a>
                <a href="/contact" style={{
                  color: '#ccc',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s ease',
                  lineHeight: '1.8'
                }}>FAQs</a>
                <a href="/my-bookings" style={{
                  color: '#ccc',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s ease',
                  lineHeight: '1.8'
                }}>Ticket Refunds</a>
                <a href="/contact" style={{
                  color: '#ccc',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s ease',
                  lineHeight: '1.8'
                }}>Accessibility</a>
              </div>
            </div>

            {/* Follow Us Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <h3 style={{
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
                margin: '0 0 15px 0'
              }}>
                Follow Us
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{
                  color: '#fff',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Facebook size={20} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{
                  color: '#fff',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Twitter size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{
                  color: '#fff',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* Get in Touch Section */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              <h3 style={{
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
                margin: '0 0 15px 0'
              }}>
                Get in Touch
              </h3>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <span style={{
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Business Inquiries:
                  </span>
                  <a href="mailto:www17popcorn@gmail.com" style={{
                    color: '#ccc',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'opacity 0.3s ease',
                    lineHeight: '1.8'
                  }}>
                    www17popcorn@gmail.com
                  </a>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px'
                }}>
                  <span style={{
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Address:
                  </span>
                  <span style={{
                    color: '#ccc',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    42 Cinema Street, Entertainment District,<br />
                    Mumbai, Maharashtra, India - 400001
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div style={{
            height: '1px',
            background: 'rgba(255, 255, 255, 0.2)',
            margin: '30px 0'
          }}></div>

          {/* Large POPCORN Text - Only for Large Screens */}
          {!isTinyMobile && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '50px'
            }}>
              <div style={{
                color: '#FFD6A0',
                fontSize: getResponsiveValue({
                  xl: '180px',
                  lg: '140px',
                  md: '100px',
                  sm: '80px',
                  xs: '60px'
                }),
                fontWeight: 'bold',
                textAlign: 'center',
                lineHeight: '1',
                letterSpacing: getResponsiveValue({
                  xl: '10px',
                  lg: '8px',
                  md: '6px',
                  sm: '4px',
                  xs: '2px'
                }),
                textTransform: 'uppercase',
                fontFamily: 'Arial, sans-serif'
              }}>
                POPCORN
              </div>
            </div>
          )}

          {/* Bottom Section - Copyright */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              color: '#ccc',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              Copyright 2025 © Popcorn. All Rights Reserved.
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </footer>
  )
}

export default Footer
