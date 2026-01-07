import React from 'react'
import { Link } from 'react-router-dom'

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Hero Section */}
      <section className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-primary">VibeClip</span> AI
            </h1>
            <p className="text-xl md:text-2xl text-base-content/80 mb-8">
              Transform your videos into engaging clips with the power of AI
            </p>
            <p className="text-lg text-base-content/70 mb-10 max-w-2xl mx-auto">
              Automatically detect the best moments, generate captions, and create 
              shareable clips that capture your audience's attention.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose VibeClip AI?</h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Our cutting-edge AI technology makes video editing effortless and effective
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="card-title justify-center mb-2">AI-Powered Detection</h3>
                <p className="text-base-content/70">
                  Our AI automatically identifies the most engaging moments in your videos
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="card-title justify-center mb-2">Lightning Fast</h3>
                <p className="text-base-content/70">
                  Process videos in minutes, not hours. Get your clips ready instantly
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="card-title justify-center mb-2">Social Ready</h3>
                <p className="text-base-content/70">
                  Optimized formats for all social media platforms
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}