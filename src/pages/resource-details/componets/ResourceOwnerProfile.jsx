import React, { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';
import { API_BASE_URL, API_ENDPOINTS } from '../../../utils/constants';

const ResourceOwnerProfile = ({ identifier, city }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!identifier) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.BY_ID(identifier)}`);
                if (response.ok) {
                    const data = await response.json();
                    setProfileData(data);
                } else {
                    setError('Failed to load profile');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Error loading profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [identifier]);

    if (loading) return <div className="animate-pulse h-24 bg-gray-100 rounded-lg mb-6"></div>;
    if (error || !profileData) return null;

    const { profile, firstName, lastName, organizationName, username, verified, type } = profileData;
    const displayName = organizationName || (firstName && lastName ? `${firstName} ${lastName}` : username);

    return (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    {profile?.avatar || profile?.logo ? (
                        <img
                            src={profile?.avatar || profile?.logo}
                            alt={displayName}
                            className="w-16 h-16 rounded-full object-cover border border-border"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Icon name={type === 'ORGANIZATION' ? 'Building' : 'User'} size={32} />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground truncate">{displayName}</h3>
                        {verified && (
                            <Icon name="CheckCircle" size={16} className="text-green-500 flex-shrink-0" />
                        )}
                    </div>

                    <div className="space-y-2 text-sm">
                        {city && (
                            <div className="flex items-start gap-2 text-muted-foreground">
                                <Icon name="MapPin" size={14} className="mt-0.5 flex-shrink-0" />
                                <span>{city}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {profile?.languages && profile.languages.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex flex-wrap gap-2">
                        {profile.languages.map((lang, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-full">
                                {lang}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResourceOwnerProfile;
