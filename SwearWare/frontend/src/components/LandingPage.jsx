import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Volume2, BarChart2, Shield, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page overflow-hidden">
      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-blue-600 to-blue-800 text-white px-4">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent"></div>
      
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="mb-6 transform animate-fade-in-down">
          <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium inline-block mb-4">
            🎉 Introducing SwearWare 1.0
          </span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-down bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
          Transform Your Language,
          <br />
          One Word at a Time
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-fade-in-up">
          The smart swear jar that helps you build better habits.
          <br />
          <span className="text-lg text-blue-200 mt-2 inline-block">Powered by Raspberry Pi & AI</span>
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
          <Link to="/login">
            <button className="group px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-900 font-bold rounded-full hover:from-yellow-300 hover:to-yellow-200 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <a 
            href="#learn-more"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center gap-2"
          >
            Learn More
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M0 49.9999L60 44.0999C120 37.9999 240 25.9999 360 19.9999C480 13.9999 600 13.9999 720 25.9999C840 37.9999 960 61.9999 1080 67.9999C1200 73.9999 1320 61.9999 1380 55.9999L1440 49.9999V119.9999H1380C1320 119.9999 1200 119.9999 1080 119.9999C960 119.9999 840 119.9999 720 119.9999C600 119.9999 480 119.9999 360 119.9999C240 119.9999 120 119.9999 60 119.9999H0V49.9999Z" 
            fill="white"
          />
        </svg>
      </div>
    </header>

      {/* Features Grid */}
      <section id="learn-more" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How SwearWare Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Volume2 className="w-8 h-8 text-blue-600" />,
                title: "Smart Detection",
                description: "Advanced speech recognition powered by machine learning algorithms."
              },
              {
                icon: <BarChart2 className="w-8 h-8 text-blue-600" />,
                title: "Real-time Analytics",
                description: "Track progress and view detailed insights about usage patterns."
              },
              
              {
                icon: <Zap className="w-8 h-8 text-blue-600" />,
                title: "Instant Feedback",
                description: "Get immediate notifications and progress updates."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-4 p-3 bg-blue-50 rounded-lg w-fit group-hover:bg-blue-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      {/* Call-to-Action */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Habits?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who are already improving their language habits with SwearWare.
          </p>
          <Link to="/login">
            <button className="group px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto">
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-80">
            <div>
              <h3 className="text-lg font-semibold mb-4">About SwearWare</h3>
              <p className="text-gray-400">
                Revolutionizing personal development through innovative technology and AI.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: k6lyu@uwaterloo.ca<br />
                Location: Waterloo, ON
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SwearWare Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;