import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const TestOwnerAccess = () => {
  const { user, isAdmin, hasOwnerAccess, loading, api } = useAppContext();
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    const runTests = async () => {
      if (loading) return;

      const results = {};

      try {
        // Test 1: Check if user is authenticated
        results.authenticated = !!user;
        results.userRole = user?.role || 'none';

        // Test 2: Check admin status
        const adminResponse = await api.get('/api/auth/admin/check');
        results.adminCheck = adminResponse.data;

        // Test 3: Check owner access
        const ownerResponse = await api.get('/api/user/owner-access');
        results.ownerAccess = ownerResponse.data;

        // Test 4: Check frontend state
        results.frontendState = {
          isAdmin,
          hasOwnerAccess,
          user: user ? {
            _id: user._id,
            email: user.email,
            role: user.role
          } : null
        };

        setTestResults(results);
      } catch (error) {
        console.error('Test error:', error);
        results.error = error.message;
        setTestResults(results);
      }
    };

    runTests();
  }, [user, isAdmin, hasOwnerAccess, loading, api]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Owner Access Test</h1>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-2">
              <div className={`p-2 rounded ${testResults.authenticated ? 'bg-green-600' : 'bg-red-600'}`}>
                <strong>Authenticated:</strong> {testResults.authenticated ? 'Yes' : 'No'}
              </div>
              <div className="p-2 rounded bg-blue-600">
                <strong>User Role:</strong> {testResults.userRole}
              </div>
              <div className={`p-2 rounded ${testResults.frontendState?.isAdmin ? 'bg-green-600' : 'bg-red-600'}`}>
                <strong>Frontend Admin:</strong> {testResults.frontendState?.isAdmin ? 'Yes' : 'No'}
              </div>
              <div className={`p-2 rounded ${testResults.frontendState?.hasOwnerAccess ? 'bg-green-600' : 'bg-red-600'}`}>
                <strong>Frontend Owner:</strong> {testResults.frontendState?.hasOwnerAccess ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Backend Responses</h2>
            <pre className="text-xs overflow-auto max-h-64">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        </div>

        {/* Access Tests */}
        <div className="bg-gray-800 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Access Tests</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Admin Dashboard Access:</h3>
              <div className="flex space-x-4">
                <a 
                  href="/admin" 
                  className={`px-4 py-2 rounded ${isAdmin ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600'}`}
                >
                  Try Admin Dashboard
                </a>
                <span className="text-sm text-gray-400">
                  {isAdmin ? 'Should work' : 'Should fail'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Manage Users Access:</h3>
              <div className="flex space-x-4">
                <a 
                  href="/manage-users" 
                  className={`px-4 py-2 rounded ${hasOwnerAccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600'}`}
                >
                  Try Manage Users
                </a>
                <span className="text-sm text-gray-400">
                  {hasOwnerAccess ? 'Should work' : 'Should fail'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        {testResults.error && (
          <div className="bg-red-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <pre className="text-sm">{testResults.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestOwnerAccess; 