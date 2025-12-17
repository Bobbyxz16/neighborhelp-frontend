// src/pages/legal/PrivacyPolicy.jsx
import React, { useState } from 'react';
import { Shield, Database, Eye, Lock, Share2, UserCheck, Baby, Globe, Mail, FileText, Bell, Users } from 'lucide-react';

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState('overview');

    const sections = [
        { id: 'overview', title: 'Overview', icon: Shield },
        { id: 'collection', title: 'Data Collection', icon: Database },
        { id: 'usage', title: 'Data Usage', icon: Eye },
        { id: 'security', title: 'Data Security', icon: Lock },
        { id: 'sharing', title: 'Data Sharing', icon: Share2 },
        { id: 'rights', title: 'Your Rights', icon: UserCheck },
        { id: 'children', title: "Children's Privacy", icon: Baby },

    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <Shield className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                        <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
                            Protecting Your Personal Information and Privacy Rights
                        </p>
                        <p className="text-sm text-indigo-200 mt-4">
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
                                        ? 'bg-indigo-600 text-white'
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
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment to Your Privacy</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                At NeighborlyUnion, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                We respect your privacy rights and are dedicated to being transparent about our data practices. This policy complies with the UK General Data Protection Regulation (UK GDPR), Data Protection Act 2018, and other applicable privacy laws.
                            </p>
                        </div>

                        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-lg">
                            <div className="flex items-start space-x-3">
                                <Shield className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-indigo-900 mb-2">Data Protection Principles</h3>
                                    <p className="text-indigo-800 text-sm leading-relaxed">
                                        We process your personal data in accordance with data protection principles: lawfulness, fairness, transparency; purpose limitation; data minimisation; accuracy; storage limitation; integrity and confidentiality; and accountability.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg border p-6">
                                <Database className="w-8 h-8 text-indigo-600 mb-3" />
                                <h3 className="font-bold text-gray-900 mb-2">What We Collect</h3>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    <li>• Account information</li>
                                    <li>• Profile details</li>
                                    <li>• Resource listings</li>
                                    <li>• Usage data</li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-lg border p-6">
                                <Eye className="w-8 h-8 text-blue-600 mb-3" />
                                <h3 className="font-bold text-gray-900 mb-2">How We Use It</h3>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    <li>• Provide services</li>
                                    <li>• Improve platform</li>
                                    <li>• Communicate updates</li>
                                    <li>• Ensure security</li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-lg border p-6">
                                <Lock className="w-8 h-8 text-green-600 mb-3" />
                                <h3 className="font-bold text-gray-900 mb-2">Your Rights</h3>
                                <ul className="space-y-1 text-sm text-gray-700">
                                    <li>• Access your data</li>
                                    <li>• Request corrections</li>
                                    <li>• Delete your data</li>
                                    <li>• Object to processing</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Collection */}
                {activeSection === 'collection' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Information We Collect</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Information You Provide</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-bold text-blue-900 mb-2">Account Information</h4>
                                            <ul className="space-y-1 text-sm text-blue-800">
                                                <li>• Name and contact details</li>
                                                <li>• Email address and phone</li>
                                                <li>• Account credentials</li>
                                                <li>• Profile information</li>
                                            </ul>
                                        </div>
                                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                            <h4 className="font-bold text-purple-900 mb-2">Service Information</h4>
                                            <ul className="space-y-1 text-sm text-purple-800">
                                                <li>• Resource listings</li>
                                                <li>• Service descriptions</li>
                                                <li>• Availability details</li>
                                                <li>• Contact preferences</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Information Collected Automatically</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Database className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Usage Data</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Information about how you use our platform, including pages visited, features used, and time spent.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Globe className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Technical Data</h4>
                                                <p className="text-gray-700 text-sm">
                                                    IP address, browser type and version, device information, operating system, and unique device identifiers.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Users className="w-6 h-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Location Data</h4>
                                                <p className="text-gray-700 text-sm">
                                                    General location information (city/region level) to show relevant resources, with your consent.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookies and Tracking Technologies</h3>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <p className="text-gray-700 text-sm mb-3">
                                            We use cookies and similar tracking technologies to collect information about your browsing activities. For detailed information about the cookies we use and your choices regarding cookies, please see our Cookie Policy.
                                        </p>
                                        <div className="flex items-center space-x-2">
                                            <div className="bg-indigo-100 px-3 py-1 rounded-full">
                                                <span className="text-xs font-medium text-indigo-800">Essential Cookies</span>
                                            </div>
                                            <div className="bg-blue-100 px-3 py-1 rounded-full">
                                                <span className="text-xs font-medium text-blue-800">Functional Cookies</span>
                                            </div>
                                            <div className="bg-purple-100 px-3 py-1 rounded-full">
                                                <span className="text-xs font-medium text-purple-800">Analytics Cookies</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Usage */}
                {activeSection === 'usage' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>

                            <div className="space-y-6">
                                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                                    <h3 className="text-xl font-semibold text-blue-900 mb-3">Legal Basis for Processing</h3>
                                    <p className="text-blue-800 mb-4">
                                        We only process your personal data when we have a legal basis to do so, including: your consent, performance of a contract, compliance with legal obligations, protection of vital interests, performance of a task in the public interest, or our legitimate interests.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Purposes of Processing</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Users className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Service Provision</h4>
                                                <p className="text-gray-700 text-sm">
                                                    To create and manage your account, provide our services, process transactions, and communicate with you about your account.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Bell className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Communication</h4>
                                                <p className="text-gray-700 text-sm">
                                                    To send you service updates, notifications about resources in your area, and respond to your inquiries.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Eye className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Platform Improvement</h4>
                                                <p className="text-gray-700 text-sm">
                                                    To analyze usage patterns, improve our services, develop new features, and conduct research.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Shield className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Security and Compliance</h4>
                                                <p className="text-gray-700 text-sm">
                                                    To protect our platform, prevent fraud, comply with legal obligations, and enforce our terms and policies.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Legitimate Interests</h3>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <p className="text-gray-700 text-sm mb-3">
                                            Where we process your data based on legitimate interests, we consider and balance any potential impact on you and your rights. Our legitimate interests include:
                                        </p>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li>• Network and information security</li>
                                            <li>• Prevention of fraud and misuse of services</li>
                                            <li>• Direct marketing (you can opt out)</li>
                                            <li>• Reporting criminal acts or threats to public security</li>
                                            <li>• Improving our services through analytics</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Security */}
                {activeSection === 'security' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Security</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Measures</h3>
                                    <p className="text-gray-700 mb-4">
                                        We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <h4 className="font-bold text-green-900 mb-2">Technical Measures</h4>
                                            <ul className="space-y-1 text-sm text-green-800">
                                                <li>• End-to-end encryption for messages</li>
                                                <li>• SSL/TLS for data transmission</li>
                                                <li>• Regular security updates</li>
                                                <li>• Secure authentication methods</li>
                                            </ul>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <h4 className="font-bold text-blue-900 mb-2">Organizational Measures</h4>
                                            <ul className="space-y-1 text-sm text-blue-800">
                                                <li>• Staff training on data protection</li>
                                                <li>• Access controls and authentication</li>
                                                <li>• Regular security assessments</li>
                                                <li>• Incident response planning</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Retention</h3>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <p className="text-gray-700 text-sm mb-3">
                                            We retain your personal data only for as long as necessary to fulfil the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-700">Account data</span>
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">While account is active + 2 years</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-700">Usage data</span>
                                                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">3 years</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-700">Financial records</span>
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">7 years (legal requirement)</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium text-gray-700">Support communications</span>
                                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">5 years</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <div className="flex items-start space-x-3">
                                        <Lock className="w-8 h-8 text-red-600 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-bold text-red-900 mb-2">Your Responsibility</h3>
                                            <p className="text-red-800 text-sm">
                                                Where we have given you (or where you have chosen) a password for access to certain parts of our platform, you are responsible for keeping this password confidential. We ask you not to share your password with anyone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Sharing */}
                {activeSection === 'sharing' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Data Sharing and Disclosure</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">When We Share Your Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Users className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">With Other Users</h4>
                                                <p className="text-gray-700 text-sm">
                                                    When you create resource listings or send messages, certain information (your display name, resource details) may be visible to other users.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Share2 className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Service Providers</h4>
                                                <p className="text-gray-700 text-sm">
                                                    We share information with third-party vendors who provide services on our behalf, such as hosting, analytics, and customer support.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Globe className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Legal Requirements</h4>
                                                <p className="text-gray-700 text-sm">
                                                    We may disclose information if required by law, court order, or government request, or to protect our rights, property, or safety.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Third-Party Services</h3>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <p className="text-gray-700 text-sm mb-3">
                                            We use the following categories of third-party services that may process your data:
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Authentication</h4>
                                                <div className="space-y-1">
                                                    <div className="bg-white px-3 py-2 rounded border text-sm">Google OAuth</div>
                                                    <div className="bg-white px-3 py-2 rounded border text-sm">Facebook Login</div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Analytics</h4>
                                                <div className="space-y-1">
                                                    <div className="bg-white px-3 py-2 rounded border text-sm">Google Analytics</div>
                                                    <div className="bg-white px-3 py-2 rounded border text-sm">Plausible Analytics</div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-sm mt-4">
                                            All third-party service providers are required to maintain appropriate security measures and are prohibited from using your personal data for any purpose other than providing services to us.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                    <h4 className="font-bold text-yellow-900 mb-2">International Transfers</h4>
                                    <p className="text-yellow-800 text-sm">
                                        Some of our service providers are located outside the UK. We ensure that appropriate safeguards are in place, such as Standard Contractual Clauses approved by the UK government, to protect your data when transferred internationally.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Your Rights */}
                {activeSection === 'rights' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Data Protection Rights</h2>

                            <div className="space-y-6">
                                <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
                                    <h3 className="text-xl font-semibold text-green-900 mb-3">Your Legal Rights</h3>
                                    <p className="text-green-800 mb-4">
                                        Under data protection laws, you have rights in relation to your personal data. These rights are not absolute and may be subject to certain exceptions.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white border border-green-200 rounded-lg p-6">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                <Eye className="w-5 h-5 text-green-600" />
                                            </div>
                                            <h4 className="font-bold text-green-900">Right to Access</h4>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                            Request a copy of the personal data we hold about you (commonly known as a "data subject access request").
                                        </p>
                                    </div>

                                    <div className="bg-white border border-blue-200 rounded-lg p-6">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                <UserCheck className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <h4 className="font-bold text-blue-900">Right to Rectification</h4>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                            Request correction of inaccurate or incomplete personal data we hold about you.
                                        </p>
                                    </div>

                                    <div className="bg-white border border-red-200 rounded-lg p-6">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                                <Database className="w-5 h-5 text-red-600" />
                                            </div>
                                            <h4 className="font-bold text-red-900">Right to Erasure</h4>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                            Request deletion of your personal data (commonly known as the "right to be forgotten").
                                        </p>
                                    </div>

                                    <div className="bg-white border border-purple-200 rounded-lg p-6">
                                        <div className="flex items-center mb-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                                <Share2 className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <h4 className="font-bold text-purple-900">Right to Portability</h4>
                                        </div>
                                        <p className="text-sm text-gray-700">
                                            Request transfer of your personal data to you or a third party in a structured format.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Exercise Your Rights</h3>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <p className="text-gray-700 text-sm mb-3">
                                            To exercise any of these rights, please contact us using the details in the "Contact Us" section. We may need to verify your identity before processing your request.
                                        </p>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li>• There is usually no charge for exercising your rights</li>
                                            <li>• We have one month to respond to your request</li>
                                            <li>• We may refuse or charge for requests that are manifestly unfounded or excessive</li>
                                            <li>• You have the right to complain to the Information Commissioner's Office (ICO)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Children's Privacy */}
                {activeSection === 'children' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Children's Privacy</h2>

                            <div className="space-y-6">
                                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg">
                                    <div className="flex items-start space-x-3">
                                        <Baby className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-bold text-yellow-900 mb-2">Age Restrictions</h3>
                                            <p className="text-yellow-800 text-sm leading-relaxed">
                                                Our services are not directed to children under 18 years of age. We do not knowingly collect personal data from children under 18.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">If We Discover Child Data</h3>
                                    <p className="text-gray-700 mb-3">
                                        If we become aware that we have collected personal data from a child under 18 without verification of parental consent, we will take steps to remove that information from our servers.
                                    </p>
                                    <p className="text-gray-700">
                                        If you are a parent or guardian and believe your child has provided us with personal data, please contact us. We will delete such information from our files as soon as reasonably possible.
                                    </p>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Services for Young People</h3>
                                    <p className="text-blue-800 text-sm">
                                        While our platform is designed for adults, we recognize that some services may be relevant to young people (aged 13-17). In such cases:
                                    </p>
                                    <ul className="mt-2 space-y-1 text-sm text-blue-800">
                                        <li>• Parental consent is required for users under 18</li>
                                        <li>• Special safeguards apply to young people's data</li>
                                        <li>• Age verification measures are implemented where appropriate</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Legal & Contact */}
                {activeSection === 'legal' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Legal Information & Contact Details</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Changes to This Policy</h3>
                                    <p className="text-gray-700 mb-3">
                                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                                    </p>
                                    <p className="text-gray-700">
                                        For material changes, we will notify you through email or a prominent notice on our website prior to the change becoming effective.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Contact Information</h3>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-1">Data Protection Officer</h4>
                                                <p className="text-gray-700 text-sm">For data protection inquiries and requests:</p>
                                                <p className="text-gray-700 font-medium">privacy@neighborlyunion.com</p>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-1">Postal Address</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Data Protection Team<br />
                                                    NeighborlyUnion Ltd<br />
                                                    123 Community Street<br />
                                                    London, WC1N 3AX<br />
                                                    United Kingdom
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Regulatory Authority</h3>
                                    <p className="text-gray-700 mb-3">
                                        You have the right to make a complaint at any time to the Information Commissioner's Office (ICO), the UK supervisory authority for data protection issues.
                                    </p>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <h4 className="font-medium text-blue-900 mb-2">Information Commissioner's Office</h4>
                                        <p className="text-blue-800 text-sm">
                                            Website: <a href="https://www.ico.org.uk" className="underline">ico.org.uk</a><br />
                                            Helpline: 0303 123 1113<br />
                                            Address: Wycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary Box */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-indigo-600 p-8 mt-8">
                    <div className="flex items-start space-x-4 mb-6">
                        <FileText className="w-8 h-8 text-indigo-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Your Privacy Matters</h3>
                            <p className="text-gray-700">
                                By using our services, you acknowledge that:
                            </p>
                        </div>
                    </div>
                    <ul className="space-y-2 text-gray-700 ml-12">
                        <li>• You have read and understood this Privacy Policy</li>
                        <li>• You consent to our collection, use, and sharing of your information as described</li>
                        <li>• You understand your data protection rights and how to exercise them</li>
                        <li>• You can withdraw your consent at any time (where processing is based on consent)</li>
                        <li>• You will be notified of significant changes to this policy</li>
                    </ul>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-sm text-gray-600">
                    <p>Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="mt-2">Version 2.0</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;