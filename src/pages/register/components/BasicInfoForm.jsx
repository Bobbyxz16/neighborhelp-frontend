import React from 'react';
import Input from '../../../components/ui/ui-components/Input';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const BasicInfoForm = ({ formData, errors, onChange }) => {
  const handleInputChange = (field) => (e) => {
    onChange(field, e?.target?.value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Basic Information
        </h3>
        <p className="text-muted-foreground">
          Let's start with your basic details to create your account
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          value={formData?.firstName}
          onChange={handleInputChange('firstName')}
          error={errors?.firstName}
          required
        />

        <Input
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          value={formData?.lastName}
          onChange={handleInputChange('lastName')}
          error={errors?.lastName}
          required
        />
      </div>
      <Input
        id="email"
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        description="We'll use this to send you important updates and notifications"
        value={formData?.email}
        onChange={handleInputChange('email')}
        error={errors?.email}
        required
      />
      <div>
        <Input
          label="Password"
          type="password"
          placeholder="Create a strong password"
          description="Must be at least 8 characters with uppercase, lowercase, and numbers"
          value={formData?.password}
          onChange={handleInputChange('password')}
          error={errors?.password}
          required
        />
        <PasswordStrengthIndicator password={formData?.password} />
      </div>
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={formData?.confirmPassword}
        onChange={handleInputChange('confirmPassword')}
        error={errors?.confirmPassword}
        required
      />
      <Input
        label="Phone Number"
        type="tel"
        placeholder="(555) 123-4567"
        description="Optional - for urgent resource notifications"
        value={formData?.phone}
        onChange={handleInputChange('phone')}
        error={errors?.phone}
      />
      <Input
        label="Postal/Zip Code"
        type="text"
        placeholder="e.g., 12345 or SW1A 1AA"
        description="Enter your postal or zip code to help us show local resources in your area"
        value={formData?.zipCode}
        onChange={handleInputChange('zipCode')}
        error={errors?.zipCode}
        required
      />
    </div>
  );
};

export default BasicInfoForm;