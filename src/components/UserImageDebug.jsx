import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { getUserImage } from '../utils/imageUtils';

const UserImageDebug = () => {
    const { user, api } = useAppContext();
    const [debugInfo, setDebugInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const testUserImage = async () => {
        setLoading(true);
        try {
            // Test current user data
            const userImage = getUserImage(user);
            
            // Test image accessibility if URL exists
            let imageAccessible = false;
            if (userImage.url) {
                try {
                    const response = await fetch(userImage.url, { method: 'HEAD' });
                    imageAccessible = response.ok;
                } catch (error) {
                    console.warn('Image accessibility test failed:', error);
                }
            }

            // Get detailed user data from backend
            const response = await api.get('/api/auth/debug');
            const backendUser = response.data.user;

            setDebugInfo({
                frontendUser: user,
                backendUser: backendUser,
                userImage: userImage,
                imageAccessible: imageAccessible,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Debug test failed:', error);
            setDebugInfo({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            testUserImage();
        }
    }, [user]);

    if (!user) {
        return <div>No user logged in</div>;
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '12px' }}>
            <h3>User Image Debug Info</h3>
            <button onClick={testUserImage} disabled={loading}>
                {loading ? 'Testing...' : 'Refresh Debug Info'}
            </button>
            
            {debugInfo && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Frontend User Data:</h4>
                    <pre>{JSON.stringify(debugInfo.frontendUser, null, 2)}</pre>
                    
                    <h4>Backend User Data:</h4>
                    <pre>{JSON.stringify(debugInfo.backendUser, null, 2)}</pre>
                    
                    <h4>Image Analysis:</h4>
                    <pre>{JSON.stringify(debugInfo.userImage, null, 2)}</pre>
                    
                    <h4>Image Accessibility:</h4>
                    <p>Image accessible: {debugInfo.imageAccessible ? 'Yes' : 'No'}</p>
                    
                    <h4>Timestamp:</h4>
                    <p>{debugInfo.timestamp}</p>
                </div>
            )}
        </div>
    );
};

export default UserImageDebug; 