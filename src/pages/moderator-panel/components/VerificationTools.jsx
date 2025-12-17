import React, { useState } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';

const VerificationTools = () => {
  const [activeToolTab, setActiveToolTab] = useState('checklist');

  // Mock verification checklist items
  const verificationChecklist = [
    {
      category: 'Basic Information',
      items: [
        { id: 1, text: 'Organization name is clearly stated', required: true },
        { id: 2, text: 'Contact information is complete and valid', required: true },
        { id: 3, text: 'Physical address is provided and verifiable', required: true },
        { id: 4, text: 'Service description is clear and detailed', required: true }
      ]
    },
    {
      category: 'Legal Compliance',
      items: [
        { id: 5, text: 'Organization is legally registered', required: true },
        { id: 6, text: 'Required licenses are current and valid', required: true },
        { id: 7, text: 'Tax-exempt status verified (if applicable)', required: false },
        { id: 8, text: 'Insurance documentation provided', required: false }
      ]
    },
    {
      category: 'Service Details',
      items: [
        { id: 9, text: 'Eligibility criteria are clearly defined', required: true },
        { id: 10, text: 'Operating hours and schedule are accurate', required: true },
        { id: 11, text: 'Capacity limitations are specified', required: true },
        { id: 12, text: 'Application/intake process is explained', required: true }
      ]
    },
    {
      category: 'Quality Standards',
      items: [
        { id: 13, text: 'Staff qualifications are documented', required: false },
        { id: 14, text: 'Safety protocols are in place', required: true },
        { id: 15, text: 'Complaint handling process exists', required: false },
        { id: 16, text: 'Regular service evaluation conducted', required: false }
      ]
    }
  ];

  // Mock automated checks results
  const automatedChecks = [
    {
      checkName: 'Contact Information Validation',
      status: 'passed',
      details: 'Phone number and email are reachable and valid',
      timestamp: '2024-11-02T10:15:00Z'
    },
    {
      checkName: 'Address Verification',
      status: 'passed',
      details: 'Address exists and is accessible via mapping services',
      timestamp: '2024-11-02T10:16:00Z'
    },
    {
      checkName: 'Website Security Check',
      status: 'warning',
      details: 'SSL certificate expires in 30 days',
      timestamp: '2024-11-02T10:17:00Z'
    },
    {
      checkName: 'Content Moderation Scan',
      status: 'passed',
      details: 'No inappropriate content detected',
      timestamp: '2024-11-02T10:18:00Z'
    },
    {
      checkName: 'Duplicate Service Check',
      status: 'failed',
      details: 'Similar service found within 0.5 miles - requires manual review',
      timestamp: '2024-11-02T10:19:00Z'
    }
  ];

  // Mock policy compliance items
  const policyCompliance = [
    {
      policyName: 'Community Standards',
      status: 'compliant',
      lastReview: '2024-10-15T00:00:00Z',
      issues: []
    },
    {
      policyName: 'Data Privacy Policy',
      status: 'compliant',
      lastReview: '2024-10-20T00:00:00Z',
      issues: []
    },
    {
      policyName: 'Non-Discrimination Policy',
      status: 'review_needed',
      lastReview: '2024-09-30T00:00:00Z',
      issues: ['Eligibility criteria may be too restrictive']
    },
    {
      policyName: 'Accessibility Standards',
      status: 'partially_compliant',
      lastReview: '2024-10-25T00:00:00Z',
      issues: ['Physical accessibility not clearly documented', 'No mention of language interpretation services']
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': case'compliant':
        return { icon: 'CheckCircle', color: 'text-green-600' };
      case 'warning': case'partially_compliant':
        return { icon: 'AlertTriangle', color: 'text-yellow-600' };
      case 'failed': case'review_needed':
        return { icon: 'XCircle', color: 'text-red-600' };
      default:
        return { icon: 'HelpCircle', color: 'text-gray-600' };
    }
  };

  const toolTabs = [
    { id: 'checklist', label: 'Verification Checklist', icon: 'CheckSquare' },
    { id: 'automated', label: 'Automated Checks', icon: 'Zap' },
    { id: 'policy', label: 'Policy Compliance', icon: 'Shield' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Verification Tools</h2>
        <Button variant="outline" iconName="Download">
          Export Report
        </Button>
      </div>
      {/* Tool Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {toolTabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveToolTab(tab?.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth ${
                activeToolTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </nav>
      </div>
      {/* Verification Checklist */}
      {activeToolTab === 'checklist' && (
        <div className="space-y-6">
          {verificationChecklist?.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
              <h3 className="text-lg font-medium text-foreground mb-4">{category?.category}</h3>
              <div className="space-y-3">
                {category?.items?.map((item) => (
                  <div key={item?.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id={`item-${item?.id}`}
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    />
                    <label
                      htmlFor={`item-${item?.id}`}
                      className="flex-1 text-sm text-foreground cursor-pointer"
                    >
                      {item?.text}
                      {item?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" iconName="MessageSquare">
                        Note
                      </Button>
                      {item?.required && (
                        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center space-x-4">
            <Button variant="default" iconName="Save">
              Save Progress
            </Button>
            <Button variant="outline" iconName="RotateCcw">
              Reset Checklist
            </Button>
          </div>
        </div>
      )}
      {/* Automated Checks */}
      {activeToolTab === 'automated' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Automated verification checks run every time a resource is submitted or updated.
            </p>
            <Button variant="outline" iconName="RefreshCw">
              Run All Checks
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {automatedChecks?.map((check, index) => {
              const statusConfig = getStatusIcon(check?.status);
              return (
                <div key={index} className="bg-card rounded-lg p-4 shadow-elevation-1 border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-foreground">{check?.checkName}</h4>
                    <Icon name={statusConfig?.icon} size={20} className={statusConfig?.color} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{check?.details}</p>
                  <p className="text-xs text-muted-foreground">
                    Last run: {new Date(check?.timestamp)?.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2 mt-3">
                    <Button variant="ghost" size="sm" iconName="RotateCcw">
                      Re-run
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Eye">
                      Details
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Policy Compliance */}
      {activeToolTab === 'policy' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Review compliance with platform policies and community standards.
          </p>
          
          <div className="space-y-4">
            {policyCompliance?.map((policy, index) => {
              const statusConfig = getStatusIcon(policy?.status);
              return (
                <div key={index} className="bg-card rounded-lg p-6 shadow-elevation-1 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-foreground">{policy?.policyName}</h4>
                      <p className="text-sm text-muted-foreground">
                        Last reviewed: {new Date(policy?.lastReview)?.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Icon name={statusConfig?.icon} size={20} className={statusConfig?.color} />
                      <span className={`text-sm font-medium ${statusConfig?.color}`}>
                        {policy?.status?.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                  {policy?.issues?.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-foreground">Issues:</h5>
                      {policy?.issues?.map((issue, issueIndex) => (
                        <div key={issueIndex} className="flex items-start space-x-2 text-sm text-orange-600">
                          <Icon name="AlertTriangle" size={16} className="mt-0.5" />
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center space-x-2 mt-4">
                    <Button variant="ghost" size="sm" iconName="Eye">
                      View Policy
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Edit">
                      Update Review
                    </Button>
                    {policy?.status !== 'compliant' && (
                      <Button variant="ghost" size="sm" iconName="AlertTriangle" className="text-orange-600">
                        Flag for Review
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationTools;