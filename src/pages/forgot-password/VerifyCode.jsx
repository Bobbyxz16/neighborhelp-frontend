import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from '../../components/ui/ui-components/Button';
import Icon from '../../components/ui/AppIcon';
import { API_ENDPOINTS } from '../../utils/constants';
import api from '../../api/axios';
import logoImage from '../../assets/neighbourlyunion_Image-Photoroom.png';

const VerifyCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if no email (user shouldn't be here directly)
    React.useEffect(() => {
        if (!email) {
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    const handleCodeChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        if (value && index < 5) {
            document.getElementById(`code-${index + 1}`)?.focus();
        }

        if (error) setError('');
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            document.getElementById(`code-${index - 1}`)?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newCode = [...code];

        for (let i = 0; i < pastedData.length; i++) {
            newCode[i] = pastedData[i];
        }
        setCode(newCode);

        const lastIndex = Math.min(pastedData.length, 5);
        document.getElementById(`code-${lastIndex}`)?.focus();
    };

    const handleVerify = async () => {
        const verificationCode = code.join('');

        if (verificationCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // POST { email, code } to /auth/verify-reset-code
            await api.post(API_ENDPOINTS.AUTH.VERIFY_RESET_CODE, {
                email,
                code: verificationCode,
            });

            // Navigate to reset password page on success
            navigate('/reset-password', {
                state: {
                    email: email, // Pass email forward
                    verified: true // Optional flag for protection
                }
            });

        } catch (err) {
            console.error('Verification failed:', err);
            setError(err.response?.data?.message || 'Invalid or expired code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            // Typically same endpoint as forgot password to resend
            await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
            alert('Code resent successfully!');
        } catch (err) {
            console.error('Resend failed:', err);
            setError('Failed to resend code.');
        }
    };

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
                            <Icon name="Shield" size={32} color="var(--color-primary)" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            Verify Code
                        </h1>
                        <p className="text-muted-foreground">
                            Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>
                        </p>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-center gap-2">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`code-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors bg-background text-foreground"
                                    disabled={isLoading}
                                />
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                            <Icon name="AlertCircle" size={16} />
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleVerify}
                        loading={isLoading}
                        disabled={code.join('').length !== 6}
                        variant="default"
                        size="lg"
                        fullWidth
                    >
                        Verify & Continue
                    </Button>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                            Didn't receive the code?
                        </p>
                        <Button
                            onClick={handleResendCode}
                            variant="ghost"
                            size="sm"
                        >
                            Resend Code
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyCode;
