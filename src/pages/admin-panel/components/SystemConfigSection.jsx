import React, { useState, useEffect } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import Input from '../../../components/ui/ui-components/Input';
import Select from '../../../components/ui/ui-components/Select';
import { Checkbox } from '../../../components/ui/ui-components/Checkbox';

const mockConfig = {
  general: {
    siteName: 'NeighborlyUnion',
    siteDescription: 'Connecting communities, one resource at a time.',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    moderationEnabled: true
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    adminAlerts: true,
    userWelcomeEmail: true,
    resourceVerificationEmail: true,
    weeklyDigest: true
  },
  verification: {
    autoVerifyProviders: false,
    requirePhoneVerification: true,
    requireAddressVerification: true,
    verificationExpiryDays: 365,
    maxUnverifiedDays: 30
  },
  integrations: {
    googleMapsEnabled: true,
    googleMapsApiKey: 'AIza***************',
    analyticsEnabled: true,
    analyticsId: 'GA4-***********',
    emailService: 'sendgrid',
    smsService: 'twilio',
    storageService: 'aws-s3'
  },
  security: {
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChars: true,
    enableTwoFactor: false,
    ipWhitelisting: false,
    rateLimiting: true
  },
  content: {
    maxResourceImages: 5,
    maxImageSize: 5,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf'],
    autoModeration: true,
    profanityFilter: true,
    requireReviewApproval: true
  }
};

