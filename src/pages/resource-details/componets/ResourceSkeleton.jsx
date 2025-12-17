import React from 'react';

const ResourceSkeleton = () => {
    return (
        <div className="min-h-screen bg-background">
            {/* Header Skeleton */}
            <div className="h-16 border-b border-border bg-card"></div>

            <main className="pt-16">
                {/* Breadcrumb Skeleton */}
                <div className="bg-muted border-b border-border h-12"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header Section Skeleton */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div className="flex-1 space-y-4">
                                <div className="h-10 bg-muted rounded w-3/4 animate-pulse"></div>
                                <div className="flex gap-4">
                                    <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
                                    <div className="h-6 bg-muted rounded w-24 animate-pulse"></div>
                                    <div className="h-6 bg-muted rounded w-24 animate-pulse"></div>
                                </div>
                                <div className="space-y-2 pt-4">
                                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                                    <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                                </div>
                            </div>

                            {/* Quick Actions Skeleton */}
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[200px]">
                                <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
                                <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
                                <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid Skeleton */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="xl:col-span-2 space-y-8">
                            {/* Info Section Skeleton */}
                            <div className="bg-card border border-border rounded-lg p-6 h-64 animate-pulse"></div>
                            {/* Location Section Skeleton */}
                            <div className="bg-card border border-border rounded-lg p-6 h-64 animate-pulse"></div>
                        </div>

                        {/* Right Column */}
                        <div className="xl:col-span-1 space-y-6">
                            {/* Contact Section Skeleton */}
                            <div className="bg-card border border-border rounded-lg p-6 h-48 animate-pulse"></div>
                            {/* Quick Info Skeleton */}
                            <div className="bg-card border border-border rounded-lg p-6 h-64 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ResourceSkeleton;
