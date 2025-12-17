import React from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import Image from '../../../components/ui/AppImage';

const RecommendationsSection = ({ items = [], onView, onSave }) => {
  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-success bg-success/10';
      case 'PENDING':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Recommended for You</h2>
          <p className="text-sm text-muted-foreground">Personalized suggestions based on your activity and location</p>
        </div>
        <Button variant="ghost" size="sm" iconName="RefreshCw" />
      </div>

      {items?.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">No recommendations available right now.</div>
      ) : (
        <div className="space-y-4">
          {items?.map((r) => (
            <div key={r?.id || r?.resourceName} className="bg-background border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  {r?.images?.length ? (
                    <Image src={r?.images?.[0]?.url || r?.images?.[0]} alt={r?.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-background border border-border">
                      <Icon name="Image" size={16} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{r?.title}</h3>
                      {r?.category?.name && (
                        <p className="text-sm text-primary font-medium">{r?.category?.name}</p>
                      )}
                    </div>
                    {r?.status && (
                      <div className={`px-2 py-1 rounded-md text-xs font-medium ${getAvailabilityColor(r?.status)}`}>
                        {r?.status}
                      </div>
                    )}
                  </div>

                  {r?.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{r?.description}</p>
                  )}

                  <div className="flex items-center space-x-4 mb-3 text-xs text-muted-foreground">
                    {r?.averageRating ? (
                      <div className="flex items-center space-x-1">
                        <Icon name="Star" size={12} color="var(--color-warning)" />
                        <span>{Number(r?.averageRating).toFixed(1)} ({r?.totalRatings || 0})</span>
                      </div>
                    ) : null}
                    {(r?.city || r?.postalCode) && (
                      <div className="flex items-center space-x-1">
                        <Icon name="MapPin" size={12} />
                        <span>{[r?.city, r?.postalCode].filter(Boolean).join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground italic">
                      {r?.tags?.length ? r?.tags?.slice(0, 3).join(' • ') : 'Suggested for you'}
                    </p>
                    <div className="flex space-x-2">
                      {onSave && (
                        <Button variant="outline" size="sm" iconName="Bookmark" iconPosition="left" onClick={() => onSave(r?.resourceName)}>
                          Save
                        </Button>
                      )}
                      <Button variant="default" size="sm" iconName="ArrowRight" iconPosition="right" onClick={() => onView?.(r?.resourceName)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Button variant="outline" iconName="Eye" iconPosition="left">View All Recommendations</Button>
      </div>
    </div>
  );
};

export default RecommendationsSection;