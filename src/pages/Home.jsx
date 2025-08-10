import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedSection from '../components/FeaturedSection'
import RecommendedSection from '../components/RecommendedSection'
import TrailersSection from '../components/TrailersSection'
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <RecommendedSection />
      <TrailersSection />
      <Footer />
    </>
  )
}

export default Home
