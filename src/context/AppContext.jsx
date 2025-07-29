import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(undefined);
    const [hasAdAccess, setHasAdAccess] = useState(undefined);
    const [theatre, setTheatre] = useState(undefined);
    const [city, setCity] = useState(undefined);

    // Axios instance with auth token
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Add auth token to requests
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    const getToken = () => {
        return localStorage.getItem('authToken');
    };

    const login = () => {
        const authUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/google`;
        window.location.href = authUrl;
    };

    // Handle OAuth callback
    const handleAuthCallback = (token) => {
        if (token) {
            localStorage.setItem('authToken', token);
            fetchUser();
            toast.success('Login successful!');
            // Redirect to home screen after successful login
            window.location.href = '/';
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(undefined);
        setTheatre(undefined);
        setCity(undefined);
        setHasAdAccess(undefined); // Reset hasAdAccess on logout
        toast.success('Logged out successfully');
    };

    // Fetch current user
    const fetchUser = async () => {
        try {
            const token = getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await api.get('/api/auth/me');
            if (response.data.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                setTheatre(response.data.user.theatre);
                setCity(response.data.user.city);
                
                // Check admin status
                const adminResponse = await api.get('/api/auth/admin/check');
                if (adminResponse.data.success) {
                    setIsAdmin(adminResponse.data.isAdmin);
                }
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            if (error.response?.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch admin status
    const fetchIsAdmin = async () => {
        try {
            const token = getToken();
            if (!token) {
                setIsAdmin(false);
                return;
            }
            const response = await api.get('/api/auth/admin/check');
            if (response.data.success) {
                setIsAdmin(response.data.isAdmin);
            } else {
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error fetching admin status:', error);
            setIsAdmin(false);
        }
    };

    const fetchAdAccess = async () => {
        try {
            const token = getToken();
            if (!token) {
                setHasAdAccess(false);
                return;
            }
            const response = await api.get('/api/user/ad-access');
            if (response.data.success) {
                setHasAdAccess(response.data.hasAdAccess);
            } else {
                setHasAdAccess(false);
            }
        } catch (error) {
            console.error('Error fetching AD access:', error);
            setHasAdAccess(false);
        }
    };

    // Set admin theatre
    const setAdminTheatre = async (theatreName, cityName) => {
        try {
            const response = await api.post('/api/user/update-theatre', {
                theatre: theatreName,
                city: cityName
            });
            
            if (response.data.success) {
                setTheatre(theatreName);
                setCity(cityName);
                return { success: true };
            } else {
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('Error setting admin theatre:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to set theatre' };
        }
    };

    // Fetch user from backend (alias for fetchUser)
    const fetchUserFromBackend = fetchUser;

    // Check for existing token on app load
    useEffect(() => {
        const token = getToken();
        if (token) {
            fetchUser();
                    } else {
            setLoading(false);
        }
    }, []);

    // Handle OAuth callback from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (token) {
            handleAuthCallback(token);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (error) {
            toast.error('Authentication failed. Please try again.');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        fetchUser,
        fetchIsAdmin,
        getToken,
        api,
        axios: api, // For backward compatibility
        image_base_url: 'https://image.tmdb.org/t/p/w500',
        theatre,
        city,
        setAdminTheatre,
        fetchUserFromBackend,
        hasAdAccess,
        fetchAdAccess,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};