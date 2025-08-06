import React from 'react';
import ResponsiveContainer from './ResponsiveContainer';
import ResponsiveGrid from './ResponsiveGrid';
import useResponsive from '../hooks/useResponsive';
import MovieCard from './MovieCard';

const TinyMobileTest = () => {
  const { isTinyMobile, isMobile, isTablet, isDesktop, getResponsiveValue } = useResponsive();

  const responsiveText = getResponsiveValue({
    xl: '2rem',
    lg: '1.8rem',
    md: '1.5rem',
    xs: '1.2rem',
    tiny: '1rem',
  });

  const responsivePadding = getResponsiveValue({
    xl: '3rem',
    lg: '2rem',
    md: '1.5rem',
    xs: '1rem',
    tiny: '0.75rem',
  });

  // Mock movie data for testing
  const mockMovies = [
    { id: 1, title: 'Test Movie 1', poster_path: null },
    { id: 2, title: 'Test Movie 2', poster_path: null },
    { id: 3, title: 'Test Movie 3', poster_path: null },
  ];

  return (
    <ResponsiveContainer>
      <div className="responsive-padding">
        <h1 className="text-responsive" style={{
          color: isTinyMobile ? '#FFD6A0' : '#fff',
          border: isTinyMobile ? '2px solid #FFD6A0' : 'none',
          padding: isTinyMobile ? '0.5rem' : '0',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          {isTinyMobile ? 'Tiny Mobile Test (≤300px)' : 'Responsive Design Test'}
        </h1>

        <div style={{
          background: isTinyMobile ? '#FFD6A0' : '#333',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          color: isTinyMobile ? '#232323' : 'white'
        }}>
          <h3>Current Screen Size: {isTinyMobile ? 'Tiny Mobile (≤300px)' : isMobile ? 'Mobile (≤480px)' : isTablet ? 'Tablet (≤768px)' : 'Desktop (>768px)'}</h3>
          <p>Text Size: {responsiveText}</p>
          <p>Padding: {responsivePadding}</p>
        </div>

        <div style={{ padding: responsivePadding }}>
          <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Movie Cards Test</h3>
          <ResponsiveGrid
            columns={{
              default: 4,
              lg: 3,
              md: 2,
              sm: 2,
              xs: 1,
              tiny: 1
            }}
            gap="1rem"
          >
            {mockMovies.map((movie) => (
              <div
                key={movie.id}
                style={{
                  background: isTinyMobile ? '#FFD6A0' : '#333',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: isTinyMobile ? '#232323' : 'white',
                  fontSize: isTinyMobile ? '0.8rem' : '1rem',
                }}
              >
                <div style={{
                  width: '100%',
                  height: isTinyMobile ? '120px' : '200px',
                  background: '#555',
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  Poster
                </div>
                <h4>{movie.title}</h4>
                {isTinyMobile && <div style={{ fontSize: '0.7rem', marginTop: '0.5rem' }}>Tiny Mobile Optimized</div>}
              </div>
            ))}
          </ResponsiveGrid>
        </div>

        <div className="responsive-margin">
          <div className="hidden-mobile" style={{
            background: '#444',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            This content is hidden on mobile devices (including tiny mobile)
          </div>
          <div className="hidden-desktop" style={{
            background: '#666',
            padding: '1rem',
            borderRadius: '8px'
          }}>
            This content is only visible on mobile devices
            {isTinyMobile && <div style={{ color: '#FFD6A0', marginTop: '0.5rem' }}>✨ Optimized for tiny mobile!</div>}
          </div>
        </div>

        {/* Tiny mobile specific features */}
        {isTinyMobile && (
          <div style={{
            background: '#FFD6A0',
            color: '#232323',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
            fontSize: '0.9rem'
          }}>
            <h3>Tiny Mobile Features:</h3>
            <ul style={{ textAlign: 'left', margin: '0.5rem 0' }}>
              <li>Reduced padding and margins</li>
              <li>Smaller font sizes</li>
              <li>Single column layouts</li>
              <li>Compact navigation</li>
              <li>Touch-friendly buttons</li>
              <li>Optimized spacing</li>
            </ul>
          </div>
        )}

        {/* Responsive utilities test */}
        <div style={{ marginTop: '2rem' }}>
          <h3>Responsive Utilities Test:</h3>
          <div className="text-responsive" style={{ marginBottom: '1rem' }}>
            This text uses the responsive text utility class
          </div>
          <div className="responsive-padding" style={{
            background: '#444',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            This div uses responsive padding utility class
          </div>
          <div className="responsive-margin" style={{
            background: '#555',
            borderRadius: '4px',
            padding: '1rem'
          }}>
            This div uses responsive margin utility class
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default TinyMobileTest; 