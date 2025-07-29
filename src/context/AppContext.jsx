import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const AppContext = createContext();

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(undefined);
    const [hasAdAccess, setHasAdAccess] = useState(undefined);
    const [theatre, setTheatre] = useState(undefined);
    const [city, setCity] = useState(undefined);
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
        headers: { 'Content-Type': 'application/json' }
    });

    // Attach token to requests
    api.interceptors.request.use((config) => {
        const token = localStorage.getItem('authToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    const getToken = () => localStorage.getItem('authToken');

    const login = () => {
        const authUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/google`;
        window.location.href = authUrl;
    };

    const handleAuthCallback = (token) => {
        if (token) {
            localStorage.setItem('authToken', token);
            fetchUser();
            toast.success('Login successful!');
            window.location.href = '/';
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(undefined);
        setHasAdAccess(undefined);
        setTheatre(undefined);
        setCity(undefined);
        setFavoriteMovies([]);
        toast.success('Logged out successfully');
    };

    const fetchUser = async () => {
        try {
            const token = getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await api.get('/api/auth/me');
            if (response.data.success) {
                const fetchedUser = response.data.user;
                setUser(fetchedUser);
                setIsAuthenticated(true);
                setTheatre(fetchedUser.theatre);
                setCity(fetchedUser.city);

                const adminResponse = await api.get('/api/auth/admin/check');
                if (adminResponse.data.success) {
                    setIsAdmin(adminResponse.data.isAdmin);
                }

            }
        } catch (error) {
            console.error('Error fetching user:', error);
            if (error.response?.status === 401) {
                logout();
            } else if (user && location.pathname.startsWith('/admin')) {
                navigate('/');
                toast.error('You are not authorized to access admin dashboard');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchIsAdmin = async () => {
        try {
            const token = getToken();
            if (!token) {
                setIsAdmin(false);
                return;
            }
            const response = await api.get('/api/auth/admin/check');
            setIsAdmin(response.data.success ? response.data.isAdmin : false);
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
            setHasAdAccess(response.data.success ? response.data.hasAdAccess : false);
        } catch (error) {
            console.error('Error fetching AD access:', error);
            setHasAdAccess(false);
        }
    };

    const fetchFavoriteMovies = async () => {
        try {
            const { data } = await api.get('/api/user/favorites');
            if (data.success) {
                setFavoriteMovies(data.movies);
            } else if (user) {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
            if (user) toast.error('Failed to fetch favorites');
        }
    };

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
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to set theatre'
            };
        }
    };

    // Load on app start
    useEffect(() => {
        const token = getToken();
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    // OAuth callback handler
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (token) {
            handleAuthCallback(token);
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (error) {
            toast.error('Authentication failed. Please try again.');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // Fetch extra info after user is loaded
    useEffect(() => {
        if (user) {
            fetchIsAdmin();
            fetchAdAccess();
            fetchFavoriteMovies();
        } else {
            setIsAdmin(false);
            setFavoriteMovies([]);
        }
    }, [user]);

    useEffect(() => {
        if (user && user.theatre) setTheatre(user.theatre);
    }, [user]);

    const value = {
        user,
        loading,
        isAuthenticated,
        isAdmin,
        hasAdAccess,
        login,
        logout,
        getToken,
        fetchUser,
        fetchIsAdmin,
        fetchAdAccess,
        fetchUserFromBackend: fetchUser,
        setAdminTheatre,
        api,
        axios: api,
        image_base_url: 'https://image.tmdb.org/t/p/w500',
        theatre,
        city,
        favoriteMovies,
        fetchFavoriteMovies
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
