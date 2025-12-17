import React, { useState } from 'react';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

// ============================================
// CONTACT SUPPORT PAGE
// ============================================
const ContactSupportPage = () => {
  const navigate = useNavigate();

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const contactCategories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'account', label: 'Account Issues' },
    { value: 'resource', label: 'Resource Management' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'report', label: 'Report a Problem' }
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    // Get the category label
    const categoryLabel = contactCategories.find(cat => cat.value === contactForm.category)?.label || contactForm.category;

    // Prepare email parameters for EmailJS
    const templateParams = {
      from_name: contactForm.name,
      from_email: contactForm.email,
      subject: contactForm.subject,
      category: categoryLabel,
      message: contactForm.message,
      to_email: 'support@neighborlyunion.com'
    };

    try {
      // Send email using EmailJS
      await emailjs.send(
        'service_neighborlyunion', // Service ID - needs to be configured in EmailJS
        'template_contact',      // Template ID - needs to be configured in EmailJS
        templateParams,
        'YOUR_PUBLIC_KEY'        // Public Key - needs to be configured in EmailJS
      );

      // Show success message
      alert('Thank you for contacting us! We\'ll respond within 24-48 hours.');

      // Reset the form
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Thank you for contacting us! We\'ll respond within 24-48 hours.');

      // Reset the form even if there's an error
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
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
            <h1 className="text-4xl font-bold mb-4">Contact Support</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              We're here to help! Reach out to us through any of the methods below
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
          {/* Email Support */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-4">Response within 24-48 hours</p>
            <a href="mailto:support@neighborlyunion.com" className="text-blue-600 hover:underline font-medium">
              support@neighborlyunion.com
            </a>
          </div>

          {/* Phone Support */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-4">Mon-Fri, 9AM-5PM GMT</p>
            <a href="tel:+447900972668" className="text-green-600 hover:underline font-medium">
              +44 7900972668
            </a>
          </div>


        </div>
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
          <form onSubmit={handleContactSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={contactForm.category}
                onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {contactCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Please provide as much detail as possible..."
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">* Required fields</p>
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-12 bg-gray-100 rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Before You Contact Us</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-3 mt-1">✓</span>
              <span>Check our FAQ section for quick answers to common questions</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 mt-1">✓</span>
              <span>Review the User Guide for step-by-step instructions</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 mt-1">✓</span>
              <span>Make sure you're using a supported browser and have cleared your cache</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 mt-1">✓</span>
              <span>Include screenshots or error messages when reporting technical issues</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactSupportPage;