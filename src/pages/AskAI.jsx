import React from 'react'
import { Bot, Sparkles, Clock, MessageSquare, Zap, Search } from 'lucide-react'

const AskAI = () => {
  return (
    <div className="min-h-screen bg-black pt-20 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          {/* Main Heading */}
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Times New Roman, Times, serif', color: '#FFD6A0' }}>
            Ask AI
          </h1>
          
          {/* Subtitle */}
          <p className="text-gray-300 mb-6">
            Your intelligent movie companion powered by AI
          </p>
        </div>

        {/* Coming Soon Section */}
        <div 
          className="rounded-3xl p-12 mb-16 border border-gray-600 shadow-2xl"
                          style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Clock size={40} className="text-primary" />
              <h2 className="text-4xl font-bold" style={{ color: '#FFD6A0' }}>Coming Soon</h2>
            </div>
            
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
              We're building something extraordinary! Our AI-powered assistant will revolutionize how you discover, 
              explore, and enjoy movies. From intelligent recommendations to instant answers about your favorite films.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div 
              className="p-8 rounded-2xl border border-gray-600 hover:border-primary/50 transition-all duration-300"
              style={{
                background: '#000000'
              }}
            >
              <div className="text-primary mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">Smart Recommendations</h3>
              <p className="text-gray-400 leading-relaxed">
                Get personalized movie suggestions based on your viewing history, preferences, and mood.
              </p>
            </div>

            <div 
              className="p-8 rounded-2xl border border-gray-600 hover:border-primary/50 transition-all duration-300"
              style={{
                background: '#000000'
              }}
            >
              <div className="text-primary mb-4">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">Movie Insights</h3>
              <p className="text-gray-400 leading-relaxed">
                Ask questions about plots, cast, reviews, ratings, and get detailed movie information instantly.
              </p>
            </div>

            <div 
              className="p-8 rounded-2xl border border-gray-600 hover:border-primary/50 transition-all duration-300"
              style={{
                background: '#000000'
              }}
            >
              <div className="text-primary mb-4">
                <Clock size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">Show Times & Theaters</h3>
              <p className="text-gray-400 leading-relaxed">
                Find the perfect movie times, nearby theaters, and book tickets seamlessly.
              </p>
            </div>

            <div 
              className="p-8 rounded-2xl border border-gray-600 hover:border-primary/50 transition-all duration-300"
              style={{
                background: '#000000'
              }}
            >
              <div className="text-primary mb-4">
                <Sparkles size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">Genre Discovery</h3>
              <p className="text-gray-400 leading-relaxed">
                Explore new genres and discover hidden gems tailored to your taste preferences.
              </p>
            </div>

            <div 
              className="p-8 rounded-2xl border border-gray-600 hover:border-primary/50 transition-all duration-300"
              style={{
                background: '#000000'
              }}
            >
              <div className="text-primary mb-4">
                <Zap size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">Instant Answers</h3>
              <p className="text-gray-400 leading-relaxed">
                Get quick answers about actors, directors, release dates, and movie trivia.
              </p>
            </div>

            <div 
              className="p-8 rounded-2xl border border-gray-600 hover:border-primary/50 transition-all duration-300"
              style={{
                background: '#000000'
              }}
            >
              <div className="text-primary mb-4">
                <Bot size={32} />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">Conversational AI</h3>
              <p className="text-gray-400 leading-relaxed">
                Have natural conversations about movies and get contextual, intelligent responses.
              </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default AskAI
