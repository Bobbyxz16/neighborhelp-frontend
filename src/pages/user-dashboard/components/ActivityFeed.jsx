import React from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import Image from '../../../components/ui/AppImage';

const ActivityFeed = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'new_resource': return 'Plus';
      case 'appointment_reminder': return 'Calendar';
      case 'provider_update': return 'Clock';
      case 'recommendation': return 'Lightbulb';
      case 'message': return 'MessageSquare';
      default: return 'Bell';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'new_resource': return 'text-muted-foreground bg-muted';
      case 'appointment_reminder': return 'text-warning bg-warning/10';
      case 'provider_update': return 'text-primary bg-primary/10';
      case 'recommendation': return 'text-secondary bg-secondary/10';
      case 'message': return 'text-accent-foreground bg-accent';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date?.toLocaleDateString();
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
        <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
      </div>

      {activities?.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">No recent activity.</div>
      ) : (
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div
              key={activity?.id}
              className="flex items-start space-x-4 p-4 bg-background rounded-lg border border-border hover:shadow-elevation-1 transition-smooth"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                  {activity?.image ? (
                    <Image src={activity?.image} alt={activity?.imageAlt || 'Resource image'} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-gray-100`}>
                      <Icon name={getActivityIcon(activity?.type)} size={18} className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-md bg-gray-100">
                      <Icon name={getActivityIcon(activity?.type)} size={14} className="text-gray-500" />
                    </div>
                    <h3 className="font-medium text-foreground">{activity?.title}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {formatTimestamp(activity?.timestamp)}
                  </span>
                </div>

                {activity?.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {activity?.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  {activity?.provider && (
                    <span className="text-xs text-primary font-medium">{activity?.provider}</span>
                  )}
                  {activity?.actionLabel && (
                    <Button variant="ghost" size="sm" className="text-xs">
                      {activity?.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <Button variant="outline" iconName="RotateCcw" iconPosition="left">
          Load More Activity
        </Button>
      </div>
    </div>
  );
};

export default ActivityFeed;