import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import './Movies.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/movies/latest`).then(res => res.json()),
      fetch(`${API_URL}/api/show/all`).then(res => res.json())
    ]).then(([moviesData, showsData]) => {
      const now = new Date();
      const futureShowMovieIds = new Set(
        (showsData.shows || [])
          .filter(show => new Date(show.showDateTime) > now)
          .map(show => show.movie && String(show.movie._id))
      );
      const filteredMovies = (moviesData.movies || []).filter(movie => futureShowMovieIds.has(String(movie.id)));
      setMovies(filteredMovies);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

<<<<<<< Updated upstream
  return movies.length > 0 ? (
=======
  // Get unique movies from shows
  const uniqueMoviesMap = new Map();
  shows.forEach(show => {
    if (show.movie && !uniqueMoviesMap.has(show.movie._id)) {
      uniqueMoviesMap.set(show.movie._id, show);
    }
  });
  const uniqueShows = Array.from(uniqueMoviesMap.values());

  return shows.length > 0 ? (
>>>>>>> Stashed changes
    <div className='movies-container'>
      <h1 className='movies-title'>Now Showing</h1>
      <div className='movies-list'>
<<<<<<< Updated upstream
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.id}/>
=======
        {uniqueShows.map((show)=> (
          <MovieCard movie={show.movie} key={show.movie._id}/>
>>>>>>> Stashed changes
        ))}
      </div>
    </div>
  ) : loading ? (
    <div className='movies-empty'>
      <h1 className='movies-empty-title'>Loading movies...</h1>
    </div>
  ) : (
    <div className='movies-empty'>
      <h1 className='movies-empty-title'>No movies available</h1>
    </div>
  )
}

export default Movies
