import React from 'react'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'
import './Favorite.css'

const Favorite = () => {

  const {favoriteMovies} = useAppContext()

  return favoriteMovies.length > 0 ? (
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

