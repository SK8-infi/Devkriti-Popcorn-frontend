import { ArrowRight } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'
import ResponsiveContainer from './ResponsiveContainer'
import ResponsiveGrid from './ResponsiveGrid'
import useResponsive from '../hooks/useResponsive'
import './RecommendedSection.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const RecommendedSection = () => {
    const navigate = useNavigate()
    const { userCity, cityChangeCounter } = useAppContext()
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const { getResponsiveValue } = useResponsive()
    const [currentUserCity, setCurrentUserCity] = useState(null)

    // Get user city from context or localStorage
    useEffect(() => {
        const savedCity = localStorage.getItem('userCity')
        setCurrentUserCity(userCity || savedCity)
    }, [userCity])

    // Fetch movies and filter by rating
    useEffect(() => {
        const fetchRecommendedMovies = async () => {
            try {
                // Fetch all movies from the API
                const response = await fetch(`${API_URL}/api/movies/latest`)
                const data = await response.json()
                
                if (data.movies) {
                    // Filter movies with rating above 8
                    const recommendedMovies = data.movies.filter(movie => {
                        // Check if movie has a vote_average and it's above 8
                        return movie.vote_average && movie.vote_average > 8
                    })
                    
                    // Sort by rating (highest first) and take top 8
                    const sortedMovies = recommendedMovies
                        .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
                        .slice(0, 8)
                    
                    setMovies(sortedMovies)
                }
            } catch (error) {
                console.error('Error fetching recommended movies:', error)
                setMovies([])
            } finally {
                setLoading(false)
            }
        }
        
        fetchRecommendedMovies()
    }, [currentUserCity, cityChangeCounter])

    const responsiveTitleSize = getResponsiveValue({
        xl: '1.6rem',
        lg: '1.5rem',
        md: '1.4rem',
        sm: '1.3rem',
        xs: '1.2rem',
        tiny: '1.1rem',
    });

    const responsiveGap = getResponsiveValue({
        xl: '2.5rem',
        lg: '2.5rem',
        md: '2.5rem',
        sm: '2.5rem',
        xs: '2.5rem',
        tiny: '2.5rem',
    });

    if (loading) {
        return (
            <ResponsiveContainer>
                <section className='recommended-section' style={{ 
                    width: '100%', 
                    color: '#ffefcb', 
                    padding: '20px 0 80px 0', 
                    position: 'relative', 
                    marginBottom: '60px', 
                    overflow: 'hidden' 
                }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div className='recommended-header' style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            width: '100%', 
                            paddingTop: '2.5rem', 
                            paddingBottom: '1.5rem',
                            '@media (max-width: 300px)': {
                                flexDirection: 'column',
                                gap: '0.5rem',
                                alignItems: 'flex-start',
                            }
                        }}>
                            <p className='recommended-title' style={{ 
                                textAlign: 'left', 
                                margin: 0, 
                                fontFamily: 'Gotham, Arial, sans-serif', 
                                fontSize: responsiveTitleSize, 
                                color: '#ffefcb', 
                                letterSpacing: '1px' 
                            }}>RECOMMENDED MOVIES</p>
                            <button onClick={()=> navigate('/movies')} className='featured-viewall-btn'>
                                View All 
                                <ArrowRight style={{transition: 'transform 0.2s'}}/>
                            </button>
                        </div>
                        <div className='recommended-movies' style={{ 
                            display: 'flex', 
                            gap: responsiveGap, 
                            alignItems: 'flex-start', 
                            justifyContent: 'flex-start', 
                            width: '100%',
                            '@media (max-width: 300px)': {
                                justifyContent: 'center',
                            }
                        }}>
                            <p style={{ color: '#ffefcb' }}>Loading recommended movies...</p>
                        </div>
                    </div>
                </section>
            </ResponsiveContainer>
        )
    }

    return (
        <ResponsiveContainer>
            <section className='recommended-section' style={{ 
                width: '100%', 
                color: '#ffefcb', 
                padding: '20px 0 60px 0', 
                position: 'relative', 
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className='recommended-header' style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        width: '100%', 
                        paddingTop: '2.5rem', 
                        paddingBottom: '1.5rem',
                        '@media (max-width: 300px)': {
                            flexDirection: 'column',
                            gap: '0.5rem',
                            alignItems: 'flex-start',
                        }
                    }}>
                        <p className='recommended-title' style={{ 
                            textAlign: 'left', 
                            margin: 0, 
                            fontFamily: 'Gotham, Arial, sans-serif', 
                            fontSize: responsiveTitleSize, 
                            color: '#ffefcb', 
                            letterSpacing: '1px', 
                            fontWeight: 'bold' 
                        }}>RECOMMENDED MOVIES</p>
                        <button onClick={()=> navigate('/movies')} className='featured-viewall-btn'>
                            View All 
                            <ArrowRight style={{transition: 'transform 0.2s'}}/>
                        </button>
                    </div>
                    {movies.length > 0 ? (
                        <ResponsiveGrid
                            columns={{
                                default: 4,
                                lg: 4,
                                md: 3,
                                sm: 3,
                                xs: 2,
                                tiny: 2
                            }}
                            gap={responsiveGap}
                        >
                            {movies.map((movie) => (
                                <MovieCard 
                                  key={movie.id || movie._id} 
                                  movie={movie}
                                  variant="home"
                                />
                            ))}
                        </ResponsiveGrid>
                    ) : (
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            width: '100%',
                            padding: '2rem 0'
                        }}>
                            <p style={{ color: '#ffefcb' }}>No recommended movies available at the moment.</p>
                        </div>
                    )}
                </div>
            </section>
        </ResponsiveContainer>
    )
}

export default RecommendedSection
