import { useState, useEffect } from 'react';

const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // More granular breakpoints for better control
  const isTinyMobile = windowSize.width <= 340; // Increased from 300 to catch more devices
  const isSmallMobile = windowSize.width > 340 && windowSize.width <= 480; // Adjusted accordingly
  const isMobile = windowSize.width <= 480;
  const isTablet = windowSize.width > 480 && windowSize.width <= 768;
  const isDesktop = windowSize.width > 768;
  const isLargeDesktop = windowSize.width > 1024;

  const breakpoints = {
    tiny: windowSize.width <= 340, // Updated to match isTinyMobile
    small: windowSize.width > 340 && windowSize.width <= 480, // Updated to match isSmallMobile
    xs: windowSize.width <= 480,
    sm: windowSize.width > 480 && windowSize.width <= 640,
    md: windowSize.width > 640 && windowSize.width <= 768,
    lg: windowSize.width > 768 && windowSize.width <= 1024,
    xl: windowSize.width > 1024,
  };

  const getResponsiveValue = (values) => {
    if (isLargeDesktop && values.xl !== undefined) return values.xl;
    if (isDesktop && values.lg !== undefined) return values.lg;
    if (isTablet && values.md !== undefined) return values.md;
    if (isSmallMobile && values.small !== undefined) return values.small;
    if (isTinyMobile && values.tiny !== undefined) return values.tiny;
    if (isMobile && values.xs !== undefined) return values.xs;
    return values.default || values.lg || values.md || values.xs || values.tiny;
  };

  return {
    windowSize,
    isTinyMobile,
    isSmallMobile,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoints,
    getResponsiveValue,
  };
};

export default useResponsive; 