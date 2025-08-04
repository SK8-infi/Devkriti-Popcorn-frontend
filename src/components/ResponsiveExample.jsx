import React from 'react';
import ResponsiveContainer from './ResponsiveContainer';
import ResponsiveGrid from './ResponsiveGrid';
import useResponsive from '../hooks/useResponsive';

const ResponsiveExample = () => {
  const { isTinyMobile, isMobile, isTablet, isDesktop, getResponsiveValue } = useResponsive();

  const responsiveText = getResponsiveValue({
    xl: 'Extra Large Text',
    lg: 'Large Text',
    md: 'Medium Text',
    xs: 'Small Text',
    tiny: 'Tiny Text',
  });

  const responsivePadding = getResponsiveValue({
    xl: '3rem',
    lg: '2rem',
    md: '1.5rem',
    xs: '1rem',
    tiny: '0.75rem',
  });

  return (
    <ResponsiveContainer>
      <div className="responsive-padding">
        <h1 className="text-responsive">
          Responsive Design Example
        </h1>
        
        <p style={{ fontSize: responsiveText }}>
          Current screen size: {isTinyMobile ? 'Tiny Mobile' : isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
        </p>

        <div style={{ padding: responsivePadding }}>
          <ResponsiveGrid
            columns={{
              default: 4,
              lg: 3,
              md: 2,
              sm: 2,
              xs: 1
            }}
            gap="1rem"
          >
            {/* Example grid items */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                style={{
                  background: '#333',
                  padding: '1rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                Item {item}
              </div>
            ))}
          </ResponsiveGrid>
        </div>

        <div className="responsive-margin">
          <div className="hidden-mobile">
            This content is hidden on mobile devices
          </div>
          <div className="hidden-desktop">
            This content is only visible on mobile devices
          </div>
        </div>
      </div>
    </ResponsiveContainer>
  );
};

export default ResponsiveExample; 