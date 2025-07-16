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

      <img onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0, 0)}}
       src={image_base_url + movie.backdrop_path} alt="" className='movie-card-img'/>

       <p className='movie-card-title' style={{fontFamily: 'Times New Roman, Times, serif'}}>{movie.title}</p>

       <p className='movie-card-details'>
        {new Date(movie.release_date).getFullYear()} • {(movie.genres && Array.isArray(movie.genres) ? movie.genres.slice(0,2).map(genre => genre.name === 'Science Fiction' ? 'Sci-Fi' : genre.name).join(" | ") : 'No Genre')} • {timeFormat(movie.runtime)}
       </p>

       <div className='movie-card-footer'>
        <button onClick={()=> {navigate(`/movies/${movie._id}`); scrollTo(0, 0)}} className='movie-card-buy-btn'>Buy Tickets</button>

        <p className='movie-card-rating'>
            <StarIcon className="star-icon"/>
            {typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A'}
        </p>
       </div>

    </div>
  )
}

export default MovieCard
