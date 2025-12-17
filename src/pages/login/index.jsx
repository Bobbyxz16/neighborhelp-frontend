// pages/login/index.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/ui-components/Header';
import LoginForm from './components/LoginForm';
import SocialLogin from './components/SocialLogin';
import LoginHeader from './components/LoginHeader';
import LoginBenefits from './components/LoginBenefits';
import { API_ENDPOINTS, STORAGE_KEYS, SUCCESS_MESSAGES } from '../../utils/constants';
import api from '../../api/axios';

/**
 * Login Page - Dynamic with Spring Boot Backend
 * 
 * Flow:
 * 1. User enters credentials
 * 2. POST /api/auth/login
 * 3. Store JWT tokens
 * 4. Redirect to dashboard
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogin = async (credentials) => {
        setIsLoading(true);
        
        try {
            const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
                email: credentials.email,
                password: credentials.password,
            });

            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data?.accessToken || '');
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data?.refreshToken || '');

            const meResponse = await api.get(API_ENDPOINTS.USERS.ME);
            const userData = meResponse?.data ?? {};

            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
            setUser(userData);

            const userRole = (userData?.role || '').toString().toUpperCase();
            const userType = (userData?.type || '').toString().toUpperCase();

            if (userRole === 'ADMIN') {
                navigate('/admin-panel');
            } else if (userRole === 'MODERATOR') {
                navigate('/moderator-panel');
            } else if (userType === 'ORGANIZATION' || userType === 'PROVIDER') {
                navigate('/provider-dashboard');
            } else {
                navigate('/user-dashboard');
            }
            
            return userData;
            
        } catch (error) {
            console.error('Login failed:', error);
            
            if (error.response?.status === 403) {
                throw new Error('Email not verified. Please check your email for verification code.');
            } else if (error.response?.status === 401) {
                throw new Error('Invalid email or password. Please try again.');
            } else {
                throw new Error(error.message || 'Login failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setUser(null);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background">
            <Header user={user} onLogout={handleLogout} />
            
            <main className="pt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                        <div className="w-full lg:w-1/2 max-w-md">
                            <div className="text-center mb-6">
                                <LoginHeader />
                            </div>
                            
                            <div className="bg-card border border-border rounded-xl shadow-elevation-2 p-6">
                                <LoginForm 
                                    onLogin={handleLogin} 
                                    isLoading={isLoading} 
                                />
                                
                                <div className="mt-4">
                                    {/* SocialLogin now handles OAuth internally */}
                                    <SocialLogin isLoading={isLoading} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full lg:w-1/2 max-w-lg">
                            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-border rounded-xl shadow-elevation-1 p-6">
                                <LoginBenefits />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;