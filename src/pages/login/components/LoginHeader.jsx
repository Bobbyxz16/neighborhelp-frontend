// pages/login/components/LoginHeader.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../../assets/neighbourlyunion_Image-Photoroom.png';

const LoginHeader = () => {
  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <Link to="/" className="inline-flex items-center space-x-2 group">
        <img
          src={logoImage}
          alt="NeighborlyUnion"
          className="h-16 w-auto object-contain transition-transform group-hover:scale-105"
        />
        <span className="text-2xl font-heading font-bold text-foreground">
          NeighborlyUnion
        </span>
      </Link>

      {/* Welcome Message */}
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Welcome Back
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Sign in to access your community resource platform and continue helping or finding support in your neighborhood.
        </p>
      </div>

      {/* Community Stats */}
      <div className="flex items-center justify-center space-x-8 py-0">



      </div>
    </div>
  );
};
export default LoginHeader;
