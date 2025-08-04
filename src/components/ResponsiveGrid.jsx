import React from 'react';

const ResponsiveGrid = ({ 
  children, 
  className = '',
  gap = '1.5rem',
  columns = {
    default: 4,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 1
  }
}) => {
  const getGridTemplateColumns = () => {
    return `
      repeat(${columns.default}, 1fr)
    `;
  };

  return (
    <div
      className={`responsive-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: getGridTemplateColumns(),
        gap,
        width: '100%',
        '@media (max-width: 1024px)': {
          gridTemplateColumns: `repeat(${columns.lg}, 1fr)`,
          gap: '1.25rem',
        },
        '@media (max-width: 768px)': {
          gridTemplateColumns: `repeat(${columns.md}, 1fr)`,
          gap: '1rem',
        },
        '@media (max-width: 640px)': {
          gridTemplateColumns: `repeat(${columns.sm}, 1fr)`,
          gap: '0.75rem',
        },
        '@media (max-width: 480px)': {
          gridTemplateColumns: `repeat(${columns.xs}, 1fr)`,
          gap: '0.5rem',
        },
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid; 