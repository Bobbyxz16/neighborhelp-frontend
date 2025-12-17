// src/pages/legal/CookiePolicy.jsx
import React, { useState } from 'react';
import { Cookie, Shield, Settings, BarChart, EyeOff, FileText } from 'lucide-react';

const CookiePolicy = () => {
    const [activeSection, setActiveSection] = useState('overview');

    const sections = [
        { id: 'overview', title: 'Overview', icon: Cookie },
        { id: 'types', title: 'Cookie Types', icon: Settings },
        { id: 'essential', title: 'Essential Cookies', icon: Shield },
        { id: 'analytics', title: 'Analytics Cookies', icon: BarChart },
        { id: 'functional', title: 'Functional Cookies', icon: Settings },
        { id: 'manage', title: 'Manage Cookies', icon: EyeOff },
        { id: 'legal', title: 'Legal Information', icon: FileText }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <Cookie className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
                        <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
                            Understanding How We Use Cookies to Improve Your Experience
                        </p>
                        <p className="text-sm text-emerald-200 mt-4">
                            Last Updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto space-x-1 py-3">
                        {sections.map(section => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${activeSection === section.id
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{section.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Overview */}
                {activeSection === 'overview' && (
                    <div className="space-y-8">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                This Cookie Policy explains how NeighborlyUnion uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                By using our website, you consent to the use of cookies as described in this policy. You can change your cookie settings at any time through your browser settings or our cookie preference center.
                            </p>
                        </div>

                        <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-lg">
                            <div className="flex items-start space-x-3">
                                <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-emerald-900 mb-2">Your Privacy Matters</h3>
                                    <p className="text-emerald-800 text-sm leading-relaxed">
                                        We are committed to protecting your privacy. Our use of cookies is designed to enhance your experience while respecting your privacy choices. You have full control over which cookies you accept.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg border p-6">
                                <Cookie className="w-8 h-8 text-emerald-600 mb-3" />
                                <h3 className="font-bold text-gray-900 mb-2">What Are Cookies?</h3>
                                <p className="text-sm text-gray-700">
                                    Cookies are small text files that are stored on your device when you visit a website. They help the website remember information about your visit, which can make it easier to visit the site again and make the site more useful to you.
                                </p>
                            </div>

                            <div className="bg-white rounded-lg border p-6">
                                <Settings className="w-8 h-8 text-blue-600 mb-3" />
                                <h3 className="font-bold text-gray-900 mb-2">Why We Use Them</h3>
                                <p className="text-sm text-gray-700">
                                    Cookies help us provide you with a better experience by allowing us to understand how you use our site, remember your preferences, and improve our services based on anonymous usage data.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cookie Types */}
                {activeSection === 'types' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of Cookies We Use</h2>

                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Cookie Categories</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white border border-emerald-200 rounded-lg p-4">
                                            <div className="flex items-center mb-3">
                                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                                                    <Shield className="w-4 h-4 text-emerald-600" />
                                                </div>
                                                <h4 className="font-bold text-emerald-900">Essential</h4>
                                            </div>
                                            <p className="text-sm text-gray-700">
                                                Required for the website to function. Cannot be switched off.
                                            </p>
                                        </div>

                                        <div className="bg-white border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-center mb-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                    <Settings className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <h4 className="font-bold text-blue-900">Functional</h4>
                                            </div>
                                            <p className="text-sm text-gray-700">
                                                Remember your preferences and settings for a better experience.
                                            </p>
                                        </div>

                                        <div className="bg-white border border-purple-200 rounded-lg p-4">
                                            <div className="flex items-center mb-3">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                                    <BarChart className="w-4 h-4 text-purple-600" />
                                                </div>
                                                <h4 className="font-bold text-purple-900">Analytics</h4>
                                            </div>
                                            <p className="text-sm text-gray-700">
                                                Help us understand how visitors use our website to improve it.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookie Duration</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Session Cookies</h4>
                                                <p className="text-sm text-gray-600">Deleted when you close your browser</p>
                                            </div>
                                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                                                Temporary
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                                            <div>
                                                <h4 className="font-medium text-gray-900">Persistent Cookies</h4>
                                                <p className="text-sm text-gray-600">Remain on your device for a set period</p>
                                            </div>
                                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                                                Up to 12 months
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                    <h4 className="font-bold text-yellow-900 mb-2">Third-Party Cookies</h4>
                                    <p className="text-yellow-800 text-sm">
                                        Some cookies are placed by third-party services that appear on our pages. These are subject to the respective privacy policies of these third parties. We carefully select our partners to ensure they respect your privacy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Essential Cookies */}
                {activeSection === 'essential' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Essential Cookies</h2>

                            <div className="space-y-6">
                                <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-lg">
                                    <h3 className="text-xl font-semibold text-emerald-900 mb-3">Required for Functionality</h3>
                                    <p className="text-emerald-800 mb-4">
                                        These cookies are strictly necessary for the website to function properly. They enable basic features like page navigation and access to secure areas of the website.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What They Do</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Shield className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Authentication</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Keep you logged in during your session and protect your account from unauthorized access.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Cookie className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Session Management</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Maintain your session and remember your progress as you navigate through the website.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Settings className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Security</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Protect against cross-site request forgery (CSRF) and other security threats.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Cannot Be Disabled</h3>
                                    <p className="text-gray-700 text-sm">
                                        Essential cookies cannot be disabled as they are required for the website to function. If you block these cookies, some parts of the site will not work properly.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Examples of Essential Cookies</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cookie Name</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                <tr>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">session_id</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">Maintain user session</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">Session</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">csrf_token</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">Security protection</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">Session</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">auth_token</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">User authentication</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">24 hours</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Cookies */}
                {activeSection === 'analytics' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Analytics Cookies</h2>

                            <div className="space-y-6">
                                <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg">
                                    <h3 className="text-xl font-semibold text-purple-900 mb-3">Help Us Improve</h3>
                                    <p className="text-purple-800 mb-4">
                                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What We Track</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-white border border-purple-200 rounded-lg p-4">
                                            <h4 className="font-bold text-purple-900 mb-2">✓ Anonymized Data</h4>
                                            <ul className="space-y-1 text-sm text-purple-800">
                                                <li>• Page visit counts</li>
                                                <li>• Time spent on pages</li>
                                                <li>• Navigation paths</li>
                                                <li>• Geographic location (country)</li>
                                            </ul>
                                        </div>
                                        <div className="bg-white border border-red-200 rounded-lg p-4">
                                            <h4 className="font-bold text-red-900 mb-2">✗ We Never Track</h4>
                                            <ul className="space-y-1 text-sm text-red-800">
                                                <li>• Personal information</li>
                                                <li>• Individual browsing history</li>
                                                <li>• Sensitive data</li>
                                                <li>• Identifiable user behavior</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">How Analytics Help</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <BarChart className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">Identify which pages are most popular</span>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <BarChart className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">Understand user navigation patterns</span>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <BarChart className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">Identify and fix technical issues</span>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <BarChart className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">Improve website performance and speed</span>
                                        </div>
                                        <div className="flex items-start space-x-3">
                                            <BarChart className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">Make informed decisions about new features</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Analytics Partners</h3>
                                    <p className="text-gray-700 text-sm mb-3">
                                        We use trusted analytics providers that comply with privacy regulations. All data is anonymized and aggregated before analysis.
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-white px-4 py-2 rounded-lg border">
                                            <span className="text-sm font-medium text-gray-700">Google Analytics</span>
                                        </div>
                                        <div className="bg-white px-4 py-2 rounded-lg border">
                                            <span className="text-sm font-medium text-gray-700">Plausible Analytics</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Functional Cookies */}
                {activeSection === 'functional' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Functional Cookies</h2>

                            <div className="space-y-6">
                                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                                    <h3 className="text-xl font-semibold text-blue-900 mb-3">Enhance Your Experience</h3>
                                    <p className="text-blue-800 mb-4">
                                        These cookies allow the website to remember choices you make and provide enhanced, more personal features.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Remember Your Preferences</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Settings className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Language Settings</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Remember your preferred language so you don't have to select it every time.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Cookie className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Display Preferences</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Remember your display settings like font size, theme, or layout preferences.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Settings className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Form Data</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Remember information you've entered in forms so you don't have to re-enter it.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Settings className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Regional Settings</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Remember your region or location for localized content and services.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                    <h4 className="font-bold text-yellow-900 mb-2">Optional Cookies</h4>
                                    <p className="text-yellow-800 text-sm">
                                        Functional cookies are optional and you can choose to accept or decline them. Declining these cookies may result in some features not functioning properly, but you will still be able to use the basic features of the website.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manage Cookies */}
                {activeSection === 'manage' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Managing Your Cookie Preferences</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Control Cookies</h3>

                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-gray-600">
                                                1
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">Browser Settings</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Most web browsers allow you to control cookies through their settings preferences. You can usually find these settings in the "Options" or "Preferences" menu of your browser.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-gray-600">
                                                2
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">Cookie Preference Center</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Use our cookie preference center (available in the website footer) to selectively enable or disable different types of cookies.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-gray-600">
                                                3
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">Third-Party Tools</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Consider using browser extensions or privacy tools that give you more control over cookies and tracking.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Browser-Specific Instructions</h3>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Google Chrome</h4>
                                                <p className="text-sm text-gray-700">
                                                    Settings → Privacy and Security → Cookies and other site data
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Mozilla Firefox</h4>
                                                <p className="text-sm text-gray-700">
                                                    Options → Privacy & Security → Cookies and Site Data
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Safari</h4>
                                                <p className="text-sm text-gray-700">
                                                    Preferences → Privacy → Cookies and website data
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Microsoft Edge</h4>
                                                <p className="text-sm text-gray-700">
                                                    Settings → Cookies and site permissions → Cookies and site data
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <div className="flex items-start space-x-3">
                                        <EyeOff className="w-8 h-8 text-red-600 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-bold text-red-900 mb-2">Important Notice</h3>
                                            <p className="text-red-800 text-sm">
                                                If you choose to disable cookies, some features of our website may not function properly. Essential cookies cannot be disabled as they are required for the basic functionality of the website.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Clear Existing Cookies</h3>
                                    <p className="text-gray-700 mb-3">
                                        You can delete cookies that are already on your device. Please refer to your browser's help documentation for instructions on how to clear cookies.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Legal Information */}
                {activeSection === 'legal' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Legal Information</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Compliance with Regulations</h3>
                                    <p className="text-gray-700 mb-4">
                                        Our use of cookies complies with applicable privacy laws and regulations, including:
                                    </p>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span>UK General Data Protection Regulation (UK GDPR)</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span>Data Protection Act 2018</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span>Privacy and Electronic Communications Regulations (PECR)</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span>EU ePrivacy Directive (for EU visitors)</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Consent Requirements</h3>
                                    <p className="text-gray-700 mb-3">
                                        According to current regulations, we are required to:
                                    </p>
                                    <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                                        <li>Obtain your consent for non-essential cookies</li>
                                        <li>Provide clear information about our use of cookies</li>
                                        <li>Allow you to easily manage your cookie preferences</li>
                                        <li>Document your consent choices</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Protection</h3>
                                    <p className="text-gray-700 mb-4">
                                        We are committed to protecting your personal data. For more information about how we handle your personal information, please review our Privacy Policy.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Changes to This Policy</h3>
                                    <p className="text-gray-700 mb-3">
                                        We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
                                    </p>
                                    <p className="text-gray-700">
                                        When we make changes, we will update the "Last Updated" date at the top of this page. For significant changes, we may provide additional notice such as a statement on our website or direct notification.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <p className="text-gray-700 mb-2">If you have questions about our use of cookies or this Cookie Policy, please contact us:</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <span className="font-medium text-gray-900 w-32">Email:</span>
                                                <span className="text-gray-700">privacy@neighborlyunion.com</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="font-medium text-gray-900 w-32">Post:</span>
                                                <span className="text-gray-700">Privacy Team, NeighborlyUnion Ltd, London, UK</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary Box */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-600 p-8 mt-8">
                    <div className="flex items-start space-x-4 mb-6">
                        <Shield className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Your Cookie Choices</h3>
                            <p className="text-gray-700">
                                By continuing to use our website, you acknowledge that:
                            </p>
                        </div>
                    </div>
                    <ul className="space-y-2 text-gray-700 ml-12">
                        <li>• You have read and understood this Cookie Policy</li>
                        <li>• Essential cookies are required for website functionality</li>
                        <li>• You can manage non-essential cookies through our preference center</li>
                        <li>• Your privacy choices will be respected</li>
                        <li>• You can change your cookie preferences at any time</li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-sm text-gray-600">
                    <p>Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="mt-2">Version 1.0</p>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;