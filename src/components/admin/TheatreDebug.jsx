import React from 'react';
import { useAppContext } from '../../context/AppContext';

const TheatreDebug = () => {
  const { user, theatre, theatreCity, theatreAddress, userCity, isAdmin } = useAppContext();

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
      <h4 className="font-bold mb-2">🔍 Theatre Debug</h4>
      <div className="space-y-1">
        <div>User: {user?.name || 'N/A'}</div>
        <div>User Role: {user?.role || 'N/A'}</div>
        <div>Theatre: {theatre || 'NULL'}</div>
        <div>Theatre City: {theatreCity || 'NULL'}</div>
        <div>Theatre Address: {theatreAddress || 'NULL'}</div>
        <div>User City: {userCity || 'NULL'}</div>
        <div>Is Admin: {isAdmin ? 'Yes' : 'No'}</div>
        <div>User ID: {user?._id || 'N/A'}</div>
      </div>
    </div>
  );
};

export default TheatreDebug; 