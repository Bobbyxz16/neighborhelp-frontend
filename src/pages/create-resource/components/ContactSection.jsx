import React from 'react';
import Input from '../../../components/ui/ui-components/Input';
import Select from '../../../components/ui/ui-components/Select';
import { Checkbox, CheckboxGroup } from '../../../components/ui/ui-components/Checkbox';
import Icon from '../../../components/ui/AppIcon';

const ContactSection = ({ formData, onChange, errors }) => {
  const responseTimeOptions = [
    { value: 'immediate', label: 'Within 1 hour', description: 'For urgent inquiries' },
    { value: 'same-day', label: 'Same day', description: 'Within 24 hours' },
    { value: '1-2-days', label: '1-2 business days', description: 'Standard response time' },
    { value: '3-5-days', label: '3-5 business days', description: 'For complex requests' },
    { value: 'weekly', label: 'Within a week', description: 'For non-urgent matters' }
  ];

  const preferredContactMethods = [
    { id: 'phone', label: 'Phone Call', icon: 'Phone' },
    { id: 'email', label: 'Email', icon: 'Mail' },
    { id: 'text', label: 'Text Message', icon: 'MessageSquare' },
    { id: 'website', label: 'Website Form', icon: 'Globe' },
    { id: 'in-person', label: 'In Person', icon: 'Users' }
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  const handleContactMethodToggle = (methodId) => {
    const currentMethods = formData?.preferredContactMethods || [];
    const updatedMethods = currentMethods?.includes(methodId)
      ? currentMethods?.filter(method => method !== methodId)
      : [...currentMethods, methodId];
    
    handleInputChange('preferredContactMethods', updatedMethods);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Provide ways for people to reach you and set communication preferences
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Input
            label="Primary Contact Name"
            type="text"
            placeholder="Contact person's full name"
            value={formData?.contactName}
            onChange={(e) => handleInputChange('contactName', e?.target?.value)}
            error={errors?.contactName}
            required
            description="Person responsible for inquiries"
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData?.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e?.target?.value)}
            error={errors?.phoneNumber}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="contact@organization.org"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />

          <Input
            label="Website (Optional)"
            type="url"
            placeholder="https://www.yourorganization.org"
            value={formData?.website}
            onChange={(e) => handleInputChange('website', e?.target?.value)}
            description="Link to your organization's website"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Preferred Contact Methods <span className="text-destructive">*</span>
            </label>
            <CheckboxGroup error={errors?.preferredContactMethods}>
              <div className="grid grid-cols-1 gap-2">
                {preferredContactMethods?.map((method) => (
                  <div key={method?.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent transition-smooth">
                    <Checkbox
                      checked={(formData?.preferredContactMethods || [])?.includes(method?.id)}
                      onChange={() => handleContactMethodToggle(method?.id)}
                    />
                    <Icon name={method?.icon} size={16} color="var(--color-muted-foreground)" />
                    <span className="text-sm font-medium text-foreground">{method?.label}</span>
                  </div>
                ))}
              </div>
            </CheckboxGroup>
          </div>
        </div>

        <div className="space-y-6">
          <Select
            label="Response Time Commitment"
            placeholder="Select expected response time"
            options={responseTimeOptions}
            value={formData?.responseTime}
            onChange={(value) => handleInputChange('responseTime', value)}
            error={errors?.responseTime}
            required
            description="How quickly can you typically respond to inquiries?"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Best Times to Contact
            </label>
            <textarea
              className="w-full h-20 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
              placeholder="e.g., Weekdays 9 AM - 5 PM, Avoid calling during lunch hours (12-1 PM)"
              value={formData?.contactHours}
              onChange={(e) => handleInputChange('contactHours', e?.target?.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Special Contact Instructions
            </label>
            <textarea
              className="w-full h-24 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
              placeholder="Any specific instructions for contacting you (e.g., mention NeighborlyUnion, ask for specific person, use subject line format)"
              value={formData?.contactInstructions}
              onChange={(e) => handleInputChange('contactInstructions', e?.target?.value)}
            />
          </div>

          <div className="space-y-4">
            <Checkbox
              label="Emergency Contact Available"
              description="Can people contact you for urgent/emergency situations?"
              checked={formData?.emergencyContact}
              onChange={(e) => handleInputChange('emergencyContact', e?.target?.checked)}
            />

            {formData?.emergencyContact && (
              <div className="bg-accent rounded-lg p-4 space-y-3">
                <Input
                  label="Emergency Phone"
                  type="tel"
                  placeholder="Emergency contact number"
                  value={formData?.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e?.target?.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-accent-foreground mb-1">
                    Emergency Contact Hours
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    placeholder="e.g., 24/7, Weekends only, After 6 PM"
                    value={formData?.emergencyHours}
                    onChange={(e) => handleInputChange('emergencyHours', e?.target?.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-accent rounded-lg p-4">
            <h3 className="font-medium text-accent-foreground mb-2 flex items-center">
              <Icon name="Shield" size={16} className="mr-2" />
              Privacy & Safety
            </h3>
            <ul className="text-sm text-accent-foreground space-y-1">
              <li>• Your contact info is only shown to verified users</li>
              <li>• You can update preferences anytime</li>
              <li>• Report inappropriate contact to our team</li>
              <li>• Consider using organization email vs personal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;