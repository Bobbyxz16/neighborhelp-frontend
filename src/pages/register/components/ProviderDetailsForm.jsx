import React from 'react';
import Input from '../../../components/ui/ui-components/Input';
import Select from '../../../components/ui/ui-components/Select';
import { Checkbox } from '../../../components/ui/ui-components/Checkbox';

const ProviderDetailsForm = ({ formData, errors, onChange }) => {
  const handleInputChange = (field) => (e) => {
    onChange(field, e?.target?.value);
  };

  const handleSelectChange = (field) => (value) => {
    onChange(field, value);
  };

  const handleCheckboxChange = (field) => (e) => {
    const value = e?.target?.value;
    const currentValues = formData?.[field] || [];
    const newValues = e?.target?.checked 
      ? [...currentValues, value]
      : currentValues?.filter(v => v !== value);
    onChange(field, newValues);
  };

  const organizationTypes = [
    { value: 'nonprofit', label: 'Non-Profit Organization' },
    { value: 'religious', label: 'Religious Institution' },
    { value: 'government', label: 'Government Agency' },
    { value: 'business', label: 'Local Business' },
    { value: 'individual', label: 'Individual Volunteer' },
    { value: 'community', label: 'Community Group' }
  ];

  const serviceCategories = [
    { value: 'food', label: 'Food & Nutrition', description: 'Food banks, meal programs, grocery assistance' },
    { value: 'housing', label: 'Housing & Shelter', description: 'Emergency shelter, housing assistance, utilities' },
    { value: 'healthcare', label: 'Healthcare & Medical', description: 'Free clinics, medical care, prescriptions' },
    { value: 'legal', label: 'Legal Services', description: 'Legal aid, immigration help, court assistance' },
    { value: 'education', label: 'Education & Training', description: 'Tutoring, job training, skill development' },
    { value: 'employment', label: 'Employment Services', description: 'Job placement, resume help, career counseling' },
    { value: 'mental_health', label: 'Mental Health', description: 'Counseling, support groups, crisis intervention' },
    { value: 'transportation', label: 'Transportation', description: 'Bus passes, ride services, vehicle assistance' },
    { value: 'clothing', label: 'Clothing & Personal Items', description: 'Clothing banks, hygiene items, household goods' },
    { value: 'financial', label: 'Financial Assistance', description: 'Emergency funds, bill assistance, financial counseling' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Provider Information
        </h3>
        <p className="text-muted-foreground">
          Tell us about your organization and the services you provide
        </p>
      </div>
      <Input
        label="Organization Name"
        type="text"
        placeholder="Enter your organization name"
        description="If you're an individual volunteer, you can use your name"
        value={formData?.organizationName}
        onChange={handleInputChange('organizationName')}
        error={errors?.organizationName}
        required
      />
      <Select
        label="Organization Type"
        placeholder="Select your organization type"
        options={organizationTypes}
        value={formData?.organizationType}
        onChange={handleSelectChange('organizationType')}
        error={errors?.organizationType}
        required
      />
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Service Categories *
        </label>
        <p className="text-sm text-muted-foreground mb-4">
          Select all categories that apply to your services
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {serviceCategories?.map((category) => (
            <Checkbox
              key={category?.value}
              label={category?.label}
              description={category?.description}
              value={category?.value}
              checked={(formData?.serviceCategories || [])?.includes(category?.value)}
              onChange={handleCheckboxChange('serviceCategories')}
            />
          ))}
        </div>
        {errors?.serviceCategories && (
          <p className="text-sm text-destructive mt-2">{errors?.serviceCategories}</p>
        )}
      </div>
      <Input
        label="Service Description"
        type="text"
        placeholder="Briefly describe the services you provide"
        description="This will help people understand how you can help them"
        value={formData?.serviceDescription}
        onChange={handleInputChange('serviceDescription')}
        error={errors?.serviceDescription}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Contact Person"
          type="text"
          placeholder="Primary contact name"
          value={formData?.contactPerson}
          onChange={handleInputChange('contactPerson')}
          error={errors?.contactPerson}
          required
        />

        <Input
          label="Contact Phone"
          type="tel"
          placeholder="(555) 123-4567"
          description="Public contact number for your services"
          value={formData?.contactPhone}
          onChange={handleInputChange('contactPhone')}
          error={errors?.contactPhone}
          required
        />
      </div>
      <Input
        label="Website (Optional)"
        type="url"
        placeholder="https://your-organization.org"
        description="Link to your organization's website"
        value={formData?.website}
        onChange={handleInputChange('website')}
        error={errors?.website}
      />
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Thank you for registering</h4>
        <p className="text-sm text-blue-700">
          You've just joined a community where your items find new life and help your neighbors. By selling your products here, you're not just making space or earning extra; you're also helping someone nearby find what they need. We're thrilled to have you and can't wait to see how you'll contribute to making our neighborhood greener, closer, and more connected.
        </p>
      </div>
    </div>
  );
};

export default ProviderDetailsForm;