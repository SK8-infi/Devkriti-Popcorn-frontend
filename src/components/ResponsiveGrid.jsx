import React, { useState, useEffect } from 'react';
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
  const [gridConfig, setGridConfig] = useState({
    columns: 4,
    gap: '1.5rem',
    containerPadding: '0 1.5rem'
  });

  useEffect(() => {
    const updateGridConfig = () => {
      const width = window.innerWidth;
      
      if (width >= 300 && width < 500) {
        // Exactly 2 cards with proper spacing
        setGridConfig({
          columns: 2,
          gap: '0.75rem',
          containerPadding: '0 0.75rem'
        });
        console.log(`2 cards layout at ${width}px`);
      } else if (width >= 500 && width < 768) {
        // Exactly 3 cards with proper spacing
        setGridConfig({
          columns: 3,
          gap: '1rem',
          containerPadding: '0 1rem'
        });
        console.log(`3 cards layout at ${width}px - FORCING 3 COLUMNS`);
      } else if (width >= 768) {
        // 4 cards by default
        setGridConfig({
          columns: 4,
          gap: '1.5rem',
          containerPadding: '0 1.5rem'
        });
        console.log(`4 cards layout at ${width}px`);
      } else {
        // Very small screens - 2 cards
        setGridConfig({
          columns: 2,
          gap: '0.5rem',
          containerPadding: '0 0.5rem'
        });
        console.log(`2 cards layout (small) at ${width}px`);
      }
    };

    // Set initial value
    updateGridConfig();

    // Add event listener
    window.addEventListener('resize', updateGridConfig);

    // Cleanup
    return () => window.removeEventListener('resize', updateGridConfig);
  }, []);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridConfig.columns}, 1fr)`,
    gap: gridConfig.gap,
    width: '100%',
    padding: gridConfig.containerPadding,
    boxSizing: 'border-box'
  };

  console.log(`Rendering ResponsiveGrid with ${gridConfig.columns} columns at ${window.innerWidth}px`);

  return (
    <div
      className={`responsive-grid ${className}`}
      style={gridStyle}
      data-columns={gridConfig.columns}
      data-width={window.innerWidth}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid; 