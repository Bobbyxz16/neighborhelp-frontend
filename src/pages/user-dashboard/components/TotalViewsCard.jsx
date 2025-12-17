import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/ui/AppIcon';

const TotalViewsCard = ({ statistics }) => {
    return (
        <Link to="/statistics" className="block group h-full">
            <div className="rounded-xl border border-border p-6 bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 hover:shadow-elevation-3 transition-smooth h-full">
                <div className="flex items-start justify-between h-full">
                    <div className="flex flex-col justify-between h-full">
                        <div className="text-base uppercase tracking-wide text-muted-foreground">Total Views</div>
                        <div className={`mt-1 tabular-nums text-foreground group-hover:scale-[1.01] transition-transform ${((statistics?.totalViews ?? 0) === 0) ? 'text-4xl md:text-5xl font-medium opacity-80' : 'text-6xl md:text-7xl font-extrabold'}`}>
    {statistics?.totalViews ?? 0}
</div>
                        <div className="mt-2 text-base text-muted-foreground">View detailed statistics</div>
                    </div>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black/10 dark:bg-white/10 text-foreground">
                        <Icon name="TrendingUp" size={22} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TotalViewsCard;
