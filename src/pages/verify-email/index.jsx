// pages/verify-email/index.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from '../../components/ui/ui-components/Button';
import Icon from '../../components/ui/AppIcon';
import { API_ENDPOINTS } from '../../utils/constants';
import api from '../../api/axios';
import logoImage from '../../assets/neighbourlyunion_Image-Photoroom.png';

/**
 * Email Verification Page
 * 
 * Flow:
 * 1. User receives 6-digit code via email
 * 2. User enters code
 * 3. POST /api/auth/verify
 * 4. Redirect to login on success
 */
const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const message = location.state?.message || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);

  /**
   * Handle code input change
   */
  const handleCodeChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only take last digit
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }

    // Clear error when user types
    if (error) setError('');
  };

  /**
   * Handle backspace
   */
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  /**
   * Handle paste
   */
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }

    setCode(newCode);

    // Focus last filled input or first empty one
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`code-${lastIndex}`)?.focus();
  };

  /**
   * Verify code - CONNECTS TO BACKEND
   */
  const handleVerify = async () => {
    const verificationCode = code.join('');

    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call Spring Boot verify API (send JSON)
      await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
        email,
        code: verificationCode,
      });

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Email verified successfully! You can now log in.',
            email: email
          }
        });
      }, 2000);

    } catch (error) {
      console.error('Verification failed:', error);

      if (error.response?.status === 400) {
        setError('Invalid or expired code. Please try again.');
      } else {
        setError(error.message || 'Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend verification code
   */
  const handleResendCode = async () => {
    setResending(true);
    setError('');

    try {
      await api.post(API_ENDPOINTS.AUTH.RESEND_CODE, { email });

      alert('Verification code resent! Please check your email.');
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();

    } catch (error) {
      console.error('Resend failed:', error);
      setError('Failed to resend code. Please try again.');
    } finally {
      setResending(false);
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
          {!success ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Mail" size={32} color="var(--color-primary)" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Verify Your Email
                </h1>
                <p className="text-muted-foreground">
                  {message || `We've sent a 6-digit verification code to`}
                </p>
                <p className="text-foreground font-medium mt-1">{email}</p>
              </div>

              {/* Code Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3 text-center">
                  Enter Verification Code
                </label>
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
                      className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={20} color="#DC2626" />
                    <span className="text-sm text-red-700">{error}</span>
                  </div>
                </div>
              )}

              {/* Verify Button */}
              <Button
                onClick={handleVerify}
                loading={isLoading}
                disabled={code.join('').length !== 6}
                variant="default"
                size="lg"
                fullWidth
                iconName="CheckCircle"
                iconPosition="left"
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Button>

              {/* Resend Code */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  onClick={handleResendCode}
                  variant="ghost"
                  size="sm"
                  loading={resending}
                  iconName="RotateCw"
                  iconPosition="left"
                >
                  {resending ? 'Resending...' : 'Resend Code'}
                </Button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle" size={32} color="#10B981" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Email Verified!
              </h2>
              <p className="text-muted-foreground mb-4">
                Your email has been successfully verified.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to login page...
              </p>
            </div>
          )}
        </div>

        {/* Back to Login */}
        {!success && (
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-primary hover:text-primary/80 transition-smooth"
            >
              ← Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;