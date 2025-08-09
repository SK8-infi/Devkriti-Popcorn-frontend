import React from 'react';
import useResponsive from '../hooks/useResponsive';

const ResponsiveGrid = ({ 
  children, 
  className = '',
  gap = '1.5rem',
  columns = {
    default: 4,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 1,
    small: 1,
    tiny: 1
  }
}) => {
  const { isTinyMobile, isSmallMobile } = useResponsive();

  const getGridTemplateColumns = () => {
    if (isTinyMobile) return 'none';
    if (isSmallMobile) return 'none';
    return `repeat(${columns.default}, 1fr)`;
  };

  const getResponsiveGap = () => {
    if (isTinyMobile) return '8px';
    if (isSmallMobile) return '12px';
    return gap;
  };

  return (
    <div
      className={`responsive-grid ${className}`}
      style={{
        display: isTinyMobile || isSmallMobile ? 'flex' : 'grid',
        gridTemplateColumns: getGridTemplateColumns(),
        gap: getResponsiveGap(),
        width: '100%',
        overflowX: isTinyMobile || isSmallMobile ? 'auto' : 'visible',
        flexDirection: isTinyMobile || isSmallMobile ? 'row' : 'row',
        flexWrap: isTinyMobile || isSmallMobile ? 'nowrap' : 'wrap',
        alignItems: isTinyMobile || isSmallMobile ? 'flex-start' : 'stretch',
        scrollbarWidth: isTinyMobile || isSmallMobile ? 'none' : 'auto',
        msOverflowStyle: isTinyMobile || isSmallMobile ? 'none' : 'auto',
        WebkitOverflowScrolling: isTinyMobile || isSmallMobile ? 'touch' : 'auto',
        padding: isTinyMobile ? '0 4px' : isSmallMobile ? '0 8px' : '0',
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveGrid; 