import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mail, Phone, Globe, MapPin, Settings, User, Building, CheckCircle, X, Plus, AlertCircle, Save, Loader, ArrowLeft } from 'lucide-react';
import Button from '../../../components/ui/ui-components/Button';
import Input from '../../../components/ui/ui-components/Input';
import Textarea from '../../../components/ui/ui-components/Textarea';
import api from '../../../api/axios';
import { API_ENDPOINTS, FILE_UPLOAD } from '../../../utils/constants';

const ProfileSettings = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    const [user, setUser] = useState({
        id: '',
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        organizationName: '',
        role: '',
        type: '',
        verified: false,
        createdAt: '',
        profile: {
            phone: '',
            bio: '',
            avatar: '',
            description: '',
            website: '',
            address: '',
            logo: '',
            socialMedia: {
                linkedin: '',
                twitter: '',
                facebook: '',
                other: ''
            },
            yearsExperience: '',
            skills: [],
            languages: [],
            availability: ''
        }
    });

    const [newSkill, setNewSkill] = useState('');
    const [newLanguage, setNewLanguage] = useState('');

    // Fetch user profile from API
    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get(API_ENDPOINTS.USERS.ME);

            // Parse socialMedia if it's a string
            let socialMediaData = data.profile?.socialMedia;
            if (typeof socialMediaData === 'string') {
                try {
                    socialMediaData = JSON.parse(socialMediaData);
                } catch (e) {
                    console.error('Failed to parse socialMedia:', e);
                    socialMediaData = {};
                }
            }

            // Ensure profile object exists with defaults
            const profileData = {
                phone: data.profile?.phone || '',
                bio: data.profile?.bio || '',
                avatar: data.profile?.avatar || '',
                description: data.profile?.description || '',
                website: data.profile?.website || '',
                address: data.profile?.address || '',
                logo: data.profile?.logo || '',
                socialMedia: {
                    linkedin: socialMediaData?.linkedin || '',
                    twitter: socialMediaData?.twitter || '',
                    facebook: socialMediaData?.facebook || '',
                    other: socialMediaData?.other || ''
                },
                yearsExperience: data.profile?.yearsExperience || '',
                skills: data.profile?.skills || [],
                languages: data.profile?.languages || [],
                availability: data.profile?.availability || ''
            };

            setUser({
                ...data,
                profile: profileData
            });
        } catch (err) {
            console.error('Failed to fetch profile:', err);
            setError('Failed to load profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    // Save profile changes
    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccessMessage('');

        try {
            // Create a copy of the user object for the payload
            const payload = {
                ...user,
                profile: {
                    ...user.profile,
                    // Convert socialMedia object to JSON string if the backend expects a string
                    socialMedia: JSON.stringify(user.profile.socialMedia),
                    // Send arrays as is
                    skills: user.profile.skills,
                    languages: user.profile.languages
                }
            };

            console.log('Saving profile data (payload):', payload);
            await api.put(API_ENDPOINTS.USERS.ME, payload);

            setSuccessMessage('Profile updated successfully!');
            setHasChanges(false);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            console.error('Failed to update profile:', err);
            console.error('Error response:', err.response);
            console.error('Error data:', err.response?.data);
            setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field, value) => {
        setUser(prev => ({
            ...prev,
            [field]: value
        }));
        setHasChanges(true);
    };

    const handleProfileChange = (field, value) => {
        setUser(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                [field]: value
            }
        }));
        setHasChanges(true);
    };

    const handleSocialMediaChange = (platform, url) => {
        setUser(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                socialMedia: {
                    ...prev.profile.socialMedia,
                    [platform]: url
                }
            }
        }));
        setHasChanges(true);
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > FILE_UPLOAD.MAX_SIZE) {
            setError(`File size exceeds the limit of ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB`);
            return;
        }

        // Validate file type
        if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
            setError('Invalid file type. Please upload a valid image (JPG, PNG, GIF, WebP).');
            return;
        }

        setUploadingAvatar(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(API_ENDPOINTS.RESOURCES.UPLOADS, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle response format (string URL or object with url property)
            const avatarUrl = typeof response.data === 'string' ? response.data : response.data.url;

            if (avatarUrl) {
                handleProfileChange('avatar', avatarUrl);
                setSuccessMessage('Profile picture updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                throw new Error('No URL returned from server');
            }
        } catch (err) {
            console.error('Failed to upload avatar:', err);
            setError('Failed to upload profile picture. Please try again.');
        } finally {
            setUploadingAvatar(false);
            // Reset file input
            e.target.value = '';
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > FILE_UPLOAD.MAX_SIZE) {
            setError(`File size exceeds the limit of ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB`);
            return;
        }

        // Validate file type
        if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
            setError('Invalid file type. Please upload a valid image (JPG, PNG, GIF, WebP).');
            return;
        }

        setUploadingLogo(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(API_ENDPOINTS.RESOURCES.UPLOADS, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle response format (string URL or object with url property)
            const logoUrl = typeof response.data === 'string' ? response.data : response.data.url;

            if (logoUrl) {
                handleProfileChange('logo', logoUrl);
                setSuccessMessage('Organization logo updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                throw new Error('No URL returned from server');
            }
        } catch (err) {
            console.error('Failed to upload logo:', err);
            setError('Failed to upload organization logo. Please try again.');
        } finally {
            setUploadingLogo(false);
            // Reset file input
            e.target.value = '';
        }
    };

    const addSkill = () => {
        if (newSkill && newSkill.trim() && !user.profile.skills.includes(newSkill.trim())) {
            handleProfileChange('skills', [...user.profile.skills, newSkill.trim()]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove) => {
        handleProfileChange('skills', user.profile.skills.filter(skill => skill !== skillToRemove));
    };

    const addLanguage = () => {
        if (newLanguage && newLanguage.trim() && !user.profile.languages.includes(newLanguage.trim())) {
            handleProfileChange('languages', [...user.profile.languages, newLanguage.trim()]);
            setNewLanguage('');
        }
    };

    const removeLanguage = (languageToRemove) => {
        handleProfileChange('languages', user.profile.languages.filter(lang => lang !== languageToRemove));
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // Warn user about unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (hasChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasChanges]);

    // Dynamic Back Navigation
    const handleBack = () => {
        if (user.type === 'ORGANIZATION') {
            navigate('/provider-dashboard');
        } else if (user.role === 'MODERATOR') {
            navigate('/moderator-panel');
        } else if (user.role === 'ADMIN') {
            navigate('/admin-dashboard'); // Assuming this route exists
        } else {
            navigate('/user-dashboard');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (error && !user.id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-xl border border-red-200 p-6 max-w-md w-full">
                    <div className="flex items-center gap-3 text-red-600 mb-4">
                        <AlertCircle className="h-6 w-6" />
                        <h2 className="text-lg font-semibold">Error Loading Profile</h2>
                    </div>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={fetchUserProfile} className="w-full">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    const isOrganization = user.type === 'ORGANIZATION';

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <Settings className="h-6 w-6 text-blue-600" />
                                <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                            </div>
                            <p className="text-gray-600">Manage your personal and professional information</p>
                        </div>
                        {hasChanges && (
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                                <AlertCircle className="h-4 w-4" />
                                Unsaved changes
                            </div>
                        )}
                    </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <p className="text-green-800 text-sm">{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {/* Profile Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="relative">
                            {isOrganization ? (
                                // Organization Logo
                                <>
                                    <img
                                        src={user.profile.logo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.organizationName || 'Org') + '&size=120&background=10b981&color=fff'}
                                        alt="Organization Logo"
                                        className={`w-24 h-24 rounded-lg object-cover border-4 border-gray-100 shadow-sm ${uploadingLogo ? 'opacity-50' : ''}`}
                                    />
                                    {uploadingLogo && (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                                            <Loader className="h-8 w-8 animate-spin text-blue-600" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="logo-upload-header"
                                        className="hidden"
                                        accept={FILE_UPLOAD.ALLOWED_EXTENSIONS.join(',')}
                                        onChange={handleLogoUpload}
                                    />
                                    <button
                                        onClick={() => document.getElementById('logo-upload-header').click()}
                                        disabled={uploadingLogo}
                                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                        title="Upload Logo"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </button>
                                </>
                            ) : (
                                // User Avatar
                                <>
                                    <img
                                        src={user.profile.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.firstName + ' ' + user.lastName) + '&size=120&background=4f46e5&color=fff'}
                                        alt="Profile"
                                        className={`w-24 h-24 rounded-full object-cover border-4 border-gray-100 shadow-sm ${uploadingAvatar ? 'opacity-50' : ''}`}
                                    />
                                    {uploadingAvatar && (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-full">
                                            <Loader className="h-8 w-8 animate-spin text-blue-600" />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        className="hidden"
                                        accept={FILE_UPLOAD.ALLOWED_EXTENSIONS.join(',')}
                                        onChange={handleAvatarUpload}
                                    />
                                    <button
                                        onClick={() => document.getElementById('avatar-upload').click()}
                                        disabled={uploadingAvatar}
                                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                        title="Upload Photo"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-xl font-bold text-gray-900 truncate">
                                    {isOrganization ? user.organizationName : `${user.firstName} ${user.lastName}`}
                                </h2>
                                {user.verified && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 border border-green-200 rounded-full">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-xs font-medium text-green-700">Verified</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1.5">
                                    <Mail className="h-4 w-4" />
                                    {user.email}
                                </span>
                                {!isOrganization && (
                                    <span className="flex items-center gap-1.5">
                                        <User className="h-4 w-4" />
                                        @{user.username}
                                    </span>
                                )}
                                {/* For organization, we already show name as title, so no need to repeat here unless it's different context */}
                            </div>

                            <div className="mt-2">
                                <span className="inline-flex items-center px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
                                    {isOrganization ? 'Organization Account' : 'Individual Account'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            {isOrganization ? 'Organization Information' : 'Personal Information'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {!isOrganization && (
                                <>
                                    <Input
                                        label="First Name"
                                        value={user.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        placeholder="Enter your first name"
                                        required
                                    />
                                    <Input
                                        label="Last Name"
                                        value={user.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        placeholder="Enter your last name"
                                        required
                                    />
                                    <Input
                                        label="Username"
                                        value={user.username}
                                        onChange={(e) => handleInputChange('username', e.target.value)}
                                        placeholder="Enter your username"
                                        required
                                    />
                                </>
                            )}

                            <Input
                                label="Email"
                                value={user.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter your email"
                                type="email"
                                required
                            />

                            {isOrganization && (
                                <div className="sm:col-span-2">
                                    <Input
                                        label="Organization Name"
                                        value={user.organizationName}
                                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                                        placeholder="Enter organization name"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Phone className="h-5 w-5 text-blue-600" />
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Phone Number"
                                value={user.profile.phone}
                                onChange={(e) => handleProfileChange('phone', e.target.value)}
                                placeholder="+44 20 1234 5678"
                            />
                            <Input
                                label="Years of Experience"
                                value={user.profile.yearsExperience}
                                onChange={(e) => handleProfileChange('yearsExperience', e.target.value)}
                                placeholder="e.g., 5"
                                type="number"
                                min="0"
                            />
                            <div className="sm:col-span-2">
                                <Input
                                    label="Address"
                                    value={user.profile.address}
                                    onChange={(e) => handleProfileChange('address', e.target.value)}
                                    placeholder="Enter your address"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <Input
                                    label="Website"
                                    value={user.profile.website}
                                    onChange={(e) => handleProfileChange('website', e.target.value)}
                                    placeholder="https://yourwebsite.com"
                                    type="url"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Globe className="h-5 w-5 text-blue-600" />
                            Social Media
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="LinkedIn"
                                value={user.profile.socialMedia?.linkedin || ''}
                                onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                                placeholder="https://linkedin.com/in/yourprofile"
                            />
                            <Input
                                label="Twitter"
                                value={user.profile.socialMedia?.twitter || ''}
                                onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                                placeholder="https://twitter.com/yourhandle"
                            />
                            <Input
                                label="Facebook"
                                value={user.profile.socialMedia?.facebook || ''}
                                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                                placeholder="https://facebook.com/yourprofile"
                            />
                            <Input
                                label="Other"
                                value={user.profile.socialMedia?.other || ''}
                                onChange={(e) => handleSocialMediaChange('other', e.target.value)}
                                placeholder="Other social media URL"
                            />
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Building className="h-5 w-5 text-blue-600" />
                            Professional Information
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                <Textarea
                                    value={user.profile.bio}
                                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                                    placeholder="Write a brief bio about yourself..."
                                    rows={3}
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-500 mt-1">{user.profile.bio?.length || 0}/500 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <Textarea
                                    value={user.profile.description}
                                    onChange={(e) => handleProfileChange('description', e.target.value)}
                                    placeholder="Detailed description of your services or expertise..."
                                    rows={4}
                                    maxLength={1000}
                                />
                                <p className="text-xs text-gray-500 mt-1">{user.profile.description?.length || 0}/1000 characters</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                                <Textarea
                                    value={user.profile.availability}
                                    onChange={(e) => handleProfileChange('availability', e.target.value)}
                                    placeholder="e.g., 'Available Monday-Friday, 9AM-5PM'"
                                    rows={2}
                                />
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                                <div className="flex gap-2 mb-3">
                                    <Input
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Add a skill..."
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={addSkill}
                                        disabled={!newSkill.trim()}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {user.profile.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                                        >
                                            {skill}
                                            <button
                                                onClick={() => removeSkill(skill)}
                                                className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                    {user.profile.skills.length === 0 && (
                                        <span className="text-gray-400 text-sm italic">No skills added yet</span>
                                    )}
                                </div>
                            </div>

                            {/* Languages */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                                <div className="flex gap-2 mb-3">
                                    <Input
                                        value={newLanguage}
                                        onChange={(e) => setNewLanguage(e.target.value)}
                                        placeholder="Add a language..."
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={addLanguage}
                                        disabled={!newLanguage.trim()}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {user.profile.languages.map((language, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200"
                                        >
                                            {language}
                                            <button
                                                onClick={() => removeLanguage(language)}
                                                className="hover:bg-green-100 rounded-full p-0.5 transition-colors"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                    {user.profile.languages.length === 0 && (
                                        <span className="text-gray-400 text-sm italic">No languages added yet</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={saving || !hasChanges}
                            className="w-full sm:w-auto min-w-40"
                        >
                            {saving ? (
                                <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
