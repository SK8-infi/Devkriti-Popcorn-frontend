import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext()

export const AppProvider = ({ children })=>{

    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([])
    const [theatre, setTheatre] = useState(undefined); // name
    const [theatreId, setTheatreId] = useState(undefined); // _id
    const [city, setCity] = useState(undefined) // undefined = loading, null = not set, string = set
    const [allMovies, setAllMovies] = useState([])

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const {user} = useUser()
    const {getToken} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const fetchIsAdmin = async ()=>{
        try {
            const {data} = await axios.get('/api/admin/is-admin', {headers: {Authorization: `Bearer ${await getToken()}`}})
            setIsAdmin(data.isAdmin)

            if(!data.isAdmin && location.pathname.startsWith('/admin')){
                navigate('/')
                toast.error('You are not authorized to access admin dashboard')
            }
        } catch (error) {
            console.error(error)
            // Don't show error for non-authenticated users
            if (user && location.pathname.startsWith('/admin')){
                navigate('/')
                toast.error('You are not authorized to access admin dashboard')
            }
        }
    }

    const fetchShows = async ()=>{
        try {
            const { data } = await axios.get('/api/show/all')
            if(data.success){
                setShows(data.shows)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchFavoriteMovies = async ()=>{
        try {
            const { data } = await axios.get('/api/user/favorites', {headers: {Authorization: `Bearer ${await getToken()}`}})

            if(data.success){
                setFavoriteMovies(data.movies)
            }else{
                // Don't show error for non-authenticated users
                if (user) {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.error(error)
            // Don't show error for non-authenticated users
            if (user) {
                toast.error('Failed to fetch favorites')
            }
        }
    }

    const fetchAllMovies = async ()=>{
        try {
            const { data } = await axios.get('/api/movies')
            if(data.success){
                setAllMovies(data.movies)
            }
        } catch (error) {
            console.error('Error fetching all movies:', error)
        }
    }

    useEffect(()=>{
        fetchShows()
        fetchAllMovies()
    },[])

    useEffect(()=>{
        if(user){
            fetchIsAdmin()
            fetchFavoriteMovies()
        } else {
            // Reset admin status for non-authenticated users
            setIsAdmin(false)
            setFavoriteMovies([])
        }
    },[user])

    useEffect(()=>{
        if(user && user.theatre) setTheatre(user.theatre)
    }, [user])

    useEffect(() => {
        const fetchTheatreAndCity = async () => {
            if (isAdmin) {
                try {
                    const { data } = await axios.get('/api/admin/my-theatre', { headers: { Authorization: `Bearer ${await getToken()}` } });
                    if (data.success && data.theatre) {
                        setTheatre(data.theatre.name || null);
                        setTheatreId(data.theatre._id || null);
                        setCity(data.city || null);
                    } else {
                        setTheatre(null);
                        setTheatreId(null);
                        setCity(null);
                    }
                } catch (error) {
                    setTheatre(null);
                    setTheatreId(null);
                    setCity(null);
                }
            }
        };
        fetchTheatreAndCity();
    }, [isAdmin, getToken]);

    // Fetch theatre from backend (Theatre model) and update theatre and city
    const fetchTheatreFromBackend = async () => {
        try {
            const { data } = await axios.get('/api/admin/my-theatre', { headers: { Authorization: `Bearer ${await getToken()}` } })
            if (data.success && data.theatre) {
                setTheatre(data.theatre.name || null)
                setTheatreId(data.theatre._id || null)
                setCity(data.city || null)
            } else {
                setTheatre(null)
                setTheatreId(null)
                setCity(null)
            }
            return data;
        } catch (error) {
            setTheatre(null)
            setTheatreId(null)
            setCity(null)
            console.error('Failed to fetch theatre from backend', error)
        }
    }

    const setAdminTheatre = async (theatreName, city) => {
        try {
            const { data } = await axios.post('/api/admin/set-theatre', { theatre: theatreName, city }, { headers: { Authorization: `Bearer ${await getToken()}` } })
            if(data.success) {
                // Fetch the full theatre info from the Theatre model
                const theatreRes = await axios.get('/api/admin/my-theatre', { headers: { Authorization: `Bearer ${await getToken()}` } });
                if (theatreRes.data && theatreRes.data.success) {
                    setTheatre(theatreRes.data.theatre?.name || null);
                    setTheatreId(theatreRes.data.theatre?._id || null);
                    setCity(theatreRes.data.city || null);
                }
            }
            return data
        } catch (error) {
            console.error(error)
            return { success: false, message: 'Failed to set theatre' }
        }
    }

    const value = {
        axios,
        fetchIsAdmin,
        user, getToken, navigate, isAdmin, shows, 
        favoriteMovies, fetchFavoriteMovies, image_base_url,
        theatre, theatreId, setAdminTheatre,
        city, setCity,
        fetchTheatreFromBackend,
        allMovies, fetchAllMovies
    }

    return (
        <AppContext.Provider value={value}>
            { children }
        </AppContext.Provider>
    )
}

export const useAppContext = ()=> useContext(AppContext)