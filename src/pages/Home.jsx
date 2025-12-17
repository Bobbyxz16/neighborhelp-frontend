// pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Users, MapPin, Sparkles, ArrowRight, CheckCircle, TrendingUp, LogIn, UserPlus } from 'lucide-react';
import Footer from '../components/layout/Footer';

/**
 * Home Page - Landing page with hero section and features
 * 
 * Features:
 * - Hero section with search bar
 * - How it works section
 * - Statistics section
 * - Features showcase
 * - CTA section
 */
const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Handle search submission
   */
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      // Redirect to resources page with the search query
      navigate(`/resources?search=${encodeURIComponent(query)}`);
    } else {
      // If search query is empty, just go to resources page
      navigate('/resources');
    }
  };

  /**
   * Quick search by category (redirects as search for consistency)
   */
  const handleQuickSearch = (category) => {
    const query = category ? category.trim() : '';
    if (query) {
      // Redirect to resources page with the category as search query
      navigate(`/resources?search=${encodeURIComponent(query)}`);
    } else {
      // If no category is provided, just go to resources page
      navigate('/resources');
    }
  };



  const features = [
    {
      icon: Search,
      title: 'Discover Resources',
      description: 'Find food banks, community centers, educational programs, healthcare services, and more in your local area.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Heart,
      title: 'Share & Give Back',
      description: 'List resources you can offer to help others in your community thrive and succeed.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Users,
      title: 'Build Connections',
      description: 'Connect with neighbors, organizations, and create a stronger, more resilient community together.',
      color: 'bg-green-100 text-green-600'
    }
  ];

  const stats = [
    { label: 'Active Resources', value: '2,500+', icon: TrendingUp },
    { label: 'Community Members', value: '10,000+', icon: Users },
    { label: 'Cities Covered', value: '50+', icon: MapPin },
    { label: 'Success Stories', value: '5,000+', icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search and Login */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          {/* Top Right Navigation Buttons */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Register</span>
              </button>
            </div>
          </div>

          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Help Your <span className="text-yellow-300">Neighbors</span>,
              <br />
              Build Your <span className="text-purple-300">Community</span>
            </h1>

            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Connect with local resources, share what you have, and discover what your community offers. Together, we're stronger.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for food banks, shelters, job training, healthcare..."
                    className="w-full pl-14 pr-32 py-5 rounded-xl text-lg border-2 border-transparent focus:border-white focus:outline-none shadow-2xl"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
                  >
                    Search
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Quick Category Buttons */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/resources')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors shadow-xl flex items-center gap-2"
              >
                Browse All Resources
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-blue-500/30 transition-colors border-2 border-white/30"
              >
                Join Community
              </button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 fill-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How NeighborlyUnion Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, effective, and built for communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-xl mb-6`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Why Choose NeighborlyUnion?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're more than just a directory – we're a community-driven platform dedicated to making support accessible to everyone.
              </p>

              <div className="space-y-4">
                {[
                  'Free and accessible to all community members',
                  'Verified resources and organizations',
                  'Real-time updates and availability',
                  'User reviews and ratings for transparency',
                  'Mobile-friendly and easy to navigate',
                  'Privacy-focused and secure platform'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Join Our Community Today
                  </h3>
                  <p className="text-gray-600">
                    Be part of something bigger. Help your neighbors and strengthen your community.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    Sign Up Free
                  </button>
                  <button
                    onClick={() => navigate('/resources')}
                    className="w-full px-6 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors border-2 border-blue-200"
                  >
                    Browse as Guest
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of neighbors helping each other every day.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            
          </div>
        </div>
      </div>

      {/* Professional Footer */}
      <Footer />
    </div>
  );
};

export default Home;