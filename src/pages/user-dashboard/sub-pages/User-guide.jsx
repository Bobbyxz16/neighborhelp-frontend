import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Lightbulb, FileText, Settings, ArrowLeft } from 'lucide-react';

const UserGuidePage = () => {
  const navigate = useNavigate();

  const userGuideTopics = [
    {
      title: 'Quick Start Guide',
      icon: Lightbulb,
      description: 'New to the platform? Start here to get up and running quickly.',
      steps: [
        'Create your account and complete your profile with accurate information',
        'Explore resources using the search bar and location filters',
        'Save resources you find helpful to your dashboard for easy access',
        'Contact resource providers directly through the platform',
        'Share resources with others who need them via social media or direct links'
      ]
    },
    {
      title: 'For Resource Seekers',
      icon: Search,
      description: 'Finding the help you need has never been easier.',
      steps: [
        'Use the search bar to find specific services by keyword or category',
        'Apply location filters to discover resources near your current location',
        'Check resource availability, operating hours, and contact information',
        'Save important resources to your dashboard for quick reference',
        'Contact providers through the platform\'s secure messaging system',
        'Leave reviews and ratings to help others in the community'
      ]
    },
    {
      title: 'For Resource Providers',
      icon: FileText,
      description: 'Maximize your impact by effectively managing your resources.',
      steps: [
        'Create detailed resource listings with accurate, up-to-date information',
        'Add high-quality images and comprehensive contact details',
        'Keep your resources updated with current availability and hours',
        'Respond promptly to inquiries from community members',
        'Monitor your resource statistics to understand community needs',
        'Update your organization profile to build trust with users'
      ]
    },
    {
      title: 'Advanced Features',
      icon: Settings,
      description: 'Get more out of the platform with these powerful features.',
      steps: [
        'Use map view to visualize resources geographically in your area',
        'Set up notification preferences to stay informed about new resources',
        'Filter search results by multiple criteria simultaneously',
        'Export your saved resources list for offline reference',
        'Connect with other organizations through the network feature'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Back Button */}
          <button
            onClick={() => navigate('/user-dashboard')}
            className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h1 className="text-4xl font-bold mb-4">User Guide</h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Everything you need to know to make the most of our platform
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Our Platform</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our community resource platform connects people in need with essential services and support. Whether you're seeking help or providing resources, this guide will help you navigate the platform effectively.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Follow the step-by-step instructions below to get started and discover all the features available to you.
          </p>
        </div>

        {/* Guide Topics */}
        <div className="space-y-8">
          {userGuideTopics.map((topic, index) => {
            const IconComponent = topic.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-3 bg-purple-600 text-white rounded-lg">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{topic.title}</h3>
                  </div>
                  <p className="text-gray-600 ml-16">{topic.description}</p>
                </div>
                <div className="p-8">
                  <ol className="space-y-4">
                    {topic.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start">
                        <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold mr-4 mt-1">
                          {stepIndex + 1}
                        </span>
                        <span className="text-gray-700 pt-1 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips & Best Practices */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Tips & Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Keep Your Profile Updated</h4>
                <p className="text-gray-600 text-sm">Regular updates help us provide better recommendations</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Use Specific Search Terms</h4>
                <p className="text-gray-600 text-sm">Detailed searches yield more accurate results</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Verify Resource Information</h4>
                <p className="text-gray-600 text-sm">Always confirm hours and availability before visiting</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Share Your Experience</h4>
                <p className="text-gray-600 text-sm">Reviews and ratings help improve our community</p>
              </div>
            </div>
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Our support team is ready to help you with any questions or concerns.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/user-dashboard/contact-support" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Contact Support
            </Link>
            <Link to="/user-dashboard/faq" className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuidePage;