import React, { useState } from 'react';
import { AlertTriangle, Phone, Heart, Home, Utensils, Shield, Clock, ExternalLink, MapPin, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmergencyResourcesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const emergencyResources = [
    {
      id: 'emergency-999',
      category: 'immediate',
      title: 'Emergency Services - 999',
      description: 'For life-threatening emergencies requiring immediate police, fire, or ambulance response.',
      phone: '999',
      available: '24/7',
      icon: AlertTriangle,
      color: 'red',
      urgent: true,
      link: null,
      info: 'Call 999 for medical emergencies, serious crime in progress, or immediate danger to life or property.'
    },
    {
      id: 'nhs-111',
      category: 'health',
      title: 'NHS 111 - Non-Emergency Medical',
      description: 'Urgent medical help and advice when it\'s not a life-threatening situation.',
      phone: '111',
      available: '24/7',
      icon: Heart,
      color: 'blue',
      urgent: false,
      link: 'https://111.nhs.uk/',
      info: 'Free to call from landlines and mobiles. Available 24 hours a day, 7 days a week.'
    },
    {
      id: 'samaritans',
      category: 'mental-health',
      title: 'Samaritans - Crisis Support',
      description: 'Confidential emotional support for people experiencing feelings of distress or despair.',
      phone: '116 123',
      email: 'jo@samaritans.org',
      available: '24/7',
      icon: Heart,
      color: 'teal',
      urgent: false,
      link: 'https://www.samaritans.org/',
      info: 'Free to call. Samaritans volunteers provide emotional support to anyone in emotional distress.'
    },
    {
      id: 'crisis-text-line',
      category: 'mental-health',
      title: 'Shout Crisis Text Line',
      description: 'Free, confidential, 24/7 text message support for anyone in crisis.',
      phone: 'Text SHOUT to 85258',
      available: '24/7',
      icon: Heart,
      color: 'purple',
      urgent: false,
      link: 'https://giveusashout.org/',
      info: 'Text SHOUT to 85258 from anywhere in the UK. Confidential support via text message.'
    },
    {
      id: 'domestic-abuse',
      category: 'safety',
      title: 'National Domestic Abuse Helpline',
      description: 'Free and confidential support for women experiencing domestic abuse.',
      phone: '0808 2000 247',
      available: '24/7',
      icon: Shield,
      color: 'pink',
      urgent: false,
      link: 'https://www.nationaldahelpline.org.uk/',
      info: 'Run by Refuge. Free, confidential support for women and children. Men can call Men\'s Advice Line: 0808 8010 327.'
    },
    {
      id: 'childline',
      category: 'mental-health',
      title: 'Childline',
      description: 'Free, private and confidential service for children and young people under 19.',
      phone: '0800 1111',
      available: '24/7',
      icon: Heart,
      color: 'orange',
      urgent: false,
      link: 'https://www.childline.org.uk/',
      info: 'Children and young people can call, email or chat online about any problem, any time.'
    },
    {
      id: 'shelter',
      category: 'housing',
      title: 'Shelter Emergency Helpline',
      description: 'Free emergency housing advice and support for people facing homelessness.',
      phone: '0808 800 4444',
      available: 'Mon-Fri 8am-8pm, Weekends 8am-5pm',
      icon: Home,
      color: 'indigo',
      urgent: false,
      link: 'https://england.shelter.org.uk/get_help',
      info: 'Expert housing advice. Webchat also available on their website during opening hours.'
    },
    {
      id: 'trussell-trust',
      category: 'food',
      title: 'Trussell Trust Food Bank Network',
      description: 'Find your nearest food bank for emergency food support.',
      available: 'Varies by location',
      icon: Utensils,
      color: 'green',
      urgent: false,
      link: 'https://www.trusselltrust.org/get-help/find-a-foodbank/',
      info: 'Use the postcode finder on their website to locate your nearest food bank and check opening times.'
    },
    {
      id: 'citizens-advice',
      category: 'general',
      title: 'Citizens Advice',
      description: 'Free, confidential advice on benefits, housing, debt, and legal issues.',
      phone: '0800 144 8848',
      available: 'Mon-Fri 9am-5pm',
      icon: Info,
      color: 'gray',
      urgent: false,
      link: 'https://www.citizensadvice.org.uk/',
      info: 'Free advice on money, legal, consumer and other problems. Welsh language line: 0800 702 2020.'
    },
    {
      id: 'crime-stoppers',
      category: 'safety',
      title: 'Crimestoppers',
      description: 'Report crime anonymously without giving your name.',
      phone: '0800 555 111',
      available: '24/7',
      icon: Shield,
      color: 'red',
      urgent: false,
      link: 'https://crimestoppers-uk.org/',
      info: 'Completely anonymous. You can also report online. For emergencies, always call 999.'
    },
    {
      id: 'substance-abuse',
      category: 'health',
      title: 'Frank - Drug Advice',
      description: 'Free, confidential drugs advice and information.',
      phone: '0300 123 6600',
      available: '24/7',
      icon: Heart,
      color: 'teal',
      urgent: false,
      link: 'https://www.talktofrank.com/',
      info: 'Text 82111 for advice. Confidential advice about drugs, their effects and the law.'
    },
    {
      id: 'age-uk',
      category: 'general',
      title: 'Age UK Advice Line',
      description: 'Free information and advice for older people.',
      phone: '0800 678 1602',
      available: 'Daily 8am-7pm',
      icon: Info,
      color: 'blue',
      urgent: false,
      link: 'https://www.ageuk.org.uk/',
      info: 'Support for older people on benefits, care, housing, and more.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Resources', icon: AlertTriangle },
    { id: 'immediate', label: 'Immediate Emergency', icon: AlertTriangle },
    { id: 'health', label: 'Health Crisis', icon: Heart },
    { id: 'mental-health', label: 'Mental Health', icon: Heart },
    { id: 'safety', label: 'Safety & Protection', icon: Shield },
    { id: 'housing', label: 'Housing & Shelter', icon: Home },
    { id: 'food', label: 'Food Support', icon: Utensils },
    { id: 'general', label: 'General Support', icon: Info }
  ];

  const filteredResources = selectedCategory === 'all' 
    ? emergencyResources 
    : emergencyResources.filter(r => r.category === selectedCategory);

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-800 border-red-200',
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      teal: 'bg-teal-100 text-teal-800 border-teal-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      pink: 'bg-pink-100 text-pink-800 border-pink-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[color] || colors.gray;
  };

  const getButtonColorClasses = (color) => {
    const colors = {
      red: 'bg-red-600 hover:bg-red-700 text-white',
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      teal: 'bg-teal-600 hover:bg-teal-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white',
      pink: 'bg-pink-600 hover:bg-pink-700 text-white',
      orange: 'bg-orange-600 hover:bg-orange-700 text-white',
      indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      green: 'bg-green-600 hover:bg-green-700 text-white',
      gray: 'bg-gray-600 hover:bg-gray-700 text-white'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-3">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <p className="font-semibold text-center">
              IN A LIFE-THREATENING EMERGENCY, ALWAYS CALL 999 IMMEDIATELY
            </p>
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Emergency Resources</h1>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Official UK emergency services and crisis support helplines available 24/7
            </p>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Important Information</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>All services listed below are official UK organizations and helplines</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Most helplines are free to call from UK landlines and mobiles</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>These resources are external to our platform - we redirect you to official services</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>If you're in immediate danger, call 999 right away</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Category:</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResources.map(resource => {
            const Icon = resource.icon;
            return (
              <div
                key={resource.id}
                className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden hover:shadow-md transition-shadow ${
                  resource.urgent ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                {/* Header */}
                <div className={`p-4 border-b ${getColorClasses(resource.color)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-white rounded-lg`}>
                        <Icon className={`w-6 h-6 text-${resource.color}-600`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{resource.title}</h3>
                        {resource.urgent && (
                          <span className="inline-flex items-center text-xs font-semibold text-red-600">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            URGENT
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-700 mb-4">{resource.description}</p>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-4">
                    {resource.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <a
                            href={`tel:${resource.phone.replace(/\s/g, '')}`}
                            className="font-semibold text-lg text-gray-900 hover:underline"
                          >
                            {resource.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {resource.email && (
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <a
                            href={`mailto:${resource.email}`}
                            className="font-semibold text-gray-900 hover:underline"
                          >
                            {resource.email}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Available</p>
                        <p className="font-semibold text-gray-900">{resource.available}</p>
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-700">{resource.info}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    {resource.phone && (
                      <a
                        href={`tel:${resource.phone.replace(/\s/g, '')}`}
                        className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${getButtonColorClasses(resource.color)}`}
                      >
                        <Phone className="w-5 h-5" />
                        <span>Call Now</span>
                      </a>
                    )}
                    
                    {resource.link && (
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>Visit Official Website</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Help */}
        <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
          <div className="text-center">
            <Info className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Need Non-Emergency Support?</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              For non-emergency community resources like food banks, housing support, healthcare services, and more, browse our main resource directory.
            </p>
            <Link
              to="/resource-search"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block text-center"
            >
              Browse All Resources
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h4 className="font-bold text-gray-900 mb-2">Disclaimer</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            This page provides links to official UK emergency services and crisis support organizations. We are not affiliated with these services. All contact information is sourced from official government and charity websites and is regularly updated. If you notice any incorrect information, please contact us. In a life-threatening emergency, always call 999.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResourcesPage;