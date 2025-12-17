// pages/register/index.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/ui-components/Button';
import Icon from '../../components/ui/AppIcon';
import UserTypeSelector from './components/UserTypeSelector';
import ProgressIndicator from './components/ProgressIndicator';
import BasicInfoForm from './components/BasicInfoForm';
import ProviderDetailsForm from './components/ProviderDetailsForm';
import TermsAndAgreements from './components/TermsAndAgreements';
import { API_ENDPOINTS, STORAGE_KEYS, SUCCESS_MESSAGES } from '../../utils/constants';
import api from '../../api/axios';
import logoImage from '../../assets/neighbourlyunion_Image-Photoroom.png';

/**
 * Register Page - Dynamic Spring Boot Integration
 * 
 * Flow:
 * 1. User selects type (Individual/Organization)
 * 2. Fills basic info
 * 3. If Organization, fills provider details
 * 4. Agrees to terms
 * 5. POST /api/auth/register
 * 6. Backend sends verification email
 * 7. Redirect to email verification page
 */
const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userType: '', // 'seeker' or 'provider'
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    zipCode: '',
    // Provider-specific fields
    organizationName: '',
    organizationType: '',
    serviceCategories: [],
    serviceDescription: '',
    contactPerson: '',
    contactPhone: '',
    website: '',
    // Agreements
    termsOfService: false,
    privacyPolicy: false,
    communityGuidelines: false,
    emailNotifications: true,
    smsNotifications: false
  });
  const [errors, setErrors] = useState({});

  // Define steps based on user type
  const steps = [
    { id: 'type', title: 'User Type', component: 'UserTypeSelector' },
    { id: 'basic', title: 'Basic Info', component: 'BasicInfoForm' },
    ...(formData?.userType === 'provider' ? [
      { id: 'provider', title: 'Provider Details', component: 'ProviderDetailsForm' }
    ] : []),
    { id: 'terms', title: 'Terms', component: 'TermsAndAgreements' }
  ];

  const totalSteps = steps?.length;

  /**
   * Handle input changes
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Validate current step
   */
  const validateStep = (step) => {
    const newErrors = {};

    // Step 1: User Type Selection
    if (step === 1) {
      if (!formData?.userType) {
        newErrors.userType = 'Please select how you want to participate';
      }
    }

    // Step 2: Basic Info
    if (step === 2) {
      if (!formData?.firstName?.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData?.lastName?.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData?.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData?.password) {
        newErrors.password = 'Password is required';
      } else if (formData?.password?.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData?.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number';
      }
      if (formData?.password !== formData?.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData?.zipCode?.trim()) {
        newErrors.zipCode = 'Postal/zip code is required';
      } else if (!/^(\d{5}(-\d{4})?|[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})$/i.test(formData?.zipCode)) {
        newErrors.zipCode = 'Please enter a valid postal or zip code';
      }
    }

    // Step 3: Provider Details (if provider)
    if (step === 3 && formData?.userType === 'provider') {
      if (!formData?.organizationName?.trim()) {
        newErrors.organizationName = 'Organization name is required';
      }
      if (!formData?.organizationType) {
        newErrors.organizationType = 'Organization type is required';
      }
      if (!formData?.serviceCategories?.length) {
        newErrors.serviceCategories = 'Please select at least one service category';
      }
      if (!formData?.serviceDescription?.trim()) {
        newErrors.serviceDescription = 'Service description is required';
      }
      if (!formData?.contactPerson?.trim()) {
        newErrors.contactPerson = 'Contact person is required';
      }
      if (!formData?.contactPhone?.trim()) {
        newErrors.contactPhone = 'Contact phone is required';
      }
    }

    // Last Step: Terms and Agreements
    const termsStep = formData?.userType === 'provider' ? 4 : 3;
    if (step === termsStep) {
      if (!formData?.termsOfService) {
        newErrors.termsOfService = 'You must agree to the Terms of Service';
      }
      if (!formData?.privacyPolicy) {
        newErrors.privacyPolicy = 'You must agree to the Privacy Policy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  /**
   * Handle next button click
   */
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  /**
   * Handle previous button click
   */
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  /**
   * Handle form submission - CONNECTS TO SPRING BOOT
   */
  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Prepare registration data for backend
      const registrationData = {
        email: formData.email,
        password: formData.password,
        username: formData.email.split('@')[0], // Generate username from email
        firstName: formData.firstName,
        lastName: formData.lastName,
        type: formData.userType === 'provider' ? 'ORGANIZATION' : 'INDIVIDUAL',
        // Additional fields
        phone: formData.phone || null,
        zipCode: formData.zipCode,
        // Provider-specific fields
        ...(formData.userType === 'provider' && {
          organizationName: formData.organizationName,
          organizationType: formData.organizationType,
          serviceCategories: formData.serviceCategories.join(','),
          serviceDescription: formData.serviceDescription,
          contactPhone: formData.contactPhone,
          website: formData.website || null
        })
      };

      // Call Spring Boot register API
      await api.post(API_ENDPOINTS.AUTH.REGISTER, registrationData);

      console.log(SUCCESS_MESSAGES.REGISTER);

      // Registration successful - user needs to verify email
      // Redirect to verification page with email
      navigate('/verify-email', {
        state: {
          email: formData.email,
          message: 'Registration successful! Please check your email for a verification code.',
          userType: formData.userType
        }
      });

        } catch (error) {
      console.error('Registration failed:', error);

      // Handle specific error cases
      if (error.response?.status === 409) {
        // Email already exists
        setErrors(prev => ({
          ...prev,
          email: 'An account with this email already exists. Please login or use a different email.',
          submit: 'This email is already registered. Please use a different email or login instead.'
        }));

        setCurrentStep(2);

        const emailField = document.getElementById('email');
        if (emailField) {
          setTimeout(() => {
            emailField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            emailField.focus();
          }, 100);
        }
      } else if (error.response?.status === 401) {
      const message =
        'Registration failed (401). This could be because the email already exists or another authentication issue. Please check your details or try a different email.';

      // Popup so the user can read it
      window.alert(message);

      setErrors({
        submit: message
      });
      } else if (error.response?.status === 400) {
        // Validation error
        setErrors({
          submit: error.response?.data?.message || 'Please check your information and try again.'
        });
      } else {
        setErrors({
          submit: error.message || 'Registration failed. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Render current step component
   */
  const renderCurrentStep = () => {
    const currentStepData = steps?.[currentStep - 1];

    switch (currentStepData?.component) {
      case 'UserTypeSelector':
        return (
          <UserTypeSelector
            selectedType={formData?.userType}
            onTypeChange={(type) => handleInputChange('userType', type)}
          />
        );
      case 'BasicInfoForm':
        return (
          <BasicInfoForm
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      case 'ProviderDetailsForm':
        return (
          <ProviderDetailsForm
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      case 'TermsAndAgreements':
        return (
          <TermsAndAgreements
            formData={formData}
            errors={errors}
            onChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logoImage}
                alt="NeighborlyUnion"
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-semibold text-foreground">
                NeighborlyUnion
              </span>
            </Link>

            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
            >
              Already have an account? <span className="text-primary font-medium">Sign In</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card rounded-lg shadow-elevation-2 overflow-hidden">
          <div className="p-6 sm:p-8">
            {/* Progress Indicator */}
            {formData?.userType && (
              <ProgressIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                steps={steps}
              />
            )}

            {/* Form Content */}
            <div className="max-w-2xl mx-auto">
              {renderCurrentStep()}

              {/* Error Display */}
              {errors?.submit && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={20} color="#DC2626" />
                    <span className="text-sm text-red-700">{errors?.submit}</span>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  iconName="ChevronLeft"
                  iconPosition="left"
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-3">
                  {currentStep < totalSteps ? (
                    <Button
                      variant="default"
                      onClick={handleNext}
                      disabled={!formData?.userType && currentStep === 1}
                      iconName="ChevronRight"
                      iconPosition="right"
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      onClick={() => {
                        // Validate last step (terms) before submitting
                        if (validateStep(currentStep)) {
                          handleSubmit();
                        }
                      }}
                      loading={isLoading}
                      iconName="UserPlus"
                      iconPosition="left"
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help with registration? {' '}
            <a href="mailto:support@neighborlyunion.com" className="text-primary hover:text-primary/80">
              Contact our support team
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date()?.getFullYear()} NeighborlyUnion. Building stronger communities together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;