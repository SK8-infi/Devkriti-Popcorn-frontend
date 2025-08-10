import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const DebugAccess = () => {
  const { user, isAdmin, hasOwnerAccess, loading, api } = useAppContext();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const fetchDebugInfo = async () => {
      try {
        // Test admin check endpoint
        const adminResponse = await api.get('/api/auth/admin/check');
        
        // Test owner access endpoint
        const ownerResponse = await api.get('/api/user/owner-access');
        
        // Test user data endpoint
        const userResponse = await api.get('/api/auth/me');

        setDebugInfo({
          adminCheck: adminResponse.data,
          ownerAccess: ownerResponse.data,
          userData: userResponse.data,
          frontendState: {
            user: user,
            isAdmin: isAdmin,
            hasOwnerAccess: hasOwnerAccess,
            loading: loading
          }
        });
      } catch (error) {
        console.error('Debug fetch error:', error);
        setDebugInfo({
          error: error.message,
          frontendState: {
            user: user,
            isAdmin: isAdmin,
            hasOwnerAccess: hasOwnerAccess,
            loading: loading
          }
        });
      }
    };

    if (!loading) {
      fetchDebugInfo();
    }
  }, [user, isAdmin, hasOwnerAccess, loading, api]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Access Debug Information</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frontend State */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Frontend State</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(debugInfo.frontendState, null, 2)}
            </pre>
          </div>

          {/* Backend Responses */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Backend Responses</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </div>

        {/* Access Analysis */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Access Analysis</h2>
          <div className="space-y-2">
            <div className={`p-3 rounded ${isAdmin ? 'bg-green-600' : 'bg-red-600'}`}>
                              <strong>Admin Access:</strong> {isAdmin ? 'Granted' : 'Denied'}
            </div>
            <div className={`p-3 rounded ${hasOwnerAccess ? 'bg-green-600' : 'bg-red-600'}`}>
                              <strong>Owner Access:</strong> {hasOwnerAccess ? 'Granted' : 'Denied'}
            </div>
            <div className={`p-3 rounded ${user ? 'bg-green-600' : 'bg-red-600'}`}>
                              <strong>User Authenticated:</strong> {user ? 'Yes' : 'No'}
            </div>
            {user && (
              <div className="p-3 rounded bg-blue-600">
                <strong>User Role:</strong> {user.role || 'undefined'}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-x-4">
            <a 
              href="/admin" 
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-red-950"
            >
              Try Admin Dashboard
            </a>
            <a 
              href="/manage-users" 
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Try Manage Users
            </a>
            <button 
              onClick={() => window.location.reload()} 
              className="inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugAccess; 