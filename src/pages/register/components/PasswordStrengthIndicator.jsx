import React from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: pwd?.length >= 8,
      lowercase: /[a-z]/?.test(pwd),
      uppercase: /[A-Z]/?.test(pwd),
      numbers: /\d/?.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(pwd)
    };
    
    score = Object.values(checks)?.filter(Boolean)?.length;
    
    const strengthLevels = {
      0: { label: '', color: '', width: '0%' },
      1: { label: 'Very Weak', color: 'bg-red-500', width: '20%' },
      2: { label: 'Weak', color: 'bg-orange-500', width: '40%' },
      3: { label: 'Fair', color: 'bg-yellow-500', width: '60%' },
      4: { label: 'Good', color: 'bg-blue-500', width: '80%' },
      5: { label: 'Strong', color: 'bg-green-500', width: '100%' }
    };
    
    return { ...strengthLevels?.[score], checks };
  };

  const strength = calculateStrength(password);
  
  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Password Strength:</span>
        <span className={`text-xs font-medium ${
          strength?.label === 'Strong' ? 'text-green-600' :
          strength?.label === 'Good' ? 'text-blue-600' :
          strength?.label === 'Fair'? 'text-yellow-600' : 'text-red-600'
        }`}>
          {strength?.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${strength?.color}`}
          style={{ width: strength?.width }}
        />
      </div>
      {password && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className={`flex items-center space-x-1 ${strength?.checks?.length ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-2 h-2 rounded-full ${strength?.checks?.length ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>8+ characters</span>
          </div>
          <div className={`flex items-center space-x-1 ${strength?.checks?.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-2 h-2 rounded-full ${strength?.checks?.uppercase ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>Uppercase letter</span>
          </div>
          <div className={`flex items-center space-x-1 ${strength?.checks?.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-2 h-2 rounded-full ${strength?.checks?.lowercase ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>Lowercase letter</span>
          </div>
          <div className={`flex items-center space-x-1 ${strength?.checks?.numbers ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-2 h-2 rounded-full ${strength?.checks?.numbers ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span>Number</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;