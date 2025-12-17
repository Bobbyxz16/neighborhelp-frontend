import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/ui-components/Button';
import Icon from '../components/ui/AppIcon';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-lg w-full"> {/* Increased max-w-md to max-w-lg */}
        <div className="flex justify-center mb-8"> {/* Increased mb-6 to mb-8 */}
          <div className="relative">
            <h1 className="text-9xl sm:text-10xl font-bold text-primary opacity-20">404</h1> {/* Added responsive text size */}
          </div>
        </div>

        <h2 className="text-3xl font-medium text-onBackground mb-4 text-center">Page Not Found</h2> {/* Increased text-2xl to text-3xl and mb-2 to mb-4 */}
        <p className="text-onBackground/70 text-lg mb-10 text-center"> {/* Added text-lg and increased mb-8 to mb-10 */}
          The page you're looking for doesn't exist. Let's get you back!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            icon={<Icon name="ArrowLeft" />}
            iconPosition="left"
            onClick={() => window.history?.back()}
          >
            Go Back
          </Button>

          <Button
            variant="outline"
            icon={<Icon name="Home" />}
            iconPosition="left"
            onClick={handleGoHome}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
