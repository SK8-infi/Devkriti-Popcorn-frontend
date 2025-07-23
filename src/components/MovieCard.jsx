import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'
import './MovieCard.css'

const MovieCard = ({movie}) => {

    const navigate = useNavigate()
    const {image_base_url} = useAppContext()

  return (
    <div className='movie-card'>
<<<<<<< Updated upstream

      <img
        onClick={() => { if (movie.id) { navigate(`/movies/${movie.id}`); scrollTo(0, 0); } }}
        src={image_base_url + movie.backdrop_path} alt="" className='movie-card-img'/>

       <p className='movie-card-title' style={{fontFamily: 'Times New Roman, Times, serif'}}>{movie.title}</p>

       <p className='movie-card-details'>
        {new Date(movie.release_date).getFullYear()} • {(movie.genres && Array.isArray(movie.genres) ? movie.genres.slice(0,2).map(genre => genre.name === 'Science Fiction' ? 'Sci-Fi' : genre.name).join(" | ") : 'No Genre')} • {timeFormat(movie.runtime)}
       </p>

       <div className='movie-card-footer'>
        <button onClick={()=> { if (movie.id) { navigate(`/movies/${movie.id}`); scrollTo(0, 0); } }} className='movie-card-buy-btn'>Buy Tickets</button>

        <p className='movie-card-rating'>
            <StarIcon className="star-icon"/>
=======
      <div style={{position: 'relative', width: '100%'}}>
        <img onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0, 0)}}
         src={image_base_url + movie.backdrop_path} alt="" className='movie-card-img'/>
        <div className='movie-card-rating' style={{position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.72)', padding: '6px 14px', borderRadius: '999px', fontWeight: 600, zIndex: 2, display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '1rem', color: '#FFD600', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)'}}>
          <span style={{display: 'flex', alignItems: 'center'}}>
            <span style={{marginRight: 4}}><svg width="16" height="16" viewBox="0 0 24 24" fill="#FFD600" stroke="#FFD600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span>
>>>>>>> Stashed changes
            {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A'}
          </span>
        </div>
      </div>
      <p className='movie-card-title'>{movie.title}</p>
       <p className='movie-card-details'>
        {(movie.genres && Array.isArray(movie.genres) ? movie.genres.slice(0,3).map(genre => genre.name === 'Science Fiction' ? 'Sci-Fi' : genre.name).join("/") : 'No Genre')}
       </p>
    </div>
  )
}

export default MovieCard
