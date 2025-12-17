import React from 'react';
import Icon from '../../../components/ui/AppIcon';

const CommunityImpactCard = () => {
    return (
        <div className="bg-gradient-to-br from-success/10 to-secondary/10 rounded-xl border border-border p-6 h-full">
            <div className="flex items-center mb-3">
                <Icon name="Heart" size={20} color="var(--color-success)" className="mr-2" />
                <h3 className="text-lg font-semibold text-foreground">Community Impact</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
                You're part of a community that has helped to improve our neighbourhood!
            </p>
        </div>
    );
};

export default CommunityImpactCard;
