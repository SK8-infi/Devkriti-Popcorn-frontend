import React from 'react';

const ResponsiveContainer = ({ 
  children, 
  className = '', 
  maxWidth = '1200px',
  padding = '0 1rem',
  center = true 
}) => {
  return (
    <div
      className={`responsive-container ${className}`}
      style={{
        maxWidth,
        margin: center ? '0 auto' : '0',
        padding,
        width: '100%',
        boxSizing: 'border-box',
        '@media (max-width: 768px)': {
          padding: '0 0.75rem',
        },
        '@media (max-width: 480px)': {
          padding: '0 0.5rem',
        },
        '@media (max-width: 300px)': {
          padding: '0 0.25rem',
        },
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer; 