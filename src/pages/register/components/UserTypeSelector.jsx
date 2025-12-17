import React from 'react';
import Icon from '../../../components/ui/AppIcon';

const UserTypeSelector = ({ selectedType, onTypeChange }) => {
  const userTypes = [
    {
      id: 'seeker',
      title: 'Seeking Resources',
      description: 'I need help finding community resources and support services',
      icon: 'Search',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      selectedColor: 'bg-blue-100 border-blue-400'
    },
    {
      id: 'provider',
      title: 'Providing Resources',
      description: 'I want to offer resources and help others in my community',
      icon: 'Heart',
      color: 'bg-green-50 border-green-200 text-green-700',
      selectedColor: 'bg-green-100 border-green-400'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Join Our Community
        </h2>
        <p className="text-muted-foreground">
          Choose how you'd like to participate in NeighborlyUnion
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userTypes?.map((type) => (
          <button
            key={type?.id}
            type="button"
            onClick={() => onTypeChange(type?.id)}
            className={`p-6 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
              selectedType === type?.id 
                ? type?.selectedColor 
                : `${type?.color} hover:border-opacity-60`
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${selectedType === type?.id ? 'bg-white' : 'bg-white/50'}`}>
                <Icon 
                  name={type?.icon} 
                  size={24} 
                  color={selectedType === type?.id ? 'var(--color-primary)' : 'currentColor'} 
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{type?.title}</h3>
                <p className="text-sm opacity-80">{type?.description}</p>
              </div>
              {selectedType === type?.id && (
                <Icon name="CheckCircle" size={20} color="var(--color-primary)" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserTypeSelector;