import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, HelpCircle, Lightbulb, FileText, Users, Shield, Settings, ArrowLeft } from 'lucide-react';

// ============================================
// FAQ PAGE
// ============================================
const FAQPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Lightbulb,
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Click the "Sign Up" button in the top right corner. Fill in your details including name, email, and password. Choose whether you\'re registering as an individual or organization. Verify your email address through the link sent to your inbox to activate your account.'
        },
        {
          q: 'What types of users can register?',
          a: 'We support two user types: Individual users (community members seeking resources) and Organization users (service providers, charities, and community organizations offering resources). Each has tailored features and dashboards.'
        },
        {
          q: 'Is the platform free to use?',
          a: 'Yes! Our platform is completely free for all users. We believe everyone should have access to community resources without financial barriers.'
        }
      ]
    },
    {
      id: 'resources',
      title: 'Managing Resources',
      icon: FileText,
      questions: [
        {
          q: 'How do I create a new resource?',
          a: 'Navigate to your dashboard and click "Create Resource". Fill in the required information including title, description, category, location, and contact details. Add images and tags to make your resource more discoverable. Click "Publish" when ready.'
        },
        {
          q: 'Can I edit or delete my resources?',
          a: 'Yes! From your dashboard, find the resource under "My Created Resources". Click the three-dot menu to access options like Edit, Deactivate, or Delete. Deactivated resources are hidden but can be reactivated later.'
        },
        {
          q: 'How do I save resources for later?',
          a: 'Click the bookmark icon on any resource card or detail page. Saved resources appear in your "Saved Resources" section on your dashboard for easy access.'
        },
        {
          q: 'What categories of resources are available?',
          a: 'Resources span multiple categories including Food Banks, Housing Support, Healthcare, Mental Health, Education, Employment, Legal Aid, Financial Assistance, and more. Use filters to browse by category.'
        }
      ]
    },
    {
      id: 'search-discovery',
      title: 'Search & Discovery',
      icon: Search,
      questions: [
        {
          q: 'How does the search function work?',
          a: 'Use the search bar to find resources by keyword, location, or service type. Apply filters for category, availability, and distance. The map view shows resources geographically. Results update in real-time as you refine your search.'
        },
        {
          q: 'Can I search by location?',
          a: 'Yes! Enter your city, postcode, or address in the location field. You can also use the map view to browse resources near you or drag the map to explore different areas.'
        },
        {
          q: 'How are recommendations generated?',
          a: 'Recommendations are based on your location, saved resources, search history, and resources you\'ve interacted with. We prioritize showing you relevant, nearby services.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: Users,
      questions: [
        {
          q: 'How do I update my profile?',
          a: 'Click your profile icon and select "Profile Settings". Update your information including name, location, bio, and profile picture. Remember to click "Save Changes" when done.'
        },
        {
          q: 'I forgot my password. What should I do?',
          a: 'Click "Forgot Password" on the login page. Enter your email address and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
        },
        {
          q: 'How do I delete my account?',
          a: 'Go to Account Settings and scroll to the bottom. Click "Delete Account" and confirm your decision. Note: This action is permanent and will remove all your data including created resources.'
        }
      ]
    },
    {
      id: 'privacy-security',
      title: 'Privacy & Security',
      icon: Shield,
      questions: [
        {
          q: 'How is my personal information protected?',
          a: 'We use industry-standard encryption for all data transmission and storage. Your personal information is never shared with third parties without your consent. Review our Privacy Policy for complete details.'
        },
        {
          q: 'Who can see my information?',
          a: 'Your basic profile information (name, bio) is visible to other users. Contact details you add to resources are visible to those viewing that resource. You control what information appears in your public profile.'
        },
        {
          q: 'Can I control my notification preferences?',
          a: 'Yes! Go to Settings > Notifications to customize email and in-app notifications. Choose which types of updates you want to receive.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: Settings,
      questions: [
        {
          q: 'The site isn\'t loading properly. What should I do?',
          a: 'Try clearing your browser cache and cookies, then refresh the page. Ensure you\'re using a supported browser (Chrome, Firefox, Safari, Edge). If issues persist, contact our support team.'
        },
        {
          q: 'Is there a mobile app?',
          a: 'Currently, we offer a mobile-responsive website that works great on phones and tablets. A dedicated mobile app is in development and coming soon!'
        },
        {
          q: 'Which browsers are supported?',
          a: 'We support the latest versions of Chrome, Firefox, Safari, and Microsoft Edge. For the best experience, keep your browser updated to the latest version.'
        }
      ]
    }
  ];

  const handleFaqToggle = (categoryId, questionIndex) => {
    const key = `${categoryId}-${questionIndex}`;
    setExpandedFaq(expandedFaq === key ? null : key);
  };

  const filteredFaqCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(qa =>
      searchQuery === '' ||
      qa.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
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
            <HelpCircle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find quick answers to common questions about our platform
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFaqCategories.map(category => {
            const IconComponent = category.icon;
            return (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {category.questions.map((qa, index) => {
                    const key = `${category.id}-${index}`;
                    const isExpanded = expandedFaq === key;
                    return (
                      <div key={index}>
                        <button
                          onClick={() => handleFaqToggle(category.id, index)}
                          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                        >
                          <span className="font-medium text-gray-900 pr-4">{qa.q}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 leading-relaxed">{qa.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {searchQuery && filteredFaqCategories.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">Try different keywords or browse all categories</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Still Need Help */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to assist you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/user-dashboard/contact-support" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </Link>
            <Link to="/user-dashboard/user-guide" className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              View User Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;