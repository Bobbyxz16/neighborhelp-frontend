import React, { useState } from 'react';
import { FileText, AlertCircle, CheckCircle, Shield, Scale, Users, Clock } from 'lucide-react';

const TermsAndConditionsPage = () => {
    const [activeSection, setActiveSection] = useState('overview');

    const sections = [
        { id: 'overview', title: 'Overview', icon: FileText },
        { id: 'eligibility', title: 'Eligibility', icon: Users },
        { id: 'content', title: 'Content Guidelines', icon: CheckCircle },
        { id: 'responsibilities', title: 'Your Responsibilities', icon: Shield },
        { id: 'prohibited', title: 'Prohibited Content', icon: AlertCircle },
        { id: 'moderation', title: 'Moderation & Review', icon: Clock },
        { id: 'legal', title: 'Legal Terms', icon: Scale }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Resource Creation Guidelines and Agreement
                        </p>
                        <p className="text-sm text-blue-200 mt-4">
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
                                        ? 'bg-blue-600 text-white'
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
                                Thank you for choosing to share resources with our community. By creating a resource listing on NeighborlyUnion, you agree to comply with these Terms and Conditions. These terms help ensure that our platform remains a safe, accurate, and helpful space for everyone seeking community support.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Please read these terms carefully before submitting any resource. By clicking "Create Resource" or "Submit for Review," you acknowledge that you have read, understood, and agree to be bound by these terms.
                            </p>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-bold text-blue-900 mb-2">Important Notice</h3>
                                    <p className="text-blue-800 text-sm leading-relaxed">
                                        All resource submissions are subject to review and approval by our moderation team. We reserve the right to reject, remove, or request modifications to any listing that does not comply with these terms or our community standards.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg border p-6">
                                <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
                                <h3 className="font-bold text-gray-900 mb-2">What We Expect</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>• Accurate and honest information</li>
                                    <li>• Current and up-to-date details</li>
                                    <li>• Respectful and inclusive content</li>
                                    <li>• Compliance with UK laws</li>
                                </ul>
                            </div>

                            <div className="bg-white rounded-lg border p-6">
                                <Shield className="w-8 h-8 text-blue-600 mb-3" />
                                <h3 className="font-bold text-gray-900 mb-2">What We Provide</h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>• Free platform access</li>
                                    <li>• Community visibility</li>
                                    <li>• Moderation and safety</li>
                                    <li>• Technical support</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Eligibility */}
                {activeSection === 'eligibility' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Eligibility Requirements</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Who Can Create Resources</h3>
                                    <p className="text-gray-700 mb-4">You are eligible to create resource listings if you:</p>
                                    <ul className="space-y-3">
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">Are at least 18 years of age or have parental/guardian consent</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">Have created a verified account on our platform</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">Are an authorized representative of the organization or service being listed</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">Have the legal right and authority to offer the services described</span>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                                            <span className="text-gray-700">Agree to comply with all applicable UK laws and regulations</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                    <h4 className="font-bold text-yellow-900 mb-2">Organizations and Charities</h4>
                                    <p className="text-yellow-800 text-sm">
                                        If you are creating resources on behalf of an organization, charity, or business, you must have explicit authorization from that entity. You may be required to provide verification documentation.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Responsibilities</h3>
                                    <p className="text-gray-700 mb-3">By creating an account and submitting resources, you agree to:</p>
                                    <ul className="space-y-2 text-gray-700 list-disc list-inside">
                                        <li>Provide accurate and truthful registration information</li>
                                        <li>Maintain the security of your account credentials</li>
                                        <li>Accept responsibility for all activities under your account</li>
                                        <li>Notify us immediately of any unauthorized account access</li>
                                        <li>Not share your account with others or create multiple accounts</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Guidelines */}
                {activeSection === 'content' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Content Guidelines</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Accuracy and Truthfulness</h3>
                                    <p className="text-gray-700 mb-4">All information provided must be:</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-green-900 mb-2">✓ Required</h4>
                                            <ul className="space-y-1 text-sm text-green-800">
                                                <li>• Accurate and current</li>
                                                <li>• Verifiable and factual</li>
                                                <li>• Complete and comprehensive</li>
                                                <li>• Updated regularly</li>
                                            </ul>
                                        </div>
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-red-900 mb-2">✗ Prohibited</h4>
                                            <ul className="space-y-1 text-sm text-red-800">
                                                <li>• False or misleading claims</li>
                                                <li>• Exaggerated descriptions</li>
                                                <li>• Outdated information</li>
                                                <li>• Unverified promises</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Required Information</h3>
                                    <p className="text-gray-700 mb-3">Every resource listing must include:</p>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-800">Clear and descriptive title</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-800">Detailed description of services offered</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-800">Accurate location/address information</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-800">Current contact information (phone/email)</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-800">Operating hours and availability</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-800">Eligibility requirements (if applicable)</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5 text-blue-600" />
                                            <span className="text-gray-800">Clear cost information (free, low-cost, etc.)</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Images and Media</h3>
                                    <div className="space-y-3 text-gray-700">
                                        <p><strong>You may upload images that:</strong></p>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>You own or have permission to use</li>
                                            <li>Accurately represent your service or facility</li>
                                            <li>Are clear, professional, and appropriate</li>
                                            <li>Respect the privacy of individuals (obtain consent for photos of people)</li>
                                        </ul>
                                        <p className="mt-3"><strong>Do not upload images containing:</strong></p>
                                        <ul className="list-disc list-inside space-y-1 ml-4">
                                            <li>Copyrighted material without permission</li>
                                            <li>Inappropriate, offensive, or explicit content</li>
                                            <li>Misleading or unrelated images</li>
                                            <li>Personal information of individuals without consent</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Responsibilities */}
                {activeSection === 'responsibilities' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Responsibilities</h2>

                            <div className="space-y-6">
                                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                                    <h3 className="text-xl font-semibold text-blue-900 mb-3">As a Resource Provider</h3>
                                    <p className="text-blue-800 mb-4">
                                        By creating a resource listing, you assume full responsibility for the accuracy, legality, and quality of the information and services you provide.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Ongoing Obligations</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Clock className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Keep Information Current</h4>
                                                <p className="text-gray-700 text-sm">
                                                    You must update your resource listing promptly when any information changes, including hours, location, services offered, or contact details.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Users className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Respond to Inquiries</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Make reasonable efforts to respond to messages and inquiries from community members in a timely and professional manner.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <Shield className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Maintain Service Standards</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Deliver services as described in your listing and maintain professional standards in all interactions with community members.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <AlertCircle className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-1">Report Issues</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Immediately notify us if you need to temporarily suspend services or if there are significant changes to your resource availability.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Compliance</h3>
                                    <p className="text-gray-700 mb-3">You are solely responsible for ensuring that:</p>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span>Your services comply with all applicable UK laws and regulations</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span>You have all necessary licenses, permits, and insurance</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span>You comply with data protection laws (GDPR) when handling personal information</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span>Your listing does not infringe on any third-party intellectual property rights</span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="text-blue-600 mt-1">•</span>
                                            <span>You maintain appropriate safeguarding measures if working with vulnerable populations</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Prohibited Content */}
                {activeSection === 'prohibited' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Prohibited Content and Activities</h2>

                            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 mb-6">
                                <div className="flex items-start space-x-3">
                                    <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-red-900 mb-2">Strictly Forbidden</h3>
                                        <p className="text-red-800 text-sm">
                                            The following types of content and activities are strictly prohibited and will result in immediate removal of your listing and potential account suspension.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Illegal or Harmful Content</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-red-900 mb-2">✗ Never Allowed</h4>
                                            <ul className="space-y-1 text-sm text-red-800">
                                                <li>• Illegal goods or services</li>
                                                <li>• Weapons or dangerous items</li>
                                                <li>• Drugs or controlled substances</li>
                                                <li>• Adult or explicit content</li>
                                                <li>• Gambling services</li>
                                                <li>• Pyramid schemes or scams</li>
                                            </ul>
                                        </div>
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-red-900 mb-2">✗ Harmful Content</h4>
                                            <ul className="space-y-1 text-sm text-red-800">
                                                <li>• Hate speech or discrimination</li>
                                                <li>• Harassment or bullying</li>
                                                <li>• Violence or threats</li>
                                                <li>• False medical claims</li>
                                                <li>• Misleading information</li>
                                                <li>• Spam or irrelevant content</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Misuse of Platform</h3>
                                    <p className="text-gray-700 mb-3">You may not use our platform to:</p>
                                    <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                                        <li>Impersonate another person or organization</li>
                                        <li>Create duplicate or spam listings</li>
                                        <li>Collect user data for unauthorized purposes</li>
                                        <li>Engage in fraudulent or deceptive practices</li>
                                        <li>Advertise unrelated products or services</li>
                                        <li>Post links to malicious or inappropriate websites</li>
                                        <li>Manipulate ratings or reviews</li>
                                        <li>Interfere with platform functionality</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Discriminatory Practices</h3>
                                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
                                        <p className="text-yellow-900 mb-3">
                                            Your resource listings and services must not discriminate against individuals based on:
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-yellow-800">
                                            <div>• Race or ethnicity</div>
                                            <div>• Religion or belief</div>
                                            <div>• Gender or gender identity</div>
                                            <div>• Sexual orientation</div>
                                            <div>• Age</div>
                                            <div>• Disability</div>
                                            <div>• Nationality</div>
                                            <div>• Marital status</div>
                                        </div>
                                        <p className="text-yellow-900 mt-3 text-sm">
                                            Services may have legitimate eligibility criteria (e.g., age-specific programs, women's shelters), but these must be clearly stated and legally justified.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Moderation */}
                {activeSection === 'moderation' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Moderation and Review Process</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Process</h3>
                                    <p className="text-gray-700 mb-4">
                                        All new resource submissions undergo a review process to ensure they meet our community standards and terms of service.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                                                1
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">Submission</h4>
                                                <p className="text-gray-700 text-sm">
                                                    You submit your resource listing with all required information. Status: <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">PENDING</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-orange-600">
                                                2
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">Review</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Our moderation team reviews your submission within 24-48 hours to verify accuracy and compliance.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-green-600">
                                                3
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">Approval</h4>
                                                <p className="text-gray-700 text-sm">
                                                    If approved, your resource goes live. Status: <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">ACTIVE</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-red-600">
                                                ✗
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">Rejection</h4>
                                                <p className="text-gray-700 text-sm">
                                                    If rejected, you'll receive feedback and can resubmit after addressing issues. Status: <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">REJECTED</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">What We Review</h3>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <ul className="space-y-3">
                                            <li className="flex items-start space-x-3">
                                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <strong className="text-gray-900">Accuracy:</strong>
                                                    <span className="text-gray-700"> Information appears truthful and verifiable</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <strong className="text-gray-900">Completeness:</strong>
                                                    <span className="text-gray-700"> All required fields are filled with adequate detail</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <strong className="text-gray-900">Appropriateness:</strong>
                                                    <span className="text-gray-700"> Content is suitable for our community</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <strong className="text-gray-900">Compliance:</strong>
                                                    <span className="text-gray-700"> Listing meets all terms and guidelines</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Moderation */}
                {activeSection === 'moderation' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Moderation and Review Process</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Process</h3>
                                    <p className="text-gray-700 mb-4">
                                        All new resource submissions undergo a review process to ensure they meet our community standards and terms of service.
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                                                1
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">Submission</h4>
                                                <p className="text-gray-700 text-sm">
                                                    You submit your resource listing with all required information. Status: <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">PENDING</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-orange-600">
                                                2
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">Review</h4>
                                                <p className="text-gray-700 text-sm">
                                                    Our moderation team reviews your submission within 24-48 hours to verify accuracy and compliance.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-green-600">
                                                3
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">Approval</h4>
                                                <p className="text-gray-700 text-sm">
                                                    If approved, your resource goes live. Status: <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">ACTIVE</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4">
                                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-red-600">
                                                ✗
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900 mb-1">Rejection</h4>
                                                <p className="text-gray-700 text-sm">
                                                    If rejected, you'll receive feedback and can resubmit after addressing issues. Status: <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">REJECTED</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">What We Review</h3>
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <ul className="space-y-3">
                                            <li className="flex items-start space-x-3">
                                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <strong className="text-gray-900">Accuracy:</strong>
                                                    <span className="text-gray-700"> Information appears truthful and verifiable</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <strong className="text-gray-900">Completeness:</strong>
                                                    <span className="text-gray-700"> All required fields are filled with adequate detail</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <strong className="text-gray-900">Appropriateness:</strong>
                                                    <span className="text-gray-700"> Content is suitable for our community</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <strong className="text-gray-900">Relevance:</strong>
                                                    <span className="text-gray-700"> Resource fits our platform's purpose</span>
                                                </div>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                                                <div>
                                                    <strong className="text-gray-900">Compliance:</strong>
                                                    <span className="text-gray-700"> Adheres to all terms and policies</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Ongoing Monitoring</h3>
                                    <p className="text-gray-700 mb-3">
                                        We reserve the right to review, edit, or remove any resource at any time if:
                                    </p>
                                    <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                                        <li>We receive reports or complaints about the listing</li>
                                        <li>Information becomes outdated or inaccurate</li>
                                        <li>The resource violates our terms or community standards</li>
                                        <li>Required to do so by law or legal process</li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <h4 className="font-semibold text-blue-900 mb-2">Appeals Process</h4>
                                    <p className="text-blue-800 text-sm">
                                        If your resource is rejected or removed, you may contact our support team to understand the reason and request reconsideration. Include your resource ID and a detailed explanation of any corrections made.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Legal */}
                {activeSection === 'legal' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border p-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Legal Terms</h2>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Platform Role and Liability</h3>
                                    <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-r-lg mb-4">
                                        <p className="text-gray-800 leading-relaxed">
                                            <strong>Important:</strong> NeighborlyUnion is a platform that facilitates connections between service providers and community members. We do not provide, endorse, or guarantee the services listed. We are not responsible for the quality, safety, or legality of services offered through our platform.
                                        </p>
                                    </div>
                                    <p className="text-gray-700 mb-3">
                                        As a resource provider, you acknowledge and agree that:
                                    </p>
                                    <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                                        <li>You are solely responsible for your services and all related interactions</li>
                                        <li>NeighborlyUnion is not a party to any agreement between you and service users</li>
                                        <li>We do not verify, endorse, or guarantee any listings</li>
                                        <li>We are not liable for disputes, damages, or issues arising from your services</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Indemnification</h3>
                                    <p className="text-gray-700 mb-3">
                                        You agree to indemnify and hold harmless NeighborlyUnion, its affiliates, officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
                                    </p>
                                    <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                                        <li>Your violation of these terms</li>
                                        <li>Your resource listings or services</li>
                                        <li>Your violation of any law or third-party rights</li>
                                        <li>Any disputes with service users</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Intellectual Property</h3>
                                    <p className="text-gray-700 mb-4">
                                        By submitting content to our platform, you grant us a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your content for the purposes of operating and promoting the platform.
                                    </p>
                                    <p className="text-gray-700">
                                        You retain all ownership rights to your content and can remove it at any time. You represent that you have the right to grant this license and that your content does not infringe on any third-party rights.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Protection and Privacy</h3>
                                    <p className="text-gray-700 mb-3">
                                        We process your personal data in accordance with our Privacy Policy and applicable data protection laws, including the UK GDPR. By creating resources, you agree to:
                                    </p>
                                    <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                                        <li>Comply with data protection laws when handling user information</li>
                                        <li>Use user data only for legitimate service provision purposes</li>
                                        <li>Maintain appropriate security measures for personal data</li>
                                        <li>Respond to data subject requests (access, deletion, etc.) appropriately</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Termination and Suspension</h3>
                                    <p className="text-gray-700 mb-3">
                                        We reserve the right to suspend or terminate your account and remove your listings at any time, with or without notice, if:
                                    </p>
                                    <ul className="space-y-2 text-gray-700 list-disc list-inside ml-4">
                                        <li>You violate these terms or our policies</li>
                                        <li>We receive multiple complaints about your services</li>
                                        <li>We suspect fraudulent or harmful activity</li>
                                        <li>Required by law or legal process</li>
                                        <li>Your account has been inactive for an extended period</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Changes to Terms</h3>
                                    <p className="text-gray-700">
                                        We may update these terms from time to time. We will notify you of significant changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the updated terms.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Governing Law</h3>
                                    <p className="text-gray-700">
                                        These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.
                                    </p>
                                </div>

                                <div className="bg-gray-50 border-l-4 border-gray-600 p-6 rounded-r-lg">
                                    <h4 className="font-semibold text-gray-900 mb-2">Severability</h4>
                                    <p className="text-gray-700 text-sm">
                                        If any provision of these terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these terms will otherwise remain in full force and effect.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Agreement Box */}
                <div className="bg-white rounded-lg shadow-lg border-2 border-blue-600 p-8 mt-8">
                    <div className="flex items-start space-x-4 mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Acceptance of Terms</h3>
                            <p className="text-gray-700">
                                By clicking "I Agree" or "Create Resource" during the resource creation process, you acknowledge that:
                            </p>
                        </div>
                    </div>
                    <ul className="space-y-2 text-gray-700 ml-12">
                        <li>• You have read and understood these Terms and Conditions</li>
                        <li>• You agree to be bound by all terms outlined above</li>
                        <li>• You meet all eligibility requirements</li>
                        <li>• You will comply with all obligations and responsibilities</li>
                        <li>• You accept the limitations of liability described</li>
                        <li>• The information you provide is accurate and truthful</li>
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

export default TermsAndConditionsPage;
