import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { STORAGE_KEYS } from '../../utils/constants';
import { jwtDecode } from 'jwt-decode';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const processOAuthCallback = async () => {
            try {
                // Get tokens from URL query parameters
                const token = searchParams.get('token');
                const refreshToken = searchParams.get('refreshToken');
                const errorParam = searchParams.get('error');

                // Check for errors from backend
                if (errorParam) {
                    throw new Error(decodeURIComponent(errorParam));
                }

                // Validate tokens exist
                if (!token) {
                    throw new Error('Authentication failed. No token received.');
                }

                // Store tokens
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
                if (refreshToken) {
                    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
                }

                // Decode the token to get user info
                const decodedToken = jwtDecode(token);

                // Store user data from the token
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(decodedToken));

                // Redirect based on user role/type
                const userRole = (decodedToken?.role || '').toString().toUpperCase();
                const userType = (decodedToken?.type || '').toString().toUpperCase();

                if (userRole === 'ADMIN') {
                    navigate('/admin-panel');
                } else if (userRole === 'MODERATOR') {
                    navigate('/moderator-panel');
                } else if (userType === 'ORGANIZATION' || userType === 'PROVIDER') {
                    navigate('/provider-dashboard');
                } else {
                    navigate('/user-dashboard');
                }

            } catch (err) {
                console.error('OAuth callback error:', err);
                console.log('Search Params:', searchParams.toString()); // Debugging
                setError(err.message || 'Failed to complete authentication. Please try again.');
                setIsProcessing(false);
                // setTimeout(() => navigate('/login'), 3000); // Disable auto-redirect for debugging
            }
        };

        processOAuthCallback();
    }, [searchParams, navigate]);

    // ... rest of the component remains the same ...
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                {isProcessing ? (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Completing Sign In...
                        </h2>
                        <p className="text-gray-600">
                            Please wait while we set up your account.
                        </p>
                    </>
                ) : error ? (
                    <>
                        <div className="bg-red-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Authentication Failed
                        </h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <div className="bg-gray-100 p-2 rounded text-xs text-left overflow-auto max-w-sm mx-auto mb-4">
                            <code>Params: {searchParams.toString()}</code>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                            Return to Login
                        </button>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default OAuthCallback;