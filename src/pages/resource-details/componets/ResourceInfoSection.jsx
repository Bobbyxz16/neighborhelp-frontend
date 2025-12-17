import React, { useState } from 'react';
import Icon from '../../../components/ui/AppIcon';
import { RESOURCE_COST_LABELS } from '../../../utils/constants';

const ResourceInfoSection = ({ resource }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description', icon: 'FileText' },
    /*{ id: 'requirements', label: 'Requirements', icon: 'AlertCircle' },*/
    { id: 'cost', label: 'Cost Information', icon: 'DollarSign' }
  ];

  const renderTabContent = () => {
    // Parse additionalNotes for cost details
    let displayNotes = resource?.additionalNotes || '';
    let costDetails = '';

    if (displayNotes.includes('[COST_DETAILS]')) {
      const parts = displayNotes.split('[COST_DETAILS]');
      displayNotes = parts[0].trim();
      costDetails = parts[1].trim();
    }

    switch (activeTab) {
      case 'description':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-foreground mb-3">About This Resource</h4>
              <p className="text-foreground leading-relaxed">{resource?.description}</p>
            </div>

            {displayNotes && (
              <div className="mt-4 p-4 bg-accent rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-accent-foreground mt-0.5" />
                  <div className="text-sm text-accent-foreground">
                    <p className="font-medium mb-1">Additional Information:</p>
                    <p>{displayNotes}</p>
                  </div>
                </div>
              </div>
            )}

            {resource?.availability && (
              <div>
                <h4 className="font-semibold text-foreground mb-2">Availability</h4>
                <p className="text-muted-foreground">{resource?.availability}</p>
              </div>
            )}
          </div>
        );

      case 'requirements':
        return (
          <div className="space-y-4">
            {resource?.requirements ? (
              <div>
                <h4 className="font-semibold text-foreground mb-3">Eligibility & Requirements</h4>
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground whitespace-pre-line">{resource?.requirements}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="CheckCircle" size={48} className="text-green-500 mx-auto mb-3" />
                <p className="text-muted-foreground">No specific requirements listed. Contact the resource for more information.</p>
              </div>
            )}

            {resource?.requirements && (
              <div className="mt-4 p-4 bg-accent rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-accent-foreground mt-0.5" />
                  <div className="text-sm text-accent-foreground">
                    <p className="font-medium">Important Note:</p>
                    <p>Requirements may vary. Please contact the resource directly to confirm eligibility.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'cost':
        return (
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground mb-3">Cost Information</h4>
            <div className={`p-4 rounded-lg border ${resource?.cost === 'FREE'
              ? 'bg-green-50 border-green-200'
              : resource?.cost === 'LOW_COST'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-yellow-50 border-yellow-200'
              }`}>
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="DollarSign" size={16} className={
                  resource?.cost === 'FREE'
                    ? 'text-green-600'
                    : resource?.cost === 'LOW_COST'
                      ? 'text-blue-600'
                      : 'text-yellow-600'
                } />
                <span className={`font-medium ${resource?.cost === 'FREE'
                  ? 'text-green-800'
                  : resource?.cost === 'LOW_COST'
                    ? 'text-blue-800'
                    : 'text-yellow-800'
                  }`}>
                  {RESOURCE_COST_LABELS[resource?.cost] || resource?.cost}
                </span>
              </div>

              {/* Display parsed cost details if available */}
              {costDetails && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>{costDetails}</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-semibold text-foreground mb-6">Resource Information</h3>

      {/* Tab Navigation */}
      <div className="border-b border-border mb-6">
        <nav className="flex space-x-8">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 py-3 px-1 border-b-2 transition-smooth ${activeTab === tab?.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="font-medium">{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[200px]">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ResourceInfoSection;