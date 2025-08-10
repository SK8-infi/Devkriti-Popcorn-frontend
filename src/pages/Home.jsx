import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import RecommendedSection from '../components/RecommendedSection'
import TrailersSection from '../components/TrailersSection'
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="relative">
      {/* Fixed Background SVG */}
      <div 
        className="fixed inset-0 w-full h-full z-0"
        style={{
          backgroundImage: 'url("/bg-4.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
          backgroundColor: 'rgba(255, 0, 0, 0.1)', // Debug color to see if div is visible
        }}
      />
      
      {/* Content Container */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturedSection />
        <RecommendedSection />
        <TrailersSection />
        <Footer />
      </div>
    </div>
  )
}

export default Home
