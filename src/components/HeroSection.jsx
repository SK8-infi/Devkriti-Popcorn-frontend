import React, { useState, useCallback } from 'react'
import { assets } from '../assets/assets'
import { ArrowRight, CalendarIcon, ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CircularGallery from './CircularGallery'

const galleryItems = [
  { image: "https://movies.universalpictures.com/media/jwr-poster-6865c7916b689-1.jpg", text: "Jurassic World-Rebirth" },
  { image: "https://www.movieposters.com/cdn/shop/files/deadpool-wolverine_866a70e7-fb48-4f35-a44b-41594691ac76_480x.progressive.jpg?v=1724680738", text: "Deadpool vs Wolverine" },
  { image: "https://www.movieposters.com/cdn/shop/files/interstellar_593eaeff_480x.progressive.jpg?v=1698434355", text: "Interstellar" },
  { image: "https://www.movieposters.com/cdn/shop/files/inside_out_two_ver2_480x.progressive.jpg?v=1711998871", text: "Inside Out-2" },
  { image: "https://www.movieposters.com/cdn/shop/files/259ac589598c8653010bcc12551e3dda_aa8d408b-cf3b-40d9-a10b-5ea44814660c_480x.progressive.jpg?v=1706906974", text: "Spiderman 2" },
  { image: "https://www.movieposters.com/cdn/shop/products/the-matrix-resurrections_ufnqeyn9_480x.progressive.jpg?v=1640208300", text: "The Matrix-Resurrections" },
  { image: "https://www.movieposters.com/cdn/shop/files/thunderbolts_ver2_480x.progressive.jpg?v=1739462500", text: "Thunderbolts" },
  { image: "https://www.movieposters.com/cdn/shop/files/scan005_cc835190-0c9e-4fb1-a105-c444a56fc183_480x.progressive.jpg?v=1745436005", text: "Mission Impossible" },
  { image: "https://www.movieposters.com/cdn/shop/files/f1-the-movie_g8c3qthq_480x.progressive.jpg?v=1749735873", text: "F1" },
  { image: "https://www.movieposters.com/cdn/shop/files/ballerina_c9j6rsmh_480x.progressive.jpg?v=1741784381", text: "Ballerina" },
];

const colorPalette = [
  '#212121', // dark gray
  '#1a237e', // dark blue
  '#263238', // dark slate
  '#b71c1c', // dark red
  '#004d40', // dark teal
  '#311b92', // dark indigo
  '#3e2723', // dark brown
  '#37474f', // blue gray
  '#0d1333', // very dark blue
  '#222f3e', // dark navy
  '#2d3436', // dark charcoal
  '#232526', // dark blackish
];

// Add a separate array for background images
const backgroundImages = [
  // Replace these URLs with your own background images
  'https://images.hdqwalls.com/download/jurassic-world-rebirth-dolby-poster-u0-1360x768.jpg',
  'https://images.hdqwalls.com/wallpapers/marvel-deadpool-and-wolverine-8k-yv.jpg',
  'https://images.hdqwalls.com/download/interstellar-2014-1366x768.jpg',
  'https://images.hdqwalls.com/wallpapers/inside-out-2-movie-5k-zp.jpg',
  'https://images.hdqwalls.com/wallpapers/venom-in-marvel-spiderman-2-wf.jpg',
  'https://images.hdqwalls.com/wallpapers/keanu-reeves-the-matrix-resurrections-5k-dz.jpg',
  'https://images.hdqwalls.com/wallpapers/thunderbolts-silent-justice-kv.jpg',
  'https://images.hdqwalls.com/wallpapers/mission-impossible-the-final-reckoning-movie-2025-nq.jpg',
  'https://images.hdqwalls.com/wallpapers/f1-movie-8k-nt.jpg',
  'https://images.hdqwalls.com/wallpapers/ballerina-2025-4k-3v.jpg',
];

// Movie info array for each gallery item
const movieInfo = [
  {
    title: "Jurassic World: Rebirth",
    genres: ["Action", "Adventure", "Sci-Fi"],
    year: 2025,
    duration: "2h 18m",
    description: "Dinosaurs once again roam the Earth as a new era of genetic engineering brings unforeseen consequences. Humanity must fight for survival in a world where prehistoric creatures rule."
  },
  {
    title: "Deadpool vs Wolverine",
    genres: ["Action", "Comedy", "Superhero"],
    year: 2024,
    duration: "2h 7m",
    description: "The wisecracking mercenary Deadpool teams up with the gruff Wolverine for a wild, fourth-wall-breaking adventure packed with action, laughs, and mutant mayhem."
  },
  {
    title: "Interstellar",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    year: 2014,
    duration: "2h 49m",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces environmental collapse."
  },
  {
    title: "Inside Out 2",
    genres: ["Animation", "Adventure", "Comedy"],
    year: 2024,
    duration: "1h 36m",
    description: "Riley navigates new emotions and challenges as she enters her teenage years, with Joy, Sadness, and the rest of the gang along for the ride."
  },
  {
    title: "Spiderman 2",
    genres: ["Action", "Adventure", "Superhero"],
    year: 2023,
    duration: "2h 20m",
    description: "Peter Parker faces new threats and personal dilemmas as he swings back into action to protect New York City from a formidable new villain."
  },
  {
    title: "The Matrix: Resurrections",
    genres: ["Action", "Sci-Fi"],
    year: 2021,
    duration: "2h 28m",
    description: "Neo returns to a world of two realities—everyday life and what lies behind it. To find out if his reality is a construct, he must follow the white rabbit once more."
  },
  {
    title: "Thunderbolts",
    genres: ["Action", "Adventure", "Superhero"],
    year: 2025,
    duration: "2h 10m",
    description: "A team of antiheroes and reformed villains are brought together for a high-stakes mission that could change the fate of the world."
  },
  {
    title: "Mission Impossible",
    genres: ["Action", "Thriller"],
    year: 2025,
    duration: "2h 30m",
    description: "Ethan Hunt and his team face their most dangerous mission yet as they race against time to prevent a global catastrophe."
  },
  {
    title: "F1",
    genres: ["Drama", "Sport"],
    year: 2025,
    duration: "2h 5m",
    description: "A dramatic look at the high-octane world of Formula 1 racing, where ambition, rivalry, and speed collide on and off the track."
  },
  {
    title: "Ballerina",
    genres: ["Action", "Thriller"],
    year: 2025,
    duration: "1h 55m",
    description: "A young assassin seeks vengeance against those who wronged her, blending grace and brutality in a relentless pursuit of justice."
  },
];

const HeroSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate()
    const handleActiveIndexChange = useCallback((idx) => {
      setActiveIndex(idx);
    }, []);

  return (
    <div
      className="landing-bg hero-vignette-bg"
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        minHeight: '100vh',
        width: '100vw',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundImage: `url(${backgroundImages[activeIndex % backgroundImages.length]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 0.7s cubic-bezier(0.4,0,0.2,1)'
      }}
    >
      {/* Vignette overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        background: `
          linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 18%, rgba(0,0,0,0.0) 45%),
          radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.88) 100%)
        `
      }} />
      {/* Movie Info Block */}
      <div
        style={{
          position: 'absolute',
          top: '220px',
          left: window.innerWidth <= 700 ? '16px' : '120px',
          zIndex: 3,
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '22px',
          minWidth: '260px',
          maxWidth: window.innerWidth <= 700 ? '90vw' : '720px',
        }}
      >
        <div style={{ fontSize: window.innerWidth <= 700 ? '2.2rem' : '2.8rem', fontWeight: 700, letterSpacing: '-1px', lineHeight: 1.1, fontFamily: 'Times New Roman, Times, serif' }}>{movieInfo[activeIndex].title}</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: window.innerWidth <= 700 ? '1.05rem' : '1.18rem', opacity: 0.85 }}>
          <span style={{ color: '#ffd700', fontWeight: 600 }}>{movieInfo[activeIndex].year}</span>
          <span style={{ color: '#aaa' }}>|</span>
          <span>{movieInfo[activeIndex].genres.join(', ')}</span>
          <span style={{ color: '#aaa' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ClockIcon size={window.innerWidth <= 700 ? 16 : 20} style={{ marginRight: 4, position: 'relative', top: 1 }} />
            {movieInfo[activeIndex].duration}
          </span>
        </div>
        <div style={{ fontSize: window.innerWidth <= 700 ? '1.08rem' : '1.22rem', opacity: 0.92, lineHeight: 1.5 }}>{movieInfo[activeIndex].description}</div>
      </div>
      {/* Gallery */}
      <div style={{
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: '300px',
        position: 'relative',
        zIndex: 2,
        margin: '5px',
        marginBottom: '15px',
        marginTop: '60px', // shift gallery even further down
      }}>
        <CircularGallery
          items={galleryItems}
          bend={2}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.02}
          onActiveIndexChange={handleActiveIndexChange}
        />
      </div>
    </div>
  )
}

export default HeroSection
