import React, { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import './Movies.css'
import { useLocation, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResult, setNoResult] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

      // Search logic
      const params = new URLSearchParams(location.search);
      const search = params.get('search');
      if (search) {
        const found = filteredMovies.find(movie => movie.title.toLowerCase().includes(search.toLowerCase()));
        if (found) {
          navigate(`/movies/${found.id || found._id}`);
        } else {
          setNoResult(true);
        }
      } else {
        setNoResult(false);
      }
    }).catch(() => setLoading(false));
  }, [location.search, navigate]);

  return noResult ? (
    <div className='movies-empty'>
      <h1 className='movies-empty-title'>No shows for this movie.</h1>
    </div>
  ) : movies.length > 0 ? (
    <div className='movies-container'>
      <h1 className='movies-title'>Now Showing</h1>
      <div className='movies-list'>
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.id}/>
        ))}
      </div>
    </div>
  ) : loading ? (
    <div className='movies-empty'>
      <h1 className='movies-empty-title'>Loading movies...</h1>
    </div>
  ) : null;
}

export default Movies
