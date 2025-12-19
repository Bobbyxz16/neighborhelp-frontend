// pages/login/components/LoginForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/ui-components/Button';
import Input from '../../../components/ui/ui-components/Input';
import { Checkbox } from '../../../components/ui/ui-components/Checkbox';
import Icon from '../../../components/ui/AppIcon';

/**
 * LoginForm Component - Dynamic Backend Integration
 * 
 * Props:
 * - onLogin: Function to handle login (connects to backend)
 * - isLoading: Loading state from parent
 */
const LoginForm = ({ onLogin, isLoading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handle input changes
   */
  const handleInputChange = (e) => {
    if (!e || !e.target) return;
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Validate form before submission
   */
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  /**
   * Handle form submission - Calls backend via parent
   */
  const handleSubmit = async (e) => {
    e?.preventDefault();

    // Validate form
    if (!validateForm()) return;

    // Clear previous errors
    setErrors({});

    try {
      // Call parent's onLogin function (which calls backend)
      await onLogin({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });

      // Success - parent handles navigation

    } catch (error) {
      // Display error from backend
      setErrors({
        general: error.message || 'Login failed. Please try again.'
      });

      // If email not verified, show verify button
      if (error.message?.includes('not verified')) {
        setErrors(prev => ({
          ...prev,
          showVerify: true,
          email: formData.email
        }));
      }
    }
  };

  /**
   * Navigate to email verification
   */
  const handleVerifyEmail = () => {
    navigate('/verify-email', { state: { email: errors.email } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Error Message */}
      {errors?.general && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertCircle" size={16} color="var(--color-error)" />
            <div className="flex-1">
              <p className="text-sm text-error">{errors?.general}</p>
              {errors?.showVerify && (
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  className="mt-2 text-sm text-primary hover:text-primary/80 font-medium transition-smooth"
                >
                  Verify Email Now →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email Input */}
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={formData?.email}
        onChange={handleInputChange}
        error={errors?.email}
        required
        autoComplete="email"
      />

      {/* Password Input */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter your password"
          value={formData?.password}
          onChange={handleInputChange}
          error={errors?.password}
          required
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
        >
          <Icon
            name={showPassword ? 'EyeOff' : 'Eye'}
            size={16}
            className="text-current"
          />
        </button>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <div />
        <Link
          to="/forgot-password"
          className="text-sm text-primary hover:text-primary/80 transition-smooth"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        iconName="LogIn"
        iconPosition="left"
      >
        {isLoading ? 'Signing in...' : 'Sign In to NeighborlyUnion'}
      </Button>

      {/* Additional Links */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">New to our community?</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          asChild
        >
          <Link to="/register">Create Your Account</Link>
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;