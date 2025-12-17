import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/ui/AppIcon';
import api from '../../../api/axios';
import { API_ENDPOINTS } from '../../../utils/constants';

const RelatedResourcesSection = ({ category, currentResourceId }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRelatedResources = async () => {
            if (!category) return;

            try {
                setLoading(true);
                // Fetch resources with the same category
                const { data } = await api.get(API_ENDPOINTS.RESOURCES.BASE, {
                    params: {
                        category: category,
                        size: 4, // Limit to 4 related resources
                        sort: 'createdAt,desc'
                    }
                });

                const list = data?.content || data?.items || (Array.isArray(data) ? data : []);

                // Filter out the current resource
                const related = list.filter(r => r.id !== currentResourceId && r.slug !== currentResourceId).slice(0, 3);

                setResources(related);
            } catch (error) {
                console.error('Error fetching related resources:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedResources();
    }, [category, currentResourceId]);

    if (loading) {
        return (
            <div className="mt-12">
                <div className="h-8 bg-muted rounded w-48 mb-6 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card border border-border rounded-lg p-4 h-64 animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (resources.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 border-t border-border pt-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">Related Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.map((resource) => (
                    <div
                        key={resource.id}
                        onClick={() => navigate(`/resources/${resource.slug || resource.id}`)}
                        className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col"
                    >
                        {resource.imageUrl ? (
                            <div className="h-40 overflow-hidden">
                                <img
                                    src={resource.imageUrl}
                                    alt={resource.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        ) : (
                            <div className="h-40 bg-accent flex items-center justify-center">
                                <Icon name="Image" size={32} className="text-muted-foreground" />
                            </div>
                        )}

                        <div className="p-4 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full capitalize">
                                    {resource.category}
                                </span>
                                {resource.averageRating > 0 && (
                                    <div className="flex items-center text-xs font-medium text-yellow-600">
                                        <Icon name="Star" size={12} className="fill-current mr-1" />
                                        {resource.averageRating.toFixed(1)}
                                    </div>
                                )}
                            </div>

                            <h4 className="font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                {resource.title}
                            </h4>

                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                {resource.description}
                            </p>

                            <div className="flex items-center text-xs text-muted-foreground mt-auto">
                                <Icon name="MapPin" size={12} className="mr-1" />
                                <span className="truncate">{resource.city || resource.address?.city}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedResourcesSection;
