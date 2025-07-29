import React, { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'
import './Favorite.css'

const Favorite = () => {
  const { api, user } = useAppContext()
  const [favoriteMovies, setFavoriteMovies] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFavoriteMovies = async () => {
    try {
      if (user) {
        const response = await api.get('/api/user/favorites');
        if (response.data.success) {
          setFavoriteMovies(response.data.favorites || []);
        }
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavoriteMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFavoriteMovies();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className='favorite-empty'>
        <h1 className='favorite-empty-title'>Loading favorites...</h1>
      </div>
    );
  }

  return favoriteMovies && favoriteMovies.length > 0 ? (
    <div className='favorite-container'>

      <h1 className='favorite-title'>Your Favorite Movies</h1>
      <div className='favorite-list'>
        {favoriteMovies.map((movie)=> (
          <MovieCard movie={movie} key={movie._id}/>
        ))}
      </div>
    </div>
  ) : (
    <div className='favorite-empty'>
      <h1 className='favorite-empty-title'>You have not added any movies to your favorites yet.</h1>
    </div>
  )
}

export default Favorite

