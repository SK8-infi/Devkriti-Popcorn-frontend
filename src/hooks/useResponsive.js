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

  const isTinyMobile = windowSize.width <= 300;
  const isMobile = windowSize.width <= 480;
  const isTablet = windowSize.width > 480 && windowSize.width <= 768;
  const isDesktop = windowSize.width > 768;
  const isLargeDesktop = windowSize.width > 1024;

  const breakpoints = {
    tiny: windowSize.width <= 300,
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
    if (isMobile && values.xs !== undefined) return values.xs;
    if (isTinyMobile && values.tiny !== undefined) return values.tiny;
    return values.default || values.lg || values.md || values.xs || values.tiny;
  };

  return {
    windowSize,
    isTinyMobile,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoints,
    getResponsiveValue,
  };
};

export default useResponsive; 