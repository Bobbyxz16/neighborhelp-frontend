// pages/user-dashboard/components/WelcomeSection.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, AlertTriangle, LogOut } from 'lucide-react';

/**
 * WelcomeSection - Personalized greeting and quick emergency access
 */
const WelcomeSection = ({ user }) => {
  const navigate = useNavigate();

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good morning';
    if (currentHour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-6 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            {getGreeting()}, {user?.firstName || user?.username || 'Friend'}!
          </h1>
          <p className="text-blue-100 text-lg">
            Welcome back to your community support dashboard
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/resources"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            <Search className="w-5 h-5" />
            Find Resources
          </Link>
          <Link
            to="/create-resource"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            + Create Resource
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-red-500/80 hover:border-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Emergency Resources */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <h3 className="text-lg font-semibold mb-3 flex items-center">

        </h3>
        <Link
          to="/user-dashboard/emergency-resources"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-medium"
        >
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <span>Emergency Resources</span>
        </Link>
      </div>
    </div>
  );
};

export default WelcomeSection;