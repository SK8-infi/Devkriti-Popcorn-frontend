import React from 'react';
import useResponsive from '../hooks/useResponsive';

const ResponsiveContainer = ({ 
  children, 
  className = '', 
  maxWidth = '1200px',
  padding = '0 1rem',
  center = true 
}) => {
  const { isTinyMobile, isSmallMobile, getResponsiveValue } = useResponsive();

  const responsiveMaxWidth = getResponsiveValue({
    xl: '1200px',
    lg: '1200px',
    md: '1000px',
    sm: '800px',
    xs: '100%',
    small: '100%',
    tiny: '100%',
  });

  const responsivePadding = getResponsiveValue({
    xl: '0 1rem',
    lg: '0 1rem',
    md: '0 0.75rem',
    sm: '0 0.5rem',
    xs: '0 0.25rem',
    small: '0 0.125rem',
    tiny: '0 0.125rem',
  });

  return (
    <div
      className={`responsive-container ${className}`}
      style={{
        maxWidth: responsiveMaxWidth,
        margin: center ? '0 auto' : '0',
        padding: responsivePadding,
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden', // Prevent horizontal overflow
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer; 