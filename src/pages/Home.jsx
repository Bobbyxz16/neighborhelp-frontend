// pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Users, MapPin, Sparkles, ArrowRight, CheckCircle, TrendingUp, LogIn, UserPlus } from 'lucide-react';
import Footer from '../components/layout/Footer';
import SEO from '../components/SEO/SEO';

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
    <div className="min-h-screen bg-background">
      <SEO
        title="Find Free Community Resources in UK | NeighborlyUnion"
        description="Search verified UK charities and community resources. Food banks, legal aid, housing support, mental health services. Free and local help near you."
        url="https://neighborlyunion.com"
      />
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
            <div className="max-w-3xl mx-auto mb-8 px-2">
              <form onSubmit={handleSearch} className="space-y-3 sm:space-y-0">
                {/* Mobile: stacked layout, Desktop: inline */}
                <div className="relative flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 sm:w-6 sm:h-6" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search resources..."
                      className="w-full pl-12 sm:pl-14 pr-4 py-4 sm:py-5 rounded-xl text-base sm:text-lg border-2 border-transparent bg-card text-foreground focus:border-white focus:outline-none shadow-2xl"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-4 sm:py-3 bg-primary text-primary-foreground rounded-xl sm:rounded-lg hover:opacity-90 font-medium transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Search</span>
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
          <svg className="w-full h-12 sm:h-16 fill-background" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-12 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How NeighborlyUnion Works
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, effective, and built for communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-card rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow border border-border">
                  <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 ${feature.color} rounded-xl mb-4 sm:mb-6`}>
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-12 sm:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                Why Choose NeighborlyUnion?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                We're more than just a directory – we're a community-driven platform dedicated to making support accessible to everyone.
              </p>

              <div className="space-y-3 sm:space-y-4">
                {[
                  'Free and accessible to all community members',
                  'Verified resources and organizations',
                  'Real-time updates and availability',
                  'User reviews and ratings for transparency',
                  'Mobile-friendly and easy to navigate',
                  'Privacy-focused and secure platform'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-base sm:text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 sm:p-8 shadow-xl border border-border">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                    Join Our Community Today
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Be part of something bigger. Help your neighbors and strengthen your community.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full px-6 py-3 sm:py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-base sm:text-lg hover:opacity-90 transition-all shadow-lg"
                  >
                    Sign Up Free
                  </button>
                  <button
                    onClick={() => navigate('/resources')}
                    className="w-full px-6 py-3 sm:py-4 bg-card text-primary rounded-xl font-semibold text-base sm:text-lg hover:bg-accent transition-colors border-2 border-primary/20"
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