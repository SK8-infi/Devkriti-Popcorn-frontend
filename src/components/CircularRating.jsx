import React from 'react';

const getColor = (value) => {
  if (value > 75) return '#21d07a'; // green
  if (value >= 60) return '#d2d531'; // yellow
  return '#db2360'; // red
};

const CircularRating = ({ value, size = 48, strokeWidth = 4 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(100, value));
  const offset = circumference - (progress / 100) * circumference;
  const color = getColor(progress);
  const displayValue = (progress / 10).toFixed(1); // Show as 7.1 instead of 71%

  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="#000000"
        stroke="#222"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.34}
        fontWeight="bold"
        fill="#fff"
        style={{ fontFamily: 'inherit' }}
      >
        {displayValue}
      </text>
    </svg>
  );
};

export default CircularRating; 