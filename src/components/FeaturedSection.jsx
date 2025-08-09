import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'
import './FeaturedSection.css'
import seagreenCurtain from '../assets/seagreen-curtain.svg';

const FeaturedSection = () => {

    const navigate = useNavigate()
<<<<<<< Updated upstream
    const {shows } = useAppContext()

  return (
    <div className='featured-section' style={{ zIndex: 20, position: 'sticky', top: '54px', background: 'none', color: '#ffefcb', height: 'calc(100vh - 54px)', padding: '0 4vw', overflow: 'hidden' }}>
      <img src={seagreenCurtain} alt="Sea Green Curtain" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className='featured-header' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingTop: '2.5rem', paddingBottom: '1.5rem' }}>
          <p className='featured-title' style={{ textAlign: 'left', margin: 0, fontFamily: 'Gotham, Arial, sans-serif', fontSize: '1.6rem', color: '#ffefcb', letterSpacing: '1px' }}>NOW SHOWING</p>
          <button onClick={()=> navigate('/movies')} className='featured-viewall-btn'>
              View All 
              <ArrowRight style={{transition: 'transform 0.2s'}}/>
          </button>
=======
    const { api } = useAppContext()
    const [shows, setShows] = useState([])
    const [loading, setLoading] = useState(true)
    const { isTinyMobile, isSmallMobile, getResponsiveValue } = useResponsive()

    // Fetch shows data
    useEffect(() => {
        const fetchShows = async () => {
            try {
                const response = await api.get('/api/show/all')
                if (response.data.success) {
                    setShows(response.data.shows || [])
                }
            } catch (error) {
                console.error('Error fetching shows:', error)
                setShows([])
            } finally {
                setLoading(false)
            }
        }
        fetchShows()
    }, [api])

    // Get unique movies from shows
    const uniqueMoviesMap = new Map();
    if (shows && shows.length > 0) {
        shows.forEach(show => {
            if (show.movie && !uniqueMoviesMap.has(show.movie._id)) {
                uniqueMoviesMap.set(show.movie._id, show);
            }
        });
    }
    const uniqueShows = Array.from(uniqueMoviesMap.values());

    const responsiveTitleSize = getResponsiveValue({
        xl: '1.6rem',
        lg: '1.5rem',
        md: '1.4rem',
        sm: '1.3rem',
        xs: '1.2rem',
        small: '1.1rem',
        tiny: '1rem',
    });

    const responsiveGap = getResponsiveValue({
        xl: '1.5rem',
        lg: '1.25rem',
        md: '1rem',
        sm: '0.75rem',
        xs: '0.5rem',
        small: '0.25rem',
        tiny: '0.125rem',
    });

    const responsiveSectionPadding = getResponsiveValue({
        xl: '20px 0 80px 0',
        lg: '20px 0 80px 0',
        md: '18px 0 70px 0',
        sm: '16px 0 60px 0',
        xs: '14px 0 50px 0',
        small: '12px 0 40px 0',
        tiny: '10px 0 30px 0',
    });

    const responsiveHeaderPadding = getResponsiveValue({
        xl: '2.5rem',
        lg: '2.5rem',
        md: '2rem',
        sm: '1.5rem',
        xs: '1.2rem',
        small: '1rem',
        tiny: '0.8rem',
    });

  if (loading) {
    return (
      <ResponsiveContainer>
        <section className='featured-section' style={{ 
          width: '100%', 
          color: '#ffefcb', 
          padding: responsiveSectionPadding, 
          position: 'relative', 
          marginBottom: '60px', 
          overflow: 'hidden' 
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className='featured-header' style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              width: '100%', 
              paddingTop: responsiveHeaderPadding, 
              paddingBottom: '1.5rem',
              flexDirection: isTinyMobile ? 'column' : 'row',
              gap: isTinyMobile ? '0.5rem' : '0',
              alignItems: isTinyMobile ? 'flex-start' : 'center',
            }}>
              <p className='featured-title' style={{ 
                textAlign: 'left', 
                margin: 0, 
                fontFamily: 'Gotham, Arial, sans-serif', 
                fontSize: responsiveTitleSize, 
                color: '#ffefcb', 
                letterSpacing: '1px' 
              }}>NOW SHOWING</p>
              <button onClick={()=> navigate('/movies')} className='featured-viewall-btn' style={{
                fontSize: isTinyMobile ? '0.8rem' : 'inherit',
                padding: isTinyMobile ? '0.3rem 0.8rem' : 'inherit',
              }}>
                  View All 
                  <ArrowRight style={{transition: 'transform 0.2s', width: isTinyMobile ? '14px' : '16px', height: isTinyMobile ? '14px' : '16px'}}/>
              </button>
            </div>
            <div className='featured-movies' style={{ 
              display: 'flex', 
              gap: responsiveGap, 
              alignItems: 'flex-start', 
              justifyContent: 'flex-start', 
              width: '100%',
              justifyContent: isTinyMobile ? 'center' : 'flex-start',
            }}>
              <p style={{ color: '#ffefcb' }}>Loading shows...</p>
            </div>
          </div>
        </section>
      </ResponsiveContainer>
    )
  }

  // Add fallback for when api is not available
  if (!api) {
    return (
      <ResponsiveContainer>
        <section className='featured-section' style={{ 
          width: '100%', 
          color: '#ffefcb', 
          padding: responsiveSectionPadding, 
          position: 'relative', 
          marginBottom: '60px', 
          overflow: 'hidden' 
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: '#ffefcb' }}>API not available</p>
          </div>
        </section>
      </ResponsiveContainer>
    )
  }

  // Add fallback for when shows are empty
  if (!shows || shows.length === 0) {
    return (
      <ResponsiveContainer>
        <section className='featured-section' style={{ 
          width: '100%', 
          color: '#ffefcb', 
          padding: responsiveSectionPadding, 
          position: 'relative', 
          marginBottom: '60px', 
          overflow: 'hidden' 
        }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className='featured-header' style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              width: '100%', 
              paddingTop: responsiveHeaderPadding, 
              paddingBottom: '1.5rem',
            }}>
              <p className='featured-title' style={{ 
                textAlign: 'left', 
                margin: 0, 
                fontFamily: 'Gotham, Arial, sans-serif', 
                fontSize: responsiveTitleSize, 
                color: '#ffefcb', 
                letterSpacing: '1px' 
              }}>NOW SHOWING</p>
              <button onClick={()=> navigate('/movies')} className='featured-viewall-btn'>
                  View All 
                  <ArrowRight style={{transition: 'transform 0.2s', width: '16px', height: '16px'}}/>
              </button>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              width: '100%',
              padding: '2rem 0'
            }}>
              <p style={{ color: '#ffefcb' }}>No shows available at the moment.</p>
            </div>
          </div>
        </section>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer>
      <section className='featured-section' style={{ 
        width: '100%', 
        color: '#ffefcb', 
        padding: responsiveSectionPadding, 
        position: 'relative', 
        overflow: 'hidden' 
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className='featured-header' style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            width: '100%', 
            paddingTop: responsiveHeaderPadding, 
            paddingBottom: '1.5rem',
            flexDirection: isTinyMobile ? 'column' : 'row',
            gap: isTinyMobile ? '0.5rem' : '0',
            alignItems: isTinyMobile ? 'flex-start' : 'center',
          }}>
            <p className='featured-title' style={{ 
              textAlign: 'left', 
              margin: 0, 
              fontFamily: 'Gotham, Arial, sans-serif', 
              fontSize: responsiveTitleSize, 
              color: '#ffefcb', 
              letterSpacing: '1px', 
              fontWeight: 'bold' 
            }}>NOW SHOWING</p>
            <button onClick={()=> navigate('/movies')} className='featured-viewall-btn' style={{
              fontSize: isTinyMobile ? '0.8rem' : 'inherit',
              padding: isTinyMobile ? '0.3rem 0.8rem' : 'inherit',
            }}>
                View All 
                <ArrowRight style={{transition: 'transform 0.2s', width: isTinyMobile ? '14px' : '16px', height: isTinyMobile ? '14px' : '16px'}}/>
            </button>
          </div>
          {uniqueShows.length > 0 ? (
            <ResponsiveGrid
              columns={{
                default: 4,
                lg: 4,
                md: 3,
                sm: 2,
                xs: 1,
                small: 1,
                tiny: 1
              }}
              gap={responsiveGap}
            >
              {uniqueShows.map((show) => (
                <MovieCard key={show.movie._id || show.movie.id} movie={{ ...show.movie, id: show.movie.id || show.movie._id }}/>
              ))}
            </ResponsiveGrid>
          ) : (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              width: '100%',
              padding: '2rem 0'
            }}>
              <p style={{ color: '#ffefcb' }}>No shows available at the moment.</p>
            </div>
          )}
>>>>>>> Stashed changes
        </div>
        <div className='featured-movies' style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%' }}>
          {shows.map((show)=>(
              <MovieCard key={show._id} movie={show}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturedSection
