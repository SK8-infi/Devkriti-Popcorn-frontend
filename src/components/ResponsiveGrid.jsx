import React from 'react';
import './ResponsiveGrid.css';

const ResponsiveGrid = ({ 
  children, 
  className = '',
  gap = '1.5rem',
  columns = {
    default: 4,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 2,
    tiny: 2
  }
}) => {
  return (
    <div
      className={`responsive-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns.default}, 1fr)`,
        gap,
        width: '100%',
        // Custom CSS properties for responsive breakpoints
        '--grid-columns-default': columns.default,
        '--grid-columns-lg': columns.lg,
        '--grid-columns-md': columns.md,
        '--grid-columns-sm': columns.sm,
        '--grid-columns-xs': columns.xs,
        '--grid-columns-tiny': columns.tiny,
        '--grid-gap': gap,
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid; 