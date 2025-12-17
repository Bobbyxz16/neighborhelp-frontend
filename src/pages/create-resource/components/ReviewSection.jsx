import React from 'react';
import Button from '../../../components/ui/ui-components/Button';
import { Checkbox } from '../../../components/ui/ui-components/Checkbox';
import Icon from '../../../components/ui/AppIcon';
import Image from '../../../components/ui/AppImage';

const ReviewSection = ({ formData, onChange, onSubmit, onSaveDraft, isSubmitting, isDraftSaving }) => {
  const getCategoryLabel = (value) => {
    const categories = {
      'food': 'Food & Nutrition',
      'health': 'Healthcare',
      'legal': 'Legal Aid',
      'education': 'Education',
      'housing': 'Housing',
      'employment': 'Employment',
      'mental-health': 'Mental Health',
      'clothing': 'Clothing',
      'transportation': 'Transportation'
    };
    return categories?.[value] || value;
  };

  const getServiceTypeLabel = (value) => {
    const types = {
      'ongoing': 'Ongoing Service',
      'event': 'One-time Event',
      'seasonal': 'Seasonal Program',
      'emergency': 'Emergency Resource'
    };
    return types?.[value] || value;
  };

  const getCostTypeLabel = (value) => {
    const types = {
      'free': 'Completely Free',
      'sliding-scale': 'Sliding Scale',
      'fixed-fee': 'Fixed Fee',
      'donation-based': 'Donation Based',
      'insurance-covered': 'Insurance Covered',
      'varies': 'Cost Varies'
    };
    return types?.[value] || value;
  };

  const formatOperatingDays = (days) => {
    if (!days || days?.length === 0) return 'Not specified';
    const dayLabels = {
      'monday': 'Mon',
      'tuesday': 'Tue',
      'wednesday': 'Wed',
      'thursday': 'Thu',
      'friday': 'Fri',
      'saturday': 'Sat',
      'sunday': 'Sun'
    };
    return days?.map(day => dayLabels?.[day])?.join(', ');
  };

  const mainImage = formData?.images?.find(img => img?.isMain) || formData?.images?.[0];

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-foreground">Review & Submit</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review your listing details before submitting for approval
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview Card */}
        <div className="lg:col-span-2">
          <h3 className="font-medium text-foreground mb-4">Listing Preview</h3>
          <div className="bg-muted rounded-lg border border-border overflow-hidden">
            {mainImage && (
              <div className="h-48 overflow-hidden">
                <Image
                  src={mainImage?.url}
                  alt={mainImage?.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-foreground">{formData?.title || 'Service Title'}</h4>
                  <p className="text-sm text-muted-foreground">{formData?.providerName || 'Provider Name'}</p>
                </div>
                <div className="flex items-center space-x-1 bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                  <Icon name="Tag" size={12} />
                  <span>{getCategoryLabel(formData?.category)}</span>
                </div>
              </div>

              <p className="text-sm text-foreground line-clamp-3">
                {formData?.description || 'Service description will appear here...'}
              </p>

              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={12} />
                  <span>{formData?.city && formData?.state ? `${formData?.city}, ${formData?.state}` : 'Location'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span>{formatOperatingDays(formData?.operatingDays)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="DollarSign" size={12} />
                  <span>{getCostTypeLabel(formData?.costType)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Details */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="text-foreground font-medium">{getCategoryLabel(formData?.category)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Type:</span>
              <span className="text-foreground font-medium">{getServiceTypeLabel(formData?.serviceType)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Cost:</span>
              <span className="text-foreground font-medium">{getCostTypeLabel(formData?.costType)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Images:</span>
              <span className="text-foreground font-medium">{formData?.images?.length || 0} uploaded</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Contact Methods:</span>
              <span className="text-foreground font-medium">{formData?.preferredContactMethods?.length || 0} selected</span>
            </div>
          </div>

          <div className="bg-accent rounded-lg p-3">
            <h4 className="font-medium text-accent-foreground mb-2 flex items-center">
              <Icon name="Info" size={14} className="mr-2" />
              What happens next?
            </h4>
            <ul className="text-xs text-accent-foreground space-y-1">
              <li>• Your listing will be reviewed by our team</li>
              <li>• Approval typically takes 1-2 business days</li>
              <li>• You'll receive email updates on status</li>
              <li>• Once approved, it will be visible to users</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Terms and Submission */}
      <div className="border-t border-border pt-6 space-y-4">
        <div className="space-y-3">
          <Checkbox
            label="I confirm that all information provided is accurate and up-to-date"
            checked={formData?.confirmAccuracy}
            onChange={(e) => onChange && onChange('confirmAccuracy', e?.target?.checked)}
            required
          />

          <Checkbox
            label={
              <span>
                I agree to the{' '}
                <a
                  href="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms of Service and Community Guidelines
                </a>
              </span>
            }
            checked={formData?.agreeToTerms}
            onChange={(e) => onChange && onChange('agreeToTerms', e?.target?.checked)}
            required
          />

          <Checkbox
            label="I understand that my listing will be reviewed before being published"
            checked={formData?.understandReview}
            onChange={(e) => onChange && onChange('understandReview', e?.target?.checked)}
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onSaveDraft}
            loading={isDraftSaving}
            iconName="Save"
            iconPosition="left"
            className="sm:w-auto"
          >
            Save as Draft
          </Button>

          <Button
            variant="default"
            onClick={onSubmit}
            loading={isSubmitting}
            disabled={!formData?.confirmAccuracy || !formData?.agreeToTerms || !formData?.understandReview}
            iconName="Send"
            iconPosition="left"
            className="sm:flex-1"
          >
            Submit for Review
          </Button>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="mt-0.5" />
            <div>
              <h4 className="font-medium text-warning mb-1">Important Reminder</h4>
              <p className="text-sm text-warning">
                Please ensure all contact information is current. Users will rely on this information to access your services.
                You can edit your listing anytime from your provider dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;