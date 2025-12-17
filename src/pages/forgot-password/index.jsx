import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../../components/ui/ui-components/Button';
import Input from '../../components/ui/ui-components/Input';
import Icon from '../../components/ui/AppIcon';
import { API_ENDPOINTS } from '../../utils/constants';
import api from '../../api/axios';
import logoImage from '../../assets/neighbourlyunion_Image-Photoroom.png';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email is required');
            return;
        }

        setIsLoading(true);

        try {
            await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });

            // Navigate to verification page with email in state
            navigate('/forgot-password/verify', {
                state: {
                    email: email,
                    message: 'Code sent successfully!'
                }
            });
        } catch (err) {
            console.error('Forgot password error:', err);
            setError(err.response?.data?.message || 'Failed to send reset code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <img
                            src={logoImage}
                            alt="NeighborlyUnion"
                            className="h-16 w-auto object-contain"
                        />
                        <span className="text-2xl font-bold text-foreground">NeighborlyUnion</span>
                    </Link>
                </div>

                {/* Main Card */}
                <div className="bg-card rounded-xl shadow-elevation-2 border border-border p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="Key" size={32} color="var(--color-primary)" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            Forgot Password?
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your email address to receive a password reset code.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Input
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                required
                                icon="Mail"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                                <Icon name="AlertCircle" size={16} />
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="default"
                            size="lg"
                            fullWidth
                            loading={isLoading}
                        >
                            Send Reset Code
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
                        >
                            <Icon name="ArrowLeft" size={16} />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
