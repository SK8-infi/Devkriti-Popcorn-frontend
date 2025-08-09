import React from 'react';
import './ResponsiveContainer.css';

const ResponsiveContainer = ({ 
  children, 
  className = '', 
  maxWidth = '1200px',
  padding,
  center = true 
}) => {
  const customStyles = {};
  
  if (maxWidth !== '1200px') {
    customStyles.maxWidth = maxWidth;
  }
  
  if (padding) {
    customStyles.padding = padding;
  }
  
  return (
    <div
      className={`responsive-container ${!center ? 'no-center' : ''} ${className}`}
      style={customStyles}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer; 