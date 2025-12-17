import React from 'react';
import Icon from '../../../components/ui/AppIcon';
import Image from '../../../components/ui/AppImage';
import Button from '../../../components/ui/ui-components/Button';
import { getRelativeTime } from '../../../utils/constants';

const ResourceCard = ({ resource, onShare, onContact }) => {
  const handleShare = (e) => {
    e.stopPropagation();
    onShare(resource);
  };

  const handleContact = (e) => {
    e.stopPropagation();
    onContact(resource);
  };

  const renderRating = (rating, count) => {
    return (
      <div className="flex items-center space-x-1">
        <Icon
          name="Star"
          size={14}
          color={rating > 0 ? "var(--color-warning)" : "var(--color-muted-foreground)"}
          className={rating > 0 ? "fill-current" : ""}
        />
        <span className="text-sm font-medium text-foreground">
          {rating > 0 ? rating.toFixed(1) : 'New'}
        </span>
        {count > 0 && (
          <span className="text-xs text-muted-foreground">
            ({count})
          </span>
        )}
      </div>
    );
  };

  // Get the first image or a placeholder
  const displayImage = resource?.imageUrl && resource.imageUrl.length > 0
    ? resource.imageUrl[0]
    : 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c';

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 hover:shadow-elevation-2 transition-smooth overflow-hidden flex flex-col h-full">
      {/* Resource Image */}
      <div className="relative h-48 overflow-hidden shrink-0">
        <Image
          src={displayImage}
          alt={resource?.title}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-1" title={resource?.title}>
              {resource?.title}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary font-medium">{resource?.categoryName}</span>
            {renderRating(resource?.averageRating, resource?.totalRatings)}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
          {resource?.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {/* Location */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="MapPin" size={14} className="shrink-0" />
            <span className="truncate" title={resource?.fullAddress || `${resource?.city}, ${resource?.postalCode}`}>
              {resource?.city}, {resource?.postalCode}
            </span>
          </div>

          {/* Availability/Status */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={14} className="shrink-0" />
            <span className="truncate" title={resource?.availability}>
              {resource?.availability ? resource.availability.split(' ').slice(0, 3).join(' ') + (resource.availability.split(' ').length > 3 ? '...' : '') : 'Contact for availability'}
            </span>
          </div>

          {/* Provider */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="User" size={14} className="shrink-0" />
            <span className="truncate">
              {resource?.user?.organizationName || resource?.user?.username || 'Community Member'}
            </span>
            {resource?.user?.verified && (
              <Icon name="ShieldCheck" size={12} color="var(--color-success)" />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <span className="text-xs text-muted-foreground">
            Updated {resource?.updatedAt ? getRelativeTime(new Date(resource.updatedAt).getTime()) : 'recently'}
          </span>

          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              iconName="Share2"
              iconSize={16}
              className="h-8 w-8 p-0"
            />
            <Button
              variant="default"
              size="sm"
              onClick={handleContact}
              className="h-8"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;