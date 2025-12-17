import React, { useState } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';

const ResourceGallerySection = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (!images || images?.length === 0) {
    return null;
  }

  const openLightbox = (index) => {
    setSelectedImage(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images?.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images?.length) % images?.length);
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Escape') closeLightbox();
    if (e?.key === 'ArrowRight') nextImage();
    if (e?.key === 'ArrowLeft') prevImage();
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Photos</h3>
        
        {/* Main Image */}
        <div className="mb-4">
          <div
            className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(selectedImage)}
          >
            <img
              src={images?.[selectedImage]?.url}
              alt={images?.[selectedImage]?.alt}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 text-white p-3 rounded-full">
                  <Icon name="ZoomIn" size={24} />
                </div>
              </div>
            </div>
            
            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} of {images?.length}
            </div>
          </div>
          
          {/* Image Description */}
          {images?.[selectedImage]?.alt && (
            <p className="text-sm text-muted-foreground mt-2 italic">
              {images?.[selectedImage]?.alt}
            </p>
          )}
        </div>

        {/* Thumbnail Grid */}
        {images?.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {images?.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-video bg-muted rounded-lg overflow-hidden transition-all ${
                  selectedImage === index
                    ? 'ring-2 ring-primary ring-offset-2' :'hover:opacity-80'
                }`}
              >
                <img
                  src={image?.url}
                  alt={image?.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Lightbox Modal */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e?.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
            >
              <Icon name="X" size={24} />
            </button>

            {/* Navigation Buttons */}
            {images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10"
                >
                  <Icon name="ChevronLeft" size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10"
                >
                  <Icon name="ChevronRight" size={24} />
                </button>
              </>
            )}

            {/* Main Image */}
            <img
              src={images?.[selectedImage]?.url}
              alt={images?.[selectedImage]?.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm opacity-90">{images?.[selectedImage]?.alt}</p>
                </div>
                <div className="text-sm opacity-75 ml-4">
                  {selectedImage + 1} / {images?.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResourceGallerySection;