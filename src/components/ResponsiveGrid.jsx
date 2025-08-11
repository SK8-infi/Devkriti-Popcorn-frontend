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
    xs: 2,
    tiny: 2
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
          gap: gap,
        },
        '@media (max-width: 768px)': {
          gridTemplateColumns: `repeat(${columns.md}, 1fr)`,
          gap: gap,
        },
        '@media (max-width: 640px)': {
          gridTemplateColumns: `repeat(${columns.sm}, 1fr)`,
          gap: gap,
        },
        '@media (max-width: 480px)': {
          gridTemplateColumns: `repeat(${columns.xs}, 1fr)`,
          gap: gap,
        },
        '@media (max-width: 300px)': {
          gridTemplateColumns: `repeat(${columns.tiny}, 1fr)`,
          gap: gap,
        },
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid; 