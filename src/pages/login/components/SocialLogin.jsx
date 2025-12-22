// src/pages/login/components/SocialLogin.jsx
import React from 'react';
import Icon from '../../../components/ui/AppIcon';
import { API_BASE_URL } from '../../../utils/constants';

const SocialLogin = ({ isLoading }) => {
    const socialProviders = [
        {
            id: 'google',
            name: 'Google',
            icon: 'Chrome',
            bgColor: 'bg-white hover:bg-gray-50',
            textColor: 'text-gray-700',
            borderColor: 'border-gray-300'
        }
    ];

    const handleSocialLogin = (provider) => {
        // Redirect to Spring Boot OAuth2 endpoint
        // Remove /api if present at the end, handling optional trailing slash
        const baseUrl = API_BASE_URL.replace(/\/api\/?$/, '');
        window.location.href = `${baseUrl}/oauth2/authorization/${provider}`;
    };

    return (
        <div className="space-y-3">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {socialProviders.map((provider) => (
                    <button
                        key={provider.id}
                        type="button"
                        onClick={() => handleSocialLogin(provider.id)}
                        disabled={isLoading}
                        className={`
                            w-full flex items-center justify-center space-x-2 px-4 py-3 
                            border rounded-lg transition-smooth font-medium text-sm
                            ${provider.bgColor} ${provider.textColor} ${provider.borderColor}
                            disabled:opacity-50 disabled:cursor-not-allowed
                            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                        `}
                    >
                        <Icon name={provider.icon} size={18} />
                        <span>Continue with {provider.name}</span>
                    </button>
                ))}
            </div>

            <div className="text-center">
                <p className="text-xs text-muted-foreground">
                    By continuing, you agree to our{' '}
                    <a
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-smooth underline"
                    >
                        Terms of Service
                    </a>
                    {' '}and{' '}
                    <a
                        href="/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-smooth underline"
                    >
                        Privacy Policy
                    </a>
                </p>
            </div>
        </div>
    );
};

export default SocialLogin;