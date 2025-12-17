import React from 'react';
import Icon from '../../../components/ui/AppIcon';

const LoginBenefits = () => {
  const benefits = [
    {
      icon: 'Search',
      title: 'Find Local Resources',
      description: 'Discover food banks, healthcare services, job training, and more in your area'
    },
    {
      icon: 'Users',
      title: 'Connect with Community',
      description: 'Join a network of neighbors helping neighbors through verified organizations'
    },
    {
      icon: 'Shield',
      title: 'Verified Providers',
      description: 'All resource providers are verified for safety and reliability'
    },
    {
      icon: 'Clock',
      title: 'Real-time Updates',
      description: 'Get instant notifications about new resources and availability changes'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          Join Our Community Platform
        </h2>
        <p className="text-sm text-muted-foreground">
          Connecting people in need with local resources and support
        </p>
      </div>
      <div className="space-y-4">
        {benefits?.map((benefit, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={benefit?.icon} size={16} color="var(--color-primary)" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground mb-1">
                {benefit?.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {benefit?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Trust Indicators */}
      <div className="bg-accent/50 rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} color="var(--color-success)" />
          <span className="text-sm font-medium text-foreground">Trusted Platform</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={12} color="var(--color-success)" />
            <span>SSL encrypted and secure</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={12} color="var(--color-success)" />
            <span>Verified by community leaders</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={12} color="var(--color-success)" />
            <span>Privacy-focused design</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBenefits;