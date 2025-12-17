import React from 'react';
import { Checkbox } from '../../../components/ui/ui-components/Checkbox';
import Icon from '../../../components/ui/AppIcon';

const TermsAndAgreements = ({ formData, errors, onChange }) => {
  const handleCheckboxChange = (field) => (e) => {
    onChange(field, e?.target?.checked);
  };

  const agreements = [
    {
      id: 'termsOfService',
      label: 'I agree to the Terms of Service',
      description: 'By checking this box, you agree to our community guidelines and platform rules',
      required: true,
      linkText: 'Read Terms of Service',
      linkUrl: '/terms'
    },
    {
      id: 'privacyPolicy',
      label: 'I agree to the Privacy Policy',
      description: 'We respect your privacy and will protect your personal information',
      required: true,
      linkText: 'Read Privacy Policy',
      linkUrl: '/privacy'
    },
    

  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Terms & Agreements
        </h3>
        <p className="text-muted-foreground">
          Please review and accept our terms to complete your registration
        </p>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-start space-x-3 mb-4">
          <Icon name="Shield" size={24} color="var(--color-primary)" />
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              Community Safety & Trust
            </h4>
            <p className="text-sm text-muted-foreground">
              NeighborlyUnion is built on trust and mutual support. By joining our community, 
              you're helping create a safe space where people can find and offer help with confidence.
            </p>
          </div>
        </div>

        {/* Add error message at the top if there are any errors */}
      {(errors.termsOfService || errors.privacyPolicy || errors.communityGuidelines) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Icon name="AlertCircle" className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Please accept all required agreements to continue.
              </p>
            </div>
          </div>
        </div>
      )}

        <div className="space-y-4">
          {agreements?.map((agreement) => (
            <div key={agreement?.id} className="space-y-2">
              <Checkbox
                label={agreement?.label}
                description={agreement?.description}
                checked={formData?.[agreement?.id] || false}
                onChange={handleCheckboxChange(agreement?.id)}
                error={errors?.[agreement?.id]}
                required={agreement?.required}
              />
              
              {agreement?.linkUrl && (
                <div className="ml-6">
                  <a 
                    href={agreement?.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 underline inline-flex items-center space-x-1"
                  >
                    <span>{agreement?.linkText}</span>
                    <Icon name="ExternalLink" size={14} />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} color="#D97706" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">
              Important Notice
            </h4>
            <p className="text-sm text-yellow-700">
              {formData?.userType === 'provider' ?'Provider accounts require verification before you can create resource listings. You\'ll receive verification instructions via email after registration.'
                : 'Your account will be activated immediately after registration. You can start searching for resources right away.'
              }
            </p>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          By registering, you acknowledge that you have read and understood our policies. 
          You can update your notification preferences anytime in your account settings.
        </p>
      </div>
    </div>
  );
};

export default TermsAndAgreements;