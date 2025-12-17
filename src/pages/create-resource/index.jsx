import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/ui/ui-components/Header';
import Button from '../../components/ui/ui-components/Button';
import Icon from '../../components/ui/AppIcon';
import BasicInfoSection from './components/BasicInfoSection';
import LocationSection from './components/LocationSection';
import AvailabilitySection from './components/AvailabilitySection';
import ContactSection from './components/ContactSection';
import CostSection from './components/CostSection';
import MediaSection from './components/MediaSection';
import ReviewSection from './components/ReviewSection';
import { API_BASE_URL, API_ENDPOINTS, STORAGE_KEYS } from '../../utils/constants';
import api from '../../api/axios';

const CreateResourceListing = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const isEditMode = !!slug;

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoadingResource, setIsLoadingResource] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    description: '',
    category: '',

    // Location
    city: '',
    street: '',
    postalCode: '',
    province: '',
    country: 'England',

    // Contact & Availability
    contactName: '',
    phoneNumber: '',
    email: '',
    website: '',
    preferredContactMethods: [],
    responseTime: '',
    minFee: '',
    maxFee: '',
    slidingScaleDetails: '',
    suggestedDonation: '',
    donationInfo: '',
    acceptedPaymentMethods: [],
    hasFinancialAssistance: false,
    financialAssistanceDetails: '',
    additionalCostInfo: '',

    // Additional
    requirements: '',
    additionalNotes: '',
    wheelchairAccessible: false,
    languages: [],
    targetAudience: '',
    imageUrl: '',
    websiteUrl: '',

    // Media
    images: [],
    videoUrl: '',
    virtualTourUrl: '',

    // Review
    confirmAccuracy: false,
    agreeToTerms: false,
    understandReview: false,
  });

  // Steps config
  const steps = [
    { id: 1, title: 'Basic Info', icon: 'FileText', component: BasicInfoSection },
    { id: 2, title: 'Location', icon: 'MapPin', component: LocationSection },
    { id: 3, title: 'Availability', icon: 'Clock', component: AvailabilitySection },
    { id: 4, title: 'Contact', icon: 'Phone', component: ContactSection },
    { id: 5, title: 'Cost', icon: 'DollarSign', component: CostSection },
    { id: 6, title: 'Photos', icon: 'Camera', component: MediaSection },
    { id: 7, title: 'Review', icon: 'CheckCircle', component: ReviewSection },
  ];

  // Helpers
  const getDraftKey = () => {
    try {
      const userJson = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userJson) return 'resourceListingDraft_anonymous';
      const user = JSON.parse(userJson);
      const idPart = user?.id || user?.email || user?.username || 'anonymous';
      return `resourceListingDraft_${idPart}`;
    } catch {
      return 'resourceListingDraft_anonymous';
    }
  };

  // Helper function to get redirect path based on user role/type
  const getUserDashboardPath = () => {
    try {
      const userJson = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userJson) return '/user-dashboard';

      const userData = JSON.parse(userJson);
      const userRole = (userData?.role || '').toString().toUpperCase();
      const userType = (userData?.type || userData?.userType || '').toString().toUpperCase();

      // Priority: Role-based redirect (ADMIN/MODERATOR) > Type-based redirect (PROVIDER/ORG)
      if (userRole === 'ADMIN') {
        return '/admin-panel';
      } else if (userRole === 'MODERATOR') {
        return '/moderator-panel';
      } else if (userType === 'ORGANIZATION' || userType === 'PROVIDER') {
        return '/provider-dashboard';
      }
      return '/user-dashboard';
    } catch {
      return '/user-dashboard';
    }
  };

  // Handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (stepNumber) => {
    const stepErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.title.trim()) stepErrors.title = 'Title is required';
        if (!formData.category) stepErrors.category = 'Category is required';
        if (!formData.description.trim() || formData.description.length < 20) {
          stepErrors.description = 'Description must be at least 20 characters';
        }
        break;
      case 2:
        if (!formData.city.trim()) stepErrors.city = 'City is required';
        if (!formData.street.trim()) stepErrors.street = 'Street address is required';
        if (!formData.postalCode.trim()) stepErrors.postalCode = 'Postal code is required';
        break;
      case 3:
        if (!formData.contactName?.trim()) stepErrors.contactName = 'Contact name is required';
        if (!formData.phoneNumber?.trim()) stepErrors.phoneNumber = 'Phone number is required';
        if (!formData.email?.trim()) stepErrors.email = 'Email is required';
        if (
          !Array.isArray(formData.preferredContactMethods) ||
          formData.preferredContactMethods.length === 0
        ) {
          stepErrors.preferredContactMethods = 'Select at least one method';
        }
        if (!formData.responseTime) stepErrors.responseTime = 'Response time is required';
        break;
      default:
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 3) {
      validateStep(3); // Show errors but don't block
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (stepNumber) => {
    if (stepNumber <= currentStep || validateStep(currentStep)) {
      setCurrentStep(stepNumber);
    }
  };

  const handleSaveDraft = async () => {
    setIsDraftSaving(true);
    try {
      const draftKey = getDraftKey();
      localStorage.setItem(draftKey, JSON.stringify(formData));
      setLastSaved(new Date());
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setIsSubmitting(true);

    const normalizeCapacity = (value) => {
      if (!value) return undefined;
      if (typeof value === 'number') return value;
      const v = String(value).toLowerCase();
      if (v === 'unlimited') return undefined;
      if (/^\d+$/.test(v)) return parseInt(v, 10);
      if (/^\d+-\d+$/.test(v)) return parseInt(v.split('-')[1], 10);
      if (/^\d+\+$/.test(v)) return parseInt(v.replace('+', ''), 10);
      return undefined;
    };

    // Build contactInfo string
    const contactParts = [];
    if (formData.contactName?.trim()) contactParts.push(`Name: ${formData.contactName.trim()}`);
    if (formData.phoneNumber?.trim()) contactParts.push(`Tel: ${formData.phoneNumber.trim()}`);
    if (formData.email?.trim()) contactParts.push(`Email: ${formData.email.trim()}`);
    const websiteStr = formData.websiteUrl?.trim() || formData.website?.trim();
    if (websiteStr) contactParts.push(`Web: ${websiteStr}`);
    if (formData.preferredContactMethods?.length) {
      contactParts.push(`Preferred: ${formData.preferredContactMethods.join(', ')}`);
    }
    if (formData.contactInstructions?.trim()) contactParts.push(formData.contactInstructions.trim());
    if (formData.emergencyContact && formData.emergencyPhone?.trim()) {
      contactParts.push(
        `Emergency: ${formData.emergencyPhone.trim()}${formData.emergencyHours?.trim() ? ` (${formData.emergencyHours.trim()})` : ''}`
      );
    }
    const contactInfo = contactParts.join(', ');

    // Build availability string
    let availability = '';
    if (formData.operatingDays?.length) availability += formData.operatingDays.join(', ');
    if (formData.timeSlots?.length) {
      const slots = formData.timeSlots
        .filter((s) => s?.startTime && s?.endTime)
        .map((s) => `${s.startTime}-${s.endTime}`)
        .join(', ');
      if (slots) availability += (availability ? ' ' : '') + slots;
    }
    if (formData.contactHours) availability += (availability ? ' ' : '') + formData.contactHours;
    if (formData.isSeasonal && (formData.seasonStart || formData.seasonEnd)) {
      const season = [formData.seasonStart, formData.seasonEnd].filter(Boolean).join(' to ');
      if (season) availability += (availability ? ' ' : '') + `Season: ${season}`;
    }
    if (formData.seasonalNotes?.trim()) availability += (availability ? ' ' : '') + formData.seasonalNotes.trim();
    if (formData.scheduleNotes?.trim()) availability += (availability ? ' ' : '') + formData.scheduleNotes.trim();

    // Main image
    const mainImage = formData.images?.find((img) => img.isMain) || formData.images?.[0];
    const imageUrl = mainImage?.url;

    // Cost mapping
    let costValue = 'FREE';
    if (['sliding-scale', 'low-cost'].includes(formData.costType)) costValue = 'LOW_COST';
    else if (formData.costType !== 'free') costValue = 'VARIES';

    // Build cost details string
    let costDetailsStr = '';
    if (formData.costType === 'fixed-fee' && formData.fixedFee) {
      costDetailsStr += `Fee: £${formData.fixedFee}. `;
    } else if (formData.costType === 'sliding-scale') {
      if (formData.minFee || formData.maxFee) {
        costDetailsStr += `Sliding Scale: £${formData.minFee || '0'} - £${formData.maxFee || '?'}. `;
      }
      if (formData.slidingScaleDetails) {
        costDetailsStr += `Details: ${formData.slidingScaleDetails}. `;
      }
    } else if (formData.costType === 'donation-based') {
      if (formData.suggestedDonation) {
        costDetailsStr += `Suggested Donation: £${formData.suggestedDonation}. `;
      }
      if (formData.donationInfo) costDetailsStr += `${formData.donationInfo}. `;
    }
    if (formData.acceptedPaymentMethods?.length) {
      const methodLabels = {
        cash: 'Cash',
        check: 'Check',
        card: 'Card',
        online: 'Online',
        insurance: 'Insurance',
        voucher: 'Voucher',
      };
      const methods = formData.acceptedPaymentMethods.map((m) => methodLabels[m] || m);
      costDetailsStr += `Payment: ${methods.join(', ')}. `;
    }
    if (formData.hasFinancialAssistance) {
      costDetailsStr += `Financial Assistance: ${formData.financialAssistanceDetails || 'Available'}. `;
    }
    if (formData.additionalCostInfo) {
      costDetailsStr += `Note: ${formData.additionalCostInfo}`;
    }

    let finalAdditionalNotes = formData.additionalNotes?.trim() || '';
    if (costDetailsStr) {
      finalAdditionalNotes = finalAdditionalNotes
        ? `${finalAdditionalNotes}\n\n[COST_DETAILS] ${costDetailsStr}`
        : `[COST_DETAILS] ${costDetailsStr}`;
    }
    const payload = {
      title: formData.title,
      description: formData.description,
      categoryName: formData.category,
      imageUrl: formData.images?.map(img => img.url).filter(Boolean) || undefined,
      street: formData.street,
      city: formData.city,
      postalCode: formData.postalCode,
      fullAddress: `${formData.street}, ${formData.city}, ${formData.postalCode}`,
      contactInfo: contactInfo,
      website: formData.websiteUrl || formData.website,
      availability: availability,
      cost: costValue,
      capacity: normalizeCapacity(formData.capacity),
      targetAudience: formData.targetAudience,
      languages: formData.languages?.join(', '),
      wheelchairAccessible: formData.wheelchairAccessible,
      additionalNotes: finalAdditionalNotes,
      status: 'PENDING'
    };

    try {
      let response;
      if (isEditMode) {
        response = await api.put(API_ENDPOINTS.RESOURCES.BY_SLUG(slug), payload);
        alert('Resource updated successfully!');
      } else {
        response = await api.post(API_ENDPOINTS.RESOURCES.BASE, payload);
        alert('Resource created successfully!');
      }

      if (response.data && !isEditMode) {
        const draftKey = getDraftKey();
        localStorage.removeItem(draftKey);
      }

      // Redirect based on user role/type
      navigate(getUserDashboardPath());
    } catch (error) {
      console.error('Submission failed:', error?.response?.data || error);
      alert(error?.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-save handler
  const handleAutoSave = useCallback(() => {
    if (isEditMode) return;
    const hasData = Object.values(formData).some((v) => {
      if (typeof v === 'string') return v.trim() !== '';
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'boolean') return v === true;
      return v != null;
    });
    if (hasData) {
      const draftKey = getDraftKey();
      try {
        localStorage.setItem(draftKey, JSON.stringify(formData));
        setLastSaved(new Date());
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }
  }, [formData, isEditMode]);

  // Side effects
  useEffect(() => {
    // Load categories
    const loadCategories = async () => {
      try {
        const { data } = await api.get(API_ENDPOINTS.CATEGORIES.BASE);
        setCategories(data || []);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadCategories();

    // Load existing resource if editing
    const loadResourceData = async () => {
      if (!isEditMode) return;
      setIsLoadingResource(true);
      try {
        let resourceData = null;

        // 1. Try fetching by slug (public endpoint)
        try {
          const { data } = await api.get(API_ENDPOINTS.RESOURCES.BY_SLUG(slug));
          resourceData = data;
        } catch (err) {
          console.warn('Public fetch failed, trying fallbacks...', err);
        }

        // 2. If not found, try fetching from "My Resources" (for owners of pending/inactive resources)
        if (!resourceData) {
          try {
            const { data } = await api.get(API_ENDPOINTS.RESOURCES.MY_RESOURCES, {
              params: { size: 100 }
            });
            const myResources = data.content || data || [];
            resourceData = myResources.find(r => r.slug === slug);
          } catch (err) {
            console.warn('My resources fetch failed:', err);
          }
        }

        // 3. If still not found, try "Pending Resources" (for admins/moderators)
        if (!resourceData) {
          try {
            const { data } = await api.get(API_ENDPOINTS.RESOURCES.PENDING, {
              params: { size: 100 }
            });
            const pendingResources = data.content || data || [];
            resourceData = pendingResources.find(r => r.slug === slug);
          } catch (err) {
            console.warn('Pending resources fetch failed:', err);
          }
        }

        if (resourceData) {
          // Map API response to formData structure
          setFormData((prev) => {
            const newData = { ...prev, ...resourceData };

            // Ensure arrays are correctly restored from strings if necessary
            if (typeof resourceData.operatingDays === 'string') {
              newData.operatingDays = resourceData.operatingDays.split(',').map(d => d.trim()).filter(Boolean);
            }

            if (typeof resourceData.languages === 'string') {
              newData.languages = resourceData.languages.split(',').map(l => l.trim()).filter(Boolean);
            }

            // Map cost type back if possible
            if (resourceData.cost === 'FREE') newData.costType = 'free';
            else if (resourceData.cost === 'LOW_COST') newData.costType = 'low-cost';
            else if (resourceData.cost === 'VARIES') newData.costType = 'varies';

            return newData;
          });
        } else {
          throw new Error('Resource not found or you do not have permission to edit it.');
        }
      } catch (error) {
        console.error('Failed to load resource:', error);
        alert(`Error: ${error.message || 'Could not load resource'}. Redirecting to dashboard...`);
        navigate(getUserDashboardPath());
      } finally {
        setIsLoadingResource(false);
      }
    };
    loadResourceData();

    // Load draft if not editing
    if (!isEditMode) {
      const draftKey = getDraftKey();
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        try {
          setFormData((prev) => ({ ...prev, ...JSON.parse(saved) }));
        } catch (err) {
          console.error('Failed to parse draft:', err);
        }
      }
      // Clean up legacy key
      localStorage.removeItem('resourceListingDraft');
    }
  }, [isEditMode, slug, navigate]);

  // Auto-save interval
  useEffect(() => {
    if (isEditMode) return;
    const interval = setInterval(handleAutoSave, 30000);
    return () => clearInterval(interval);
  }, [handleAutoSave, isEditMode]);

  // Render
  const CurrentStepComponent = steps.find((s) => s.id === currentStep)?.component;
  const progressPercentage = Math.min(
    100,
    Math.round(((currentStep - 1) / (steps.length - 1 || 1)) * 100)
  );

  if (isLoadingResource && isEditMode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading resource...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate(getUserDashboardPath())}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Icon name="ArrowLeft" size={20} />
              <span className="font-medium">Back to Dashboard</span>
            </button>

            {lastSaved && !isEditMode && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Icon name="Save" size={16} />
                <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Resource' : 'Create Resource'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode ? 'Update your resource information' : 'Share your resource with the community'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm text-gray-500">{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Step Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">Steps</h2>
              <nav className="space-y-2">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${currentStep === step.id
                      ? 'bg-blue-600 text-white'
                      : currentStep > step.id
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    <Icon
                      name={currentStep > step.id ? 'CheckCircle' : step.icon}
                      size={16}
                    />
                    <span className="text-sm font-medium">{step.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-6">
                {CurrentStepComponent && (
                  <CurrentStepComponent
                    formData={formData}
                    onChange={handleInputChange}
                    errors={errors}
                    categories={categories}
                    onSubmit={handleSubmit}
                    onSaveDraft={handleSaveDraft}
                    isSubmitting={isSubmitting}
                    isDraftSaving={isDraftSaving}
                  />
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    iconName="ChevronLeft"
                    iconPosition="left"
                    className="sm:w-auto"
                  >
                    Previous
                  </Button>

                  <div className="flex flex-col sm:flex-row gap-3 sm:ml-auto">
                    {!isEditMode && (
                      <Button
                        variant="outline"
                        onClick={handleSaveDraft}
                        disabled={isDraftSaving}
                        iconName="Save"
                        iconPosition="left"
                      >
                        {isDraftSaving ? 'Saving...' : 'Save Draft'}
                      </Button>
                    )}

                    {currentStep < steps.length ? (
                      <Button
                        variant="primary"
                        onClick={handleNext}
                        iconName="ChevronRight"
                        iconPosition="right"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit Resource'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateResourceListing;