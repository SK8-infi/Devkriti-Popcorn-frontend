import React from 'react';
import './Favorite.css';

const Notifications = () => {
  // Placeholder: Replace with real notifications logic if needed
  const notifications = [];

  if (notifications.length === 0) {
    return (
      <div className='favorite-empty' style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 className='favorite-empty-title'>You have no Notifications</h1>
      </div>
    );
  }

  return (
    <div>
      {/* Render notifications here */}
    </div>
  );
};

export default Notifications; 