import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/ui/AppIcon';

const QuickActionsPanel = ({ user, statistics = {}, unreadCount = 0 }) => {
  const quickActions = [
    {
      id: 1,
      title: 'Find Resources',
      icon: 'Search',
      color: 'bg-primary text-primary-foreground',
      path: '/resource-search',
      badge: null,
    },
    {
      id: 3,
      title: 'Messages',
      icon: 'MessageSquare',
      color: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
      path: '/messages',
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      id: 4,
      title: 'Profile Settings',
      icon: 'Settings',
      color: 'bg-muted text-muted-foreground',
      path: '/profile-settings',
      badge: null,
    },
  ];

  const stats = [
    {
      label: 'Resources Saved',
      value: statistics?.savedResourcesCount ?? user?.savedResources ?? 0,
      icon: 'Bookmark',
      color: 'text-primary',
    },
    {
      label: 'Services Used',
      value: statistics?.servicesUsed ?? user?.servicesUsed ?? 0,
      icon: 'CheckCircle',
      color: 'text-success',
    },
    {
      label: 'Reviews Given',
      value: statistics?.reviewsGiven ?? user?.reviewsGiven ?? 0,
      icon: 'Star',
      color: 'text-warning',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions?.map((action) => (
            <Link
              key={action?.id}
              to={action?.path}
              className="relative group block"
            >
              <div className={`${action?.color} rounded-xl p-5 h-full min-h-[80px] hover:shadow-elevation-2 transition-smooth`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Icon name={action?.icon} size={24} />
                    {action?.badge && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full shadow-lg animate-pulse">
                        {action?.badge > 99 ? '99+' : action?.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-base">{action?.title}</h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* User Stats */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Your Activity</h3>
        <div className="grid grid-cols-2 gap-4">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-background border border-border mb-2 ${stat?.color}`}>
                <Icon name={stat?.icon} size={20} />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat?.value}</div>
              <div className="text-xs text-muted-foreground">{stat?.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActionsPanel;