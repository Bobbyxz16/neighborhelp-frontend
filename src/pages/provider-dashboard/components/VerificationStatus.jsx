import React from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';



const VerificationStatus = ({ verificationData, onUpdateDocuments }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'expired': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'rejected': return 'XCircle';
      case 'expired': return 'AlertTriangle';
      default: return 'HelpCircle';
    }
  };

  const verificationItems = [
    {
      title: 'Organization Registration',
      description: 'Legal business registration documents',
      status: verificationData?.organizationStatus,
      expiryDate: verificationData?.organizationExpiry,
      required: true,
      alwaysShowUpload: true
    },
    {
      title: 'Tax Exemption Certificate',
      description: '501(c)(3) or equivalent tax-exempt status',
      status: verificationData?.taxExemptStatus,
      expiryDate: verificationData?.taxExemptExpiry,
      required: verificationData?.organizationType === 'nonprofit'
    },
    {
      title: 'Professional License',
      description: 'Professional credentials for specialized services',
      status: verificationData?.licenseStatus,
      expiryDate: verificationData?.licenseExpiry,
      required: verificationData?.requiresLicense
    },
    {
      title: 'Background Check',
      description: 'Criminal background verification',
      status: verificationData?.backgroundStatus,
      expiryDate: verificationData?.backgroundExpiry,
      required: true,
      alwaysShowUpload: true
    }
  ];

  const getOverallStatus = () => {
    const requiredItems = verificationItems?.filter(item => item?.required);
    const verifiedItems = requiredItems?.filter(item => item?.status === 'verified');
    
    if (verifiedItems?.length === requiredItems?.length) {
      return { status: 'verified', message: 'Fully Verified Provider' };
    } else if (verifiedItems?.length > 0) {
      return { status: 'partial', message: 'Partially Verified' };
    } else {
      return { status: 'unverified', message: 'Verification Required' };
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 border border-border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Verification Status</h2>
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${getStatusColor(overallStatus?.status)}`}>
            <Icon name={getStatusIcon(overallStatus?.status)} size={16} />
            <span className="text-sm font-medium">{overallStatus?.message}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {verificationItems?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${getStatusColor(item?.status)}`}>
                  <Icon name={getStatusIcon(item?.status)} size={16} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-foreground">{item?.title}</h4>
                    {item?.required && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item?.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {item?.status === 'rejected' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Upload"
                    iconPosition="left"
                    onClick={() => onUpdateDocuments(item?.title)}
                  >
                    Resubmit
                  </Button>
                )}
                {item?.status === 'expired' && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RefreshCw"
                    iconPosition="left"
                    onClick={() => onUpdateDocuments(item?.title)}
                  >
                    Renew
                  </Button>
                )}
                {(item?.status === 'pending' || item?.status === 'unverified' || item?.alwaysShowUpload) && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Upload"
                    iconPosition="left"
                    onClick={() => onUpdateDocuments(item?.title)}
                  >
                    Upload
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {overallStatus?.status !== 'verified' && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  Complete Your Verification
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  Verified providers receive a trust badge and appear higher in search results. 
                  Complete all required verifications to build community trust.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationStatus;