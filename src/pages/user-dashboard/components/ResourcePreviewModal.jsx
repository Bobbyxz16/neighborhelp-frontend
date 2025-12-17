import React from 'react';
import { X, MapPin, Clock, DollarSign, Users, Phone, Globe, Star } from 'lucide-react';

/**
 * ResourcePreviewModal - Shows a preview of how the resource appears on the resources page
 */
const ResourcePreviewModal = ({ resource, isOpen, onClose }) => {
    if (!isOpen || !resource) return null;

    const getCostDisplay = (cost) => {
        switch (cost) {
            case 'FREE': return 'Free';
            case 'LOW_COST': return 'Low Cost';
            case 'VARIES': return 'Varies';
            case 'FIXED_FEE': return 'Fixed Fee';
            default: return cost;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
                    aria-label="Close preview"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                {/* Preview Label */}
                <div className="bg-blue-600 text-white px-6 py-3 rounded-t-2xl">
                    <p className="text-sm font-medium">Preview: How this resource appears to users</p>
                </div>

                {/* Resource Preview Content */}
                <div className="p-6">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {resource.title}
                                </h1>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        {resource.category}
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${resource.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                        resource.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {resource.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Image */}
                        {resource.imageUrl && (
                            <div className="mb-6 rounded-xl overflow-hidden">
                                <img
                                    src={Array.isArray(resource.imageUrl) ? resource.imageUrl[0] : resource.imageUrl}
                                    alt={resource.title}
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        )}

                        {/* Rating */}
                        {resource.averageRating > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(resource.averageRating)
                                                ? 'text-yellow-500 fill-yellow-500'
                                                : 'text-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                    {resource.averageRating.toFixed(1)} ({resource.totalRatings} reviews)
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {resource.description}
                        </p>
                    </div>

                    {/* Key Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Location */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                                <p className="text-sm text-gray-600">
                                    {resource.fullAddress ? (
                                        <span className="font-medium">{resource.fullAddress}</span>
                                    ) : (
                                        <>
                                            {resource.street && <><span className="font-medium">{resource.street}</span><br /></>}
                                            {resource.city}{resource.city && resource.postalCode && ', '}{resource.postalCode}
                                            {resource.province && `, ${resource.province}`}
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Cost */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Cost</h3>
                                <p className="text-sm text-gray-600">
                                    {getCostDisplay(resource.cost)}
                                    {resource.cost === 'FIXED_FEE' && resource.fixedFee && (
                                        <span className="ml-2 font-semibold text-gray-900">${resource.fixedFee}</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Availability */}
                        {resource.availability && (
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <Clock className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Availability</h3>
                                    <p className="text-sm text-gray-600">{resource.availability}</p>
                                </div>
                            </div>
                        )}

                        {/* Capacity */}
                        {resource.capacity && (
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                                <Users className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Capacity</h3>
                                    <p className="text-sm text-gray-600">{resource.capacity}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contact Information */}
                    {resource.contactInfo && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-blue-600" />
                                Contact Information
                            </h2>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {resource.contactInfo}
                            </p>
                        </div>
                    )}

                    {/* Additional Information */}
                    {(resource.requirements || resource.additionalNotes || resource.wheelchairAccessible) && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Additional Information</h2>

                            {resource.wheelchairAccessible && (
                                <div className="mb-3 flex items-center gap-2 text-sm text-gray-700">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                                        ♿ Wheelchair Accessible
                                    </span>
                                </div>
                            )}

                            {resource.requirements && (
                                <div className="mb-3">
                                    <h3 className="font-semibold text-gray-900 mb-1">Requirements</h3>
                                    <p className="text-sm text-gray-700">{resource.requirements}</p>
                                </div>
                            )}

                            {resource.additionalNotes && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Notes</h3>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{resource.additionalNotes}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            <span className="font-semibold">{resource.viewsCount || 0}</span> views
                        </div>
                        {resource.websiteUrl && (
                            <a
                                href={resource.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                <Globe className="w-4 h-4" />
                                Visit Website
                            </a>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-200">
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close Preview
                        </button>
                        <button
                            onClick={() => window.open(`/resources/${resource.slug}`, '_blank')}
                            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            View Live Page
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default ResourcePreviewModal;
