import React from 'react';
import Input from '../../../components/ui/ui-components/Input';
import Select from '../../../components/ui/ui-components/Select';
import { Checkbox } from '../../../components/ui/ui-components/Checkbox';
import Icon from '../../../components/ui/AppIcon';

const CostSection = ({ formData, onChange, errors }) => {
  const costTypeOptions = [
    { value: 'free', label: 'Completely Free', description: 'No cost to users' },
    { value: 'sliding-scale', label: 'Sliding Scale', description: 'Cost based on income' },
    { value: 'fixed-fee', label: 'Fixed Fee', description: 'Same cost for everyone' },
    { value: 'donation-based', label: 'Donation Based', description: 'Suggested donation' },
    { value: 'insurance-covered', label: 'Insurance Covered', description: 'Covered by insurance' },
    { value: 'varies', label: 'Cost Varies', description: 'Depends on service type' }
  ];

  const paymentMethodOptions = [
    { id: 'cash', label: 'Cash', icon: 'DollarSign' },
    { id: 'check', label: 'Check', icon: 'FileText' },
    { id: 'card', label: 'Credit/Debit Card', icon: 'CreditCard' },
    { id: 'online', label: 'Online Payment', icon: 'Globe' },
    { id: 'insurance', label: 'Insurance', icon: 'Shield' },
    { id: 'voucher', label: 'Vouchers/Assistance', icon: 'Ticket' }
  ];

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  const handlePaymentMethodToggle = (methodId) => {
    const currentMethods = formData?.acceptedPaymentMethods || [];
    const updatedMethods = currentMethods?.includes(methodId)
      ? currentMethods?.filter(method => method !== methodId)
      : [...currentMethods, methodId];
    
    handleInputChange('acceptedPaymentMethods', updatedMethods);
  };

  const showCostDetails = formData?.costType && formData?.costType !== 'free';
  const showPaymentMethods = showCostDetails && formData?.costType !== 'insurance-covered';

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-foreground">Cost & Payment Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Specify pricing and payment options for your service
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Select
            label="Cost Structure"
            placeholder="Select cost type"
            options={costTypeOptions}
            value={formData?.costType}
            onChange={(value) => handleInputChange('costType', value)}
            error={errors?.costType}
            required
          />

          {showCostDetails && (
            <div className="space-y-4">
              {formData?.costType === 'fixed-fee' && (
                <Input
                  label="Service Fee"
                  type="number"
                  min={0}
                  placeholder="0.00"
                  value={formData?.fixedFee}
                  onChange={(e) => handleInputChange('fixedFee', e?.target?.value)}
                  error={errors?.fixedFee}
                  description="Enter amount in GBP (£)"
                />
              )}

              {formData?.costType === 'sliding-scale' && (
                <div className="bg-accent rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Minimum Fee"
                      type="number"
                      min={0}
                      placeholder="0.00"
                      value={formData?.minFee}
                      onChange={(e) => handleInputChange('minFee', e?.target?.value)}
                    />
                    <Input
                      label="Maximum Fee"
                      type="number"
                      min={0}
                      placeholder="100.00"
                      value={formData?.maxFee}
                      onChange={(e) => handleInputChange('maxFee', e?.target?.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-accent-foreground mb-1">
                      Sliding Scale Details
                    </label>
                    <textarea
                      className="w-full h-16 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                      placeholder="Explain how fees are determined based on income"
                      value={formData?.slidingScaleDetails}
                      onChange={(e) => handleInputChange('slidingScaleDetails', e?.target?.value)}
                    />
                  </div>
                </div>
              )}

              {formData?.costType === 'donation-based' && (
                <div className="bg-accent rounded-lg p-4 space-y-3">
                  <Input
                    label="Suggested Donation"
                    type="number"
                    min={0}
                    placeholder="10.00"
                    value={formData?.suggestedDonation}
                    onChange={(e) => handleInputChange('suggestedDonation', e?.target?.value)}
                    description="Optional suggested amount"
                  />
                  <div>
                    <label className="block text-sm font-medium text-accent-foreground mb-1">
                      Donation Information
                    </label>
                    <textarea
                      className="w-full h-16 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                      placeholder="Explain how donations help and that they're optional"
                      value={formData?.donationInfo}
                      onChange={(e) => handleInputChange('donationInfo', e?.target?.value)}
                    />
                  </div>
                </div>
              )}

              {formData?.costType === 'varies' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Cost Details
                  </label>
                  <textarea
                    className="w-full h-24 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                    placeholder="Explain different costs for different services or circumstances"
                    value={formData?.costDetails}
                    onChange={(e) => handleInputChange('costDetails', e?.target?.value)}
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Checkbox
              label="Financial Assistance Available"
              description="Help available for those who cannot afford full cost"
              checked={formData?.hasFinancialAssistance}
              onChange={(e) => handleInputChange('hasFinancialAssistance', e?.target?.checked)}
            />

            {formData?.hasFinancialAssistance && (
              <div className="bg-accent rounded-lg p-4">
                <label className="block text-sm font-medium text-accent-foreground mb-2">
                  Financial Assistance Details
                </label>
                <textarea
                  className="w-full h-20 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                  placeholder="Describe available assistance programs, scholarships, or payment plans"
                  value={formData?.financialAssistanceDetails}
                  onChange={(e) => handleInputChange('financialAssistanceDetails', e?.target?.value)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {showPaymentMethods && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Accepted Payment Methods
              </label>
              <div className="space-y-2">
                {paymentMethodOptions?.map((method) => (
                  <div key={method?.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent transition-smooth">
                    <Checkbox
                      checked={(formData?.acceptedPaymentMethods || [])?.includes(method?.id)}
                      onChange={() => handlePaymentMethodToggle(method?.id)}
                    />
                    <Icon name={method?.icon} size={16} color="var(--color-muted-foreground)" />
                    <span className="text-sm font-medium text-foreground">{method?.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Checkbox
              label="Refund Policy Available"
              description="You have a refund or cancellation policy"
              checked={formData?.hasRefundPolicy}
              onChange={(e) => handleInputChange('hasRefundPolicy', e?.target?.checked)}
            />

            {formData?.hasRefundPolicy && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Refund Policy Details
                </label>
                <textarea
                  className="w-full h-20 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                  placeholder="Explain your refund and cancellation policy"
                  value={formData?.refundPolicy}
                  onChange={(e) => handleInputChange('refundPolicy', e?.target?.value)}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Additional Cost Information
            </label>
            <textarea
              className="w-full h-24 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
              placeholder="Any other important cost-related information (hidden fees, what's included, etc.)"
              value={formData?.additionalCostInfo}
              onChange={(e) => handleInputChange('additionalCostInfo', e?.target?.value)}
            />
          </div>

          <div className="bg-accent rounded-lg p-4">
            <h3 className="font-medium text-accent-foreground mb-2 flex items-center">
              <Icon name="DollarSign" size={16} className="mr-2" />
              Pricing Best Practices
            </h3>
            <ul className="text-sm text-accent-foreground space-y-1">
              <li>• Be transparent about all costs upfront</li>
              <li>• Clearly explain what's included</li>
              <li>• Mention any additional fees or requirements</li>
              <li>• Consider offering sliding scale for accessibility</li>
            </ul>
          </div>

          {formData?.costType === 'free' && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Heart" size={16} color="var(--color-success)" />
                <span className="font-medium text-success">Free Service</span>
              </div>
              <p className="text-sm text-success">
                Thank you for providing free services to the community! This helps make resources accessible to everyone.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CostSection;