const SystemConfigSection = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('general');

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConfig(mockConfig);
      } catch (error) {
        console.error('Error loading config:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleConfigChange = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [key]: value
      }
    }));
  };

  const handleSaveConfig = async () => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Error saving configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetSection = (section) => {
    if (confirm(`Reset ${section} settings to default values?`)) {
      // In real app, this would fetch default values from API
      alert(`${section} settings reset to defaults`);
    }
  };

  const sections = [
    { id: 'general', label: 'General Settings', icon: 'Settings' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'verification', label: 'Verification', icon: 'CheckCircle' },
    { id: 'integrations', label: 'Integrations', icon: 'Link' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'content', label: 'Content Policy', icon: 'FileText' }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Site Name</label>
          <Input
            value={config?.general?.siteName || ''}
            onChange={(e) => handleConfigChange('general', 'siteName', e?.target?.value)}
            placeholder="Site name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Site Description</label>
          <Input
            value={config?.general?.siteDescription || ''}
            onChange={(e) => handleConfigChange('general', 'siteDescription', e?.target?.value)}
            placeholder="Site description"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
          <div>
            <div className="font-medium text-accent-foreground">Maintenance Mode</div>
            <div className="text-sm text-accent-foreground/80">Temporarily disable public access</div>
          </div>
          <Checkbox
            checked={config?.general?.maintenanceMode || false}
            onChange={(checked) => handleConfigChange('general', 'maintenanceMode', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
          <div>
            <div className="font-medium text-accent-foreground">Registration Enabled</div>
            <div className="text-sm text-accent-foreground/80">Allow new user registrations</div>
          </div>
          <Checkbox
            checked={config?.general?.registrationEnabled || false}
            onChange={(checked) => handleConfigChange('general', 'registrationEnabled', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
          <div>
            <div className="font-medium text-accent-foreground">Email Verification Required</div>
            <div className="text-sm text-accent-foreground/80">Require email verification for new accounts</div>
          </div>
          <Checkbox
            checked={config?.general?.emailVerificationRequired || false}
            onChange={(checked) => handleConfigChange('general', 'emailVerificationRequired', checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      {Object?.entries(config?.notifications || {})?.map(([key, value]) => (
        <div key={key} className="flex items-center justify-between p-4 bg-accent rounded-lg">
          <div>
            <div className="font-medium text-accent-foreground capitalize">
              {key?.replace(/([A-Z])/g, ' $1')?.trim()}
            </div>
            <div className="text-sm text-accent-foreground/80">
              {key === 'emailNotifications' && 'Enable email notifications system-wide'}
              {key === 'smsNotifications' && 'Enable SMS notifications for critical alerts'}
              {key === 'pushNotifications' && 'Enable browser push notifications'}
              {key === 'adminAlerts' && 'Send alerts to administrators'}
              {key === 'userWelcomeEmail' && 'Send welcome email to new users'}
              {key === 'resourceVerificationEmail' && 'Email notifications for resource verification'}
              {key === 'weeklyDigest' && 'Send weekly digest emails to users'}
            </div>
          </div>
          <Checkbox
            checked={value}
            onChange={(checked) => handleConfigChange('notifications', key, checked)}
          />
        </div>
      ))}
    </div>
  );

  const renderVerificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Verification Expiry (Days)</label>
          <Input
            type="number"
            value={config?.verification?.verificationExpiryDays || ''}
            onChange={(e) => handleConfigChange('verification', 'verificationExpiryDays', parseInt(e?.target?.value))}
            placeholder="365"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Max Unverified Days</label>
          <Input
            type="number"
            value={config?.verification?.maxUnverifiedDays || ''}
            onChange={(e) => handleConfigChange('verification', 'maxUnverifiedDays', parseInt(e?.target?.value))}
            placeholder="30"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
          <div>
            <div className="font-medium text-accent-foreground">Auto-Verify Providers</div>
            <div className="text-sm text-accent-foreground/80">Automatically verify new provider accounts</div>
          </div>
          <Checkbox
            checked={config?.verification?.autoVerifyProviders || false}
            onChange={(checked) => handleConfigChange('verification', 'autoVerifyProviders', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
          <div>
            <div className="font-medium text-accent-foreground">Require Phone Verification</div>
            <div className="text-sm text-accent-foreground/80">Require phone number verification</div>
          </div>
          <Checkbox
            checked={config?.verification?.requirePhoneVerification || false}
            onChange={(checked) => handleConfigChange('verification', 'requirePhoneVerification', checked)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
          <div>
            <div className="font-medium text-accent-foreground">Require Address Verification</div>
            <div className="text-sm text-accent-foreground/80">Require address verification for providers</div>
          </div>
          <Checkbox
            checked={config?.verification?.requireAddressVerification || false}
            onChange={(checked) => handleConfigChange('verification', 'requireAddressVerification', checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-accent rounded-lg p-4">
          <h4 className="font-medium text-accent-foreground mb-3">Google Maps Integration</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-accent-foreground">Enable Google Maps</span>
              <Checkbox
                checked={config?.integrations?.googleMapsEnabled || false}
                onChange={(checked) => handleConfigChange('integrations', 'googleMapsEnabled', checked)}
              />
            </div>
            <Input
              value={config?.integrations?.googleMapsApiKey || ''}
              onChange={(e) => handleConfigChange('integrations', 'googleMapsApiKey', e?.target?.value)}
              placeholder="Google Maps API Key"
              type="password"
            />
          </div>
        </div>

        <div className="bg-accent rounded-lg p-4">
          <h4 className="font-medium text-accent-foreground mb-3">Analytics Integration</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-accent-foreground">Enable Analytics</span>
              <Checkbox
                checked={config?.integrations?.analyticsEnabled || false}
                onChange={(checked) => handleConfigChange('integrations', 'analyticsEnabled', checked)}
              />
            </div>
            <Input
              value={config?.integrations?.analyticsId || ''}
              onChange={(e) => handleConfigChange('integrations', 'analyticsId', e?.target?.value)}
              placeholder="Analytics ID"
            />
          </div>
        </div>

        <div className="bg-accent rounded-lg p-4">
          <h4 className="font-medium text-accent-foreground mb-3">Service Providers</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-accent-foreground mb-2">Email Service</label>
              <Select
                value={config?.integrations?.emailService || ''}
                onChange={(e) => handleConfigChange('integrations', 'emailService', e?.target?.value)}
              >
                <option value="sendgrid">SendGrid</option>
                <option value="mailgun">Mailgun</option>
                <option value="ses">Amazon SES</option>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm text-accent-foreground mb-2">SMS Service</label>
              <Select
                value={config?.integrations?.smsService || ''}
                onChange={(e) => handleConfigChange('integrations', 'smsService', e?.target?.value)}
              >
                <option value="twilio">Twilio</option>
                <option value="vonage">Vonage</option>
                <option value="aws-sns">AWS SNS</option>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm text-accent-foreground mb-2">Storage Service</label>
              <Select
                value={config?.integrations?.storageService || ''}
                onChange={(e) => handleConfigChange('integrations', 'storageService', e?.target?.value)}
              >
                <option value="aws-s3">AWS S3</option>
                <option value="google-cloud">Google Cloud</option>
                <option value="azure">Azure Blob</option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Session Timeout (Hours)</label>
          <Input
            type="number"
            value={config?.security?.sessionTimeout || ''}
            onChange={(e) => handleConfigChange('security', 'sessionTimeout', parseInt(e?.target?.value))}
            placeholder="24"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Max Login Attempts</label>
          <Input
            type="number"
            value={config?.security?.maxLoginAttempts || ''}
            onChange={(e) => handleConfigChange('security', 'maxLoginAttempts', parseInt(e?.target?.value))}
            placeholder="5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Password Min Length</label>
          <Input
            type="number"
            value={config?.security?.passwordMinLength || ''}
            onChange={(e) => handleConfigChange('security', 'passwordMinLength', parseInt(e?.target?.value))}
            placeholder="8"
          />
        </div>
      </div>

      <div className="space-y-4">
        {Object?.entries(config?.security || {})?.filter(([key]) => typeof config?.security?.[key] === 'boolean')?.map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <div className="font-medium text-accent-foreground capitalize">
                {key?.replace(/([A-Z])/g, ' $1')?.trim()}
              </div>
              <div className="text-sm text-accent-foreground/80">
                {key === 'requireSpecialChars' && 'Require special characters in passwords'}
                {key === 'enableTwoFactor' && 'Enable two-factor authentication'}
                {key === 'ipWhitelisting' && 'Enable IP address whitelisting'}
                {key === 'rateLimiting' && 'Enable API rate limiting'}
              </div>
            </div>
            <Checkbox
              checked={value}
              onChange={(checked) => handleConfigChange('security', key, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderContentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Max Resource Images</label>
          <Input
            type="number"
            value={config?.content?.maxResourceImages || ''}
            onChange={(e) => handleConfigChange('content', 'maxResourceImages', parseInt(e?.target?.value))}
            placeholder="5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Max Image Size (MB)</label>
          <Input
            type="number"
            value={config?.content?.maxImageSize || ''}
            onChange={(e) => handleConfigChange('content', 'maxImageSize', parseInt(e?.target?.value))}
            placeholder="5"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Allowed File Types</label>
        <div className="flex flex-wrap gap-2">
          {['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']?.map(type => (
            <label key={type} className="flex items-center space-x-2">
              <Checkbox
                checked={config?.content?.allowedFileTypes?.includes(type)}
                onChange={(checked) => {
                  const current = config?.content?.allowedFileTypes || [];
                  const updated = checked 
                    ? [...current, type]
                    : current?.filter(t => t !== type);
                  handleConfigChange('content', 'allowedFileTypes', updated);
                }}
              />
              <span className="text-sm text-foreground">{type?.toUpperCase()}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {['autoModeration', 'profanityFilter', 'requireReviewApproval']?.map(key => (
          <div key={key} className="flex items-center justify-between p-4 bg-accent rounded-lg">
            <div>
              <div className="font-medium text-accent-foreground capitalize">
                {key?.replace(/([A-Z])/g, ' $1')?.trim()}
              </div>
              <div className="text-sm text-accent-foreground/80">
                {key === 'autoModeration' && 'Automatically moderate user-generated content'}
                {key === 'profanityFilter' && 'Filter inappropriate language'}
                {key === 'requireReviewApproval' && 'Require admin approval for reviews'}
              </div>
            </div>
            <Checkbox
              checked={config?.content?.[key] || false}
              onChange={(checked) => handleConfigChange('content', key, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">System Configuration</h2>
          <p className="text-muted-foreground">Manage platform settings and integrations</p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => handleResetSection(activeSection)}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset Section
          </Button>
          <Button
            onClick={handleSaveConfig}
            disabled={saving}
            iconName={saving ? "Loader" : "Save"}
            iconPosition="left"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {sections?.map((section) => (
          <button
            key={section?.id}
            onClick={() => setActiveSection(section?.id)}
            className={`flex items-center space-x-2 p-3 rounded-lg transition-smooth ${
              activeSection === section?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <Icon name={section?.icon} size={16} />
            <span className="font-medium text-sm">{section?.label}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="bg-card border border-border rounded-lg p-6">
        {activeSection === 'general' && renderGeneralSettings()}
        {activeSection === 'notifications' && renderNotificationSettings()}
        {activeSection === 'verification' && renderVerificationSettings()}
        {activeSection === 'integrations' && renderIntegrationSettings()}
        {activeSection === 'security' && renderSecuritySettings()}
        {activeSection === 'content' && renderContentSettings()}
      </div>
    </div>
  );
};

export default SystemConfigSection;