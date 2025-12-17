import React from 'react';
import Input from '../../../components/ui/ui-components/Input';
import Select from '../../../components/ui/ui-components/Select';

const BasicInfoSection = ({ formData, onChange, errors }) => {
  const categoryOptions = [
    { value: 'food', label: 'Food & Nutrition', description: 'Food banks, meal programs, nutrition assistance' },
    { value: 'health', label: 'Healthcare', description: 'Medical services, mental health, wellness programs' },
    { value: 'legal', label: 'Legal Aid', description: 'Legal assistance, advocacy, court support' },
    { value: 'education', label: 'Education', description: 'Tutoring, classes, educational resources' },
    { value: 'housing', label: 'Housing', description: 'Shelter, housing assistance, utilities help' },
    { value: 'employment', label: 'Employment', description: 'Job training, placement, career services' },
    { value: 'mental-health', label: 'Mental Health', description: 'Counseling, support groups, therapy' },
    { value: 'clothing', label: 'Clothing', description: 'Clothing assistance, donations, professional attire' },
    { value: 'transportation', label: 'Transportation', description: 'Transit assistance, vehicle programs, rides' }
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Provide essential details about your resource or service
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <Input
            label="Service Title"
            type="text"
            placeholder="Enter a clear, descriptive title for your service"
            value={formData?.title}
            onChange={(e) => handleInputChange('title', e?.target?.value)}
            error={errors?.title}
            required
            description="Make it specific and searchable (e.g., 'Free Weekly Food Pantry' instead of 'Food Help')"
          />
        </div>

        <Select
          label="Primary Category"
          placeholder="Select the main category"
          options={categoryOptions}
          value={formData?.category}
          onChange={(value) => handleInputChange('category', value)}
          error={errors?.category}
          required
          searchable
          description="Choose the category that best describes your service"
        />

        <Select
          label="Service Type"
          placeholder="Select service type"
          options={[
            { value: 'ongoing', label: 'Ongoing Service', description: 'Regular, continuous service' },
            { value: 'event', label: 'One-time Event', description: 'Single occurrence or limited time' },
            { value: 'seasonal', label: 'Seasonal Program', description: 'Available during specific seasons' },
            { value: 'emergency', label: 'Emergency Resource', description: 'Crisis or urgent assistance' }
          ]}
          value={formData?.serviceType}
          onChange={(value) => handleInputChange('serviceType', value)}
          error={errors?.serviceType}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Detailed Description <span className="text-destructive">*</span>
        </label>
        <textarea
          className="w-full min-h-32 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
          placeholder="Provide a comprehensive description of your service including:\n• What you offer\n• Who can benefit\n• How to access the service\n• Any special requirements or procedures"
          value={formData?.description}
          onChange={(e) => handleInputChange('description', e?.target?.value)}
          rows={6}
        />
        {errors?.description && (
          <p className="text-sm text-destructive mt-1">{errors?.description}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Minimum 50 characters. Be specific about eligibility, process, and what to expect.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Organization/Provider Name"
          type="text"
          placeholder="Your organization or individual name"
          value={formData?.providerName}
          onChange={(e) => handleInputChange('providerName', e?.target?.value)}
          error={errors?.providerName}
          required
          description="This will be displayed publicly"
        />

        <Select
          label="Provider Type"
          placeholder="Select provider type"
          options={[
            { value: 'nonprofit', label: 'Non-Profit Organization' },
            { value: 'government', label: 'Government Agency' },
            { value: 'religious', label: 'Religious Institution' },
            { value: 'business', label: 'Local Business' },
            { value: 'individual', label: 'Individual Volunteer' },
            { value: 'community', label: 'Community Group' }
          ]}
          value={formData?.providerType}
          onChange={(value) => handleInputChange('providerType', value)}
          error={errors?.providerType}
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;