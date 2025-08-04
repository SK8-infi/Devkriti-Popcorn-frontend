# Responsive Design Guide

This guide explains how to make your website responsive using the components and utilities provided.

## Breakpoints

We use the following breakpoints:
- **Extra Small (xs)**: ≤ 480px (Mobile)
- **Small (sm)**: 481px - 640px (Large Mobile)
- **Medium (md)**: 641px - 768px (Tablet)
- **Large (lg)**: 769px - 1024px (Small Desktop)
- **Extra Large (xl)**: > 1024px (Large Desktop)

## Components

### 1. ResponsiveContainer
A wrapper component that provides consistent responsive behavior.

```jsx
import ResponsiveContainer from './components/ResponsiveContainer';

<ResponsiveContainer maxWidth="1200px" padding="0 1rem">
  <YourContent />
</ResponsiveContainer>
```

### 2. ResponsiveGrid
A grid component that automatically adjusts columns based on screen size.

```jsx
import ResponsiveGrid from './components/ResponsiveGrid';

<ResponsiveGrid
  columns={{
    default: 4,  // Desktop
    lg: 4,       // Large Desktop
    md: 3,       // Tablet
    sm: 2,       // Large Mobile
    xs: 1        // Mobile
  }}
  gap="1rem"
>
  {items.map(item => (
    <YourGridItem key={item.id} item={item} />
  ))}
</ResponsiveGrid>
```

### 3. useResponsive Hook
A custom hook that provides responsive utilities.

```jsx
import useResponsive from './hooks/useResponsive';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, getResponsiveValue } = useResponsive();

  const fontSize = getResponsiveValue({
    xl: '2rem',
    lg: '1.8rem',
    md: '1.5rem',
    xs: '1.2rem',
  });

  return (
    <div style={{ fontSize }}>
      Content
    </div>
  );
};
```

## CSS Classes

### Responsive Utilities
- `.hidden-mobile`: Hidden on mobile devices
- `.hidden-desktop`: Only visible on mobile devices
- `.text-responsive`: Responsive text sizing
- `.responsive-padding`: Responsive padding
- `.responsive-margin`: Responsive margins

### Usage
```jsx
<div className="hidden-mobile">
  Desktop-only content
</div>

<div className="hidden-desktop">
  Mobile-only content
</div>

<h1 className="text-responsive">
  Responsive heading
</h1>

<div className="responsive-padding">
  Content with responsive padding
</div>
```

## Best Practices

### 1. Mobile-First Approach
Always design for mobile first, then enhance for larger screens.

### 2. Flexible Images
Use responsive images that scale properly:

```jsx
<img
  src={imageUrl}
  alt="Description"
  style={{
    width: '100%',
    height: 'auto',
    maxWidth: '100%',
  }}
/>
```

### 3. Touch-Friendly Elements
Ensure buttons and interactive elements are at least 44px × 44px on mobile.

### 4. Readable Text
- Minimum font size: 16px on mobile
- Use relative units (rem, em) instead of fixed pixels
- Ensure sufficient contrast ratios

### 5. Performance
- Optimize images for different screen sizes
- Use lazy loading for images
- Minimize JavaScript on mobile devices

## Testing

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Click the device toggle button
3. Test different device sizes
4. Check for responsive issues

### Real Devices
Test on actual devices when possible:
- iPhone (375px, 414px)
- iPad (768px, 1024px)
- Android devices (various sizes)

## Common Patterns

### 1. Responsive Navigation
```jsx
const Navigation = () => {
  const { isMobile } = useResponsive();
  
  return (
    <nav>
      {isMobile ? (
        <MobileMenu />
      ) : (
        <DesktopMenu />
      )}
    </nav>
  );
};
```

### 2. Responsive Cards
```jsx
const MovieCard = ({ movie }) => {
  const { getResponsiveValue } = useResponsive();
  
  const cardWidth = getResponsiveValue({
    xl: '280px',
    lg: '240px',
    md: '200px',
    xs: '160px',
  });

  return (
    <div style={{ width: cardWidth }}>
      {/* Card content */}
    </div>
  );
};
```

### 3. Responsive Typography
```jsx
const ResponsiveText = ({ children }) => {
  const { getResponsiveValue } = useResponsive();
  
  const fontSize = getResponsiveValue({
    xl: '1.5rem',
    lg: '1.3rem',
    md: '1.1rem',
    xs: '1rem',
  });

  return (
    <p style={{ fontSize }}>
      {children}
    </p>
  );
};
```

## Troubleshooting

### Common Issues

1. **Content Overflowing**
   - Use `overflow: hidden` or `word-wrap: break-word`
   - Check for fixed widths that don't scale

2. **Images Not Scaling**
   - Use `max-width: 100%` and `height: auto`
   - Consider using `object-fit: cover` for background images

3. **Touch Targets Too Small**
   - Ensure buttons are at least 44px × 44px
   - Add sufficient padding around clickable elements

4. **Text Too Small**
   - Use minimum 16px font size on mobile
   - Test readability on actual devices

### Debugging Tips

1. Use browser dev tools to simulate different screen sizes
2. Test on real devices when possible
3. Check for horizontal scrolling issues
4. Verify touch interactions work properly
5. Test with different content lengths

## Resources

- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [Flexbox Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout) 