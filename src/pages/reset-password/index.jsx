import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from '../../components/ui/ui-components/Button';
import Input from '../../components/ui/ui-components/Input';
import Icon from '../../components/ui/AppIcon';
import { API_ENDPOINTS } from '../../utils/constants';
import api from '../../api/axios';
import logoImage from '../../assets/neighbourlyunion_Image-Photoroom.png';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Protection: if no email, redirect back
    React.useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            // API call to reset password
            await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
                email: email,
                newPassword: newPassword
            });

            setSuccess(true);

            // Redirect to login after success
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Password reset successfully! Please login with your new password.',
                        email: email
                    }
                });
            }, 3000);

        } catch (err) {
            console.error('Reset password failed:', err);
            setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-card rounded-xl shadow-elevation-2 border border-border p-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="CheckCircle" size={32} color="#10B981" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Password Reset Successful!
                        </h2>
                        <p className="text-muted-foreground mb-4">
                            Your password has been securely updated. You can now login.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Redirecting to login page...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="max-w-md w-full">
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

                <div className="bg-card rounded-xl shadow-elevation-2 border border-border p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="Lock" size={32} color="var(--color-primary)" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            Set New Password
                        </h1>
                        <p className="text-muted-foreground">
                            Please create a new password for your account associated with <strong>{email}</strong>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Input
                                label="New Password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Make it secure"
                                required
                                icon="Lock"
                                minLength={8}
                            />
                        </div>

                        <div>
                            <Input
                                label="Confirm Password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat password"
                                required
                                icon="Lock"
                                minLength={8}
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
                            Reset Password
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
