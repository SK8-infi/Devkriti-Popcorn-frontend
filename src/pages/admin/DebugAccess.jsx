import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const DebugAccess = () => {
    const { api, user, isAdmin, isAuthenticated, hasAdAccess, loading } = useAppContext();
    const [debugInfo, setDebugInfo] = useState(null);
    const [testing, setTesting] = useState(false);

    const testAdAccess = async () => {
        setTesting(true);
        try {
            const response = await api.get('/api/user/ad-access');
            setDebugInfo(response.data);
            toast.success('AD access test completed');
        } catch (error) {
            console.error('AD access test error:', error);
            setDebugInfo({ error: error.response?.data || error.message });
            toast.error('AD access test failed');
        } finally {
            setTesting(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            testAdAccess();
        }
    }, [isAuthenticated]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Access</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Current User Status</h2>
                    <div className="space-y-2">
                        <div><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</div>
                        <div><strong>Is Admin:</strong> {isAdmin ? '✅ Yes' : '❌ No'}</div>
                        <div><strong>Has AD Access:</strong> {hasAdAccess ? '✅ Yes' : '❌ No'}</div>
                        {user && (
                            <>
                                <div><strong>User Email:</strong> {user.email}</div>
                                <div><strong>User Role:</strong> {user.role}</div>
                                <div><strong>User ID:</strong> {user._id}</div>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">AD Access Test</h2>
                    <button
                        onClick={testAdAccess}
                        disabled={testing}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {testing ? 'Testing...' : 'Test AD Access'}
                    </button>
                    
                    {debugInfo && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                            <h3 className="font-semibold mb-2">Debug Response:</h3>
                            <pre className="text-sm overflow-auto">
                                {JSON.stringify(debugInfo, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Access Requirements</h2>
                    <div className="space-y-2 text-sm">
                        <div>✅ Must be logged in</div>
                        <div>✅ Must be an admin (role: 'admin')</div>
                        <div>✅ Must have AD access (email in AD_EMAILS)</div>
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                            <strong>AD_EMAILS:</strong> shivansh.katiyar1712@gmail.com, veditha888@gmail.com, prabalpoddar73@gmail.com
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebugAccess; 