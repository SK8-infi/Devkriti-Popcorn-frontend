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
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [hasOwnerAccess, setHasOwnerAccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [theatre, setTheatre] = useState(null); // Theatre name
    const [theatreCity, setTheatreCity] = useState(null); // Theatre's city
    const [theatreAddress, setTheatreAddress] = useState(null); // Theatre's address
    const [theatreId, setTheatreId] = useState(null); // Theatre's MongoDB ID
    const [userCity, setUserCity] = useState(null); // User's personal city preference
    const [allMovies, setAllMovies] = useState([]); // All movies for trailers
    const navigate = useNavigate();
    const location = useLocation();

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

    // Debug function to check environment variables
    const debugEnvironment = () => {
        console.log('🔍 Environment Debug:');
        console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
        console.log('NODE_ENV:', import.meta.env.NODE_ENV);
        console.log('MODE:', import.meta.env.MODE);
        console.log('BASE_URL:', import.meta.env.BASE_URL);
    };

    const login = () => {
        debugEnvironment(); // Add debug call
        const authUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/google`;
        console.log('🔗 Login URL:', authUrl);
        console.log('🔗 VITE_API_URL:', import.meta.env.VITE_API_URL);
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
        setIsAdmin(false);
        setHasOwnerAccess(false);
        setTheatre(null);
        setTheatreCity(null);
        setTheatreAddress(null);
        setTheatreId(null);
        setUserCity(null);
        setFavoriteMovies([]);
        toast.success('Logged out successfully');
    };

    const fetchUser = async () => {
        try {
            console.log('🔍 Fetching user data...');
            const response = await api.get('/api/auth/me');
            if (response.data.success) {
                const fetchedUser = response.data.user;
                console.log('✅ User fetched:', fetchedUser);
                setUser(fetchedUser);
                setIsAuthenticated(true);
                setUserCity(fetchedUser.city); // Set user's personal city preference
                
                // Fetch theatre data if user is admin or owner
                if (fetchedUser.role === 'admin' || fetchedUser.role === 'owner') {
                    console.log('🎭 User is admin/owner, fetching theatre data...');
                    try {
                        const theatreResponse = await api.get('/api/admin/my-theatre');
                        console.log('🎭 Theatre response:', theatreResponse.data);
                        if (theatreResponse.data.success) {
                            setTheatre(theatreResponse.data.theatre.name);
                            setTheatreCity(theatreResponse.data.city);
                            setTheatreAddress(theatreResponse.data.address);
                            setTheatreId(theatreResponse.data.theatre._id); // Set theatreId
                            console.log('✅ Theatre data set:', theatreResponse.data.theatre.name, theatreResponse.data.city);
                        } else {
                            // Theatre not found for this admin/owner
                            console.log('⚠️ Theatre not found for admin/owner');
                            setTheatre(null);
                            setTheatreCity(null);
                            setTheatreAddress(null);
                            setTheatreId(null);
                        }
                    } catch (theatreError) {
                        console.error('❌ Error fetching theatre:', theatreError);
                        console.error('❌ Theatre error response:', theatreError.response?.data);
                        setTheatre(null);
                        setTheatreCity(null);
                        setTheatreAddress(null);
                        setTheatreId(null);
                    }
                } else {
                    console.log('👤 User is not admin/owner');
                    setTheatre(null);
                    setTheatreCity(null);
                    setTheatreAddress(null);
                    setTheatreId(null);
                }

                const adminResponse = await api.get('/api/auth/admin/check');
                if (adminResponse.data.success) {
                    // Consider both admin and owner roles as admin access
                    const isAdminOrOwner = adminResponse.data.isAdmin || adminResponse.data.isOwner;
                    setIsAdmin(isAdminOrOwner);
                }

            }
        } catch (error) {
            console.error('❌ Error fetching user:', error);
            console.error('❌ Error response:', error.response?.data);
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
            // Consider both admin and owner roles as admin access
            const isAdminOrOwner = response.data.success && (response.data.isAdmin || response.data.isOwner);
            setIsAdmin(isAdminOrOwner);
        } catch (error) {
            console.error('Error fetching admin status:', error);
            setIsAdmin(false);
        }
    };

    const fetchOwnerAccess = async () => {
        try {
            const token = getToken();
            if (!token) {
                setHasOwnerAccess(false);
                return;
            }
            const response = await api.get('/api/user/owner-access');
            setHasOwnerAccess(response.data.success ? response.data.hasOwnerAccess : false);
        } catch (error) {
            console.error('Error fetching owner access:', error);
            setHasOwnerAccess(false);
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

    const fetchAllMovies = async () => {
        try {
            const { data } = await api.get('/api/movies/latest');
            if (data.movies) {
                setAllMovies(data.movies);
                console.log('✅ Fetched all movies for trailers:', data.movies.length);
            }
        } catch (error) {
            console.error('Error fetching all movies:', error);
        }
    };

    const fetchDashboardData = async () => {
        try {
            const { data } = await api.get('/api/admin/dashboard');
            if (data.success) {
                return data.dashboardData;
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to fetch dashboard data');
            return null;
        }
    };

    const setAdminTheatre = async (theatreName, cityName, addressName) => {
        try {
            console.log('🔧 Setting admin theatre:', { theatreName, cityName, addressName });
            const response = await api.post('/api/admin/set-theatre', {
                theatre: theatreName,
                city: cityName,
                address: addressName
            });

            console.log('🔧 Theatre setup response:', response.data);

            if (response.data.success) {
                // Update local state with new theatre data
                setTheatre(theatreName);
                setTheatreCity(cityName);
                setTheatreAddress(addressName);
                setTheatreId(response.data.theatreId); // Update theatreId with theatre ID
                console.log('✅ Theatre setup successful:', { theatreName, cityName, theatreId: response.data.theatreId });
                return { success: true };
            } else {
                console.log('❌ Theatre setup failed:', response.data.message);
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            console.error('❌ Error setting admin theatre:', error);
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
        // Fetch all movies for trailers
        fetchAllMovies();
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
            fetchOwnerAccess();
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
        hasOwnerAccess,
        login,
        logout,
        getToken,
        fetchUser,
        fetchIsAdmin,
        fetchOwnerAccess,
        fetchUserFromBackend: fetchUser,
        setAdminTheatre,
        api,
        axios: api,
        image_base_url: 'https://image.tmdb.org/t/p/w500',
        theatre,
        theatreCity,
        theatreAddress,
        theatreId,
        userCity,
        favoriteMovies,
        fetchFavoriteMovies,
        fetchDashboardData,
        allMovies,
        fetchAllMovies
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
