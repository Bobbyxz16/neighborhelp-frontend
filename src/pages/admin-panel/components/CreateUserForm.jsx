import React, { useState } from 'react';
import Button from '../../../components/ui/ui-components/Button';
import Input from '../../../components/ui/ui-components/Input';
import Select from '../../../components/ui/ui-components/Select';
import Icon from '../../../components/ui/AppIcon';
import api from '../../../api/axios';
import { API_ENDPOINTS, USER_ROLES, USER_TYPES, USER_TYPE_LABELS } from '../../../utils/constants';

const CreateUserForm = ({ onCancel, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
        type: '',
        firstName: '',
        lastName: '',
        organizationName: '',
        profile: {
            phone: '',
            bio: '',
            website: '',
            address: '',
            yearsExperience: '',
            skills: '',
            languages: '',
            availability: ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('profile.')) {
            const profileField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [profileField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Prepare payload based on type
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                type: formData.type,
                profile: {}
            };

            // Add personal/org information based on type
            if (formData.type === 'INDIVIDUAL') {
                payload.firstName = formData.firstName;
                payload.lastName = formData.lastName;
            } else {
                payload.organizationName = formData.organizationName;
            }

            // Add profile fields only if they have values
            if (formData.profile.phone) payload.profile.phone = formData.profile.phone;
            if (formData.profile.bio) payload.profile.bio = formData.profile.bio;
            if (formData.profile.website) payload.profile.website = formData.profile.website;
            if (formData.profile.address) payload.profile.address = formData.profile.address;
            if (formData.profile.yearsExperience) {
                payload.profile.yearsExperience = parseInt(formData.profile.yearsExperience);
            }
            if (formData.profile.skills) payload.profile.skills = formData.profile.skills;
            if (formData.profile.languages) payload.profile.languages = formData.profile.languages;
            if (formData.profile.availability) payload.profile.availability = formData.profile.availability;

            // Remove profile if empty
            if (Object.keys(payload.profile).length === 0) {
                delete payload.profile;
            }

            await api.post(API_ENDPOINTS.USERS.CREATE, payload);
            onSuccess();
        } catch (err) {
            console.error('Error creating user:', err);
            setError(err.response?.data?.message || 'Failed to create user. Please check the details and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Create New User</h3>
                <Button variant="ghost" size="sm" onClick={onCancel}>
                    <Icon name="X" size={20} />
                </Button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm flex items-center">
                    <Icon name="AlertTriangle" size={16} className="mr-2" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Account Information */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder="johndoe"
                        />
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="john@example.com"
                        />
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Select
                                label="Role"
                                name="role"
                                value={formData.role}
                                onChange={(value) => handleSelectChange('role', value)}
                                required
                                placeholder="Select a role"
                                options={[
                                    { value: USER_ROLES.USER, label: 'User' },
                                    { value: USER_ROLES.MODERATOR, label: 'Moderator' }
                                ]}
                            />
                            <Select
                                label="Account Type"
                                name="type"
                                value={formData.type}
                                onChange={(value) => handleSelectChange('type', value)}
                                required
                                placeholder="Select account type"
                                options={[
                                    { value: USER_TYPES.INDIVIDUAL, label: 'Individual' },
                                    { value: USER_TYPES.ORGANIZATION, label: 'Organization' }
                                ]}
                            />
                        </div>
                    </div>
                </div>

                {/* Personal/Org Information */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        {formData.type === 'INDIVIDUAL' ? 'Personal Information' : 'Organization Details'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.type === 'INDIVIDUAL' ? (
                            <>
                                <Input
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    placeholder="John"
                                />
                                <Input
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Doe"
                                />
                            </>
                        ) : (
                            <Input
                                label="Organization Name"
                                name="organizationName"
                                value={formData.organizationName}
                                onChange={handleChange}
                                required
                                className="md:col-span-2"
                                placeholder="Acme Corp"
                            />
                        )}
                        <Input
                            label="Phone"
                            name="profile.phone"
                            value={formData.profile.phone}
                            onChange={handleChange}
                            placeholder="+1 (555) 000-0000"
                        />
                        <Input
                            label="Website"
                            name="profile.website"
                            value={formData.profile.website}
                            onChange={handleChange}
                            placeholder="https://example.com"
                        />
                        <Input
                            label="Address"
                            name="profile.address"
                            value={formData.profile.address}
                            onChange={handleChange}
                            className="md:col-span-2"
                            placeholder="123 Main St, City, Country"
                        />
                    </div>
                </div>

                {/* Profile Details */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Profile Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Bio"
                            name="profile.bio"
                            value={formData.profile.bio}
                            onChange={handleChange}
                            className="md:col-span-2"
                            placeholder="Short biography..."
                        />
                        <Input
                            label="Skills"
                            name="profile.skills"
                            value={formData.profile.skills}
                            onChange={handleChange}
                            placeholder="Java, Spring, React"
                        />
                        <Input
                            label="Languages"
                            name="profile.languages"
                            value={formData.profile.languages}
                            onChange={handleChange}
                            placeholder="English, Spanish"
                        />
                        <Input
                            label="Years Experience"
                            name="profile.yearsExperience"
                            type="number"
                            value={formData.profile.yearsExperience}
                            onChange={handleChange}
                            placeholder="5"
                        />
                        <Input
                            label="Availability"
                            name="profile.availability"
                            value={formData.profile.availability}
                            onChange={handleChange}
                            placeholder="Mon-Fri 9-5"
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                    <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} iconName={loading ? "Loader2" : "Check"}>
                        {loading ? 'Creating User...' : 'Create User'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateUserForm;
