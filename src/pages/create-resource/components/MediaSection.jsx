import React, { useMemo, useRef, useState } from 'react';
import Button from '../../../components/ui/ui-components/Button';
import Icon from '../../../components/ui/AppIcon';
import Image from '../../../components/ui/AppImage';
import api from '../../../api/axios';
import { FILE_UPLOAD, API_ENDPOINTS } from '../../../utils/constants';

const MediaSection = ({ formData, onChange, errors }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStates, setUploadStates] = useState({});
  const [pendingCount, setPendingCount] = useState(0);
  const concurrency = 3;
  const queueRef = useRef([]);
  const activeCountRef = useRef(0);
  const pendingTasksRef = useRef([]);

  // Fix for stale closure: keep a ref to the latest formData
  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);

    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files, true);
    }
  };

  const handleFileInput = (e) => {
    if (e?.target?.files) {
      // Auto-start uploads immediately
      handleFiles(e?.target?.files, true);
    }
  };

  const enqueue = (tasks) => {
    queueRef.current = [...queueRef.current, ...tasks];
    processQueue();
  };

  const processQueue = async () => {
    while (queueRef.current.length > 0 && activeCountRef.current < concurrency) {
      const task = queueRef.current.shift();
      activeCountRef.current++;
      task().finally(() => {
        activeCountRef.current--;
        processQueue();
      });
    }
  };

  const handleFiles = (files, autoStart = false) => {
    const fileArray = Array.from(files);
    const currentImageCount = formDataRef.current?.images?.length || 0;
    const MAX_IMAGES = 10;

    // Check if adding these files would exceed the limit
    if (currentImageCount >= MAX_IMAGES) {
      alert(`Maximum of ${MAX_IMAGES} images allowed. Please remove some images before uploading more.`);
      return;
    }

    // Check if adding these files would exceed the limit
    const availableSlots = MAX_IMAGES - currentImageCount;
    if (fileArray.length > availableSlots) {
      alert(`You can only upload ${availableSlots} more image(s). Maximum of ${MAX_IMAGES} images allowed.`);
      // Only process the files that fit within the limit
      fileArray.splice(availableSlots);
    }

    const prepared = [];
    const tasks = [];

    fileArray.forEach((file) => {
      if (file.size > FILE_UPLOAD.MAX_SIZE) {
        alert(`File ${file.name} exceeds maximum file size of 5MB`);
        return;
      }

      const tempId = `temp-${Date.now()}-${Math.random()}`;
      const previewUrl = URL.createObjectURL(file);

      prepared.push({
        id: tempId,
        url: previewUrl,
        alt: '',
        isMain: (formDataRef.current?.images?.length || 0) === 0 && prepared.length === 0
      });

      const uploadTask = () => uploadImage(file, tempId, previewUrl);
      tasks.push(uploadTask);
    });

    if (prepared.length > 0) {
      const currentImages = formDataRef.current?.images || [];
      handleInputChange('images', [...currentImages, ...prepared]);
    }

    if (autoStart) {
      enqueue(tasks);
    } else {
      pendingTasksRef.current = [...pendingTasksRef.current, ...tasks];
      setPendingCount((c) => c + prepared.length);
    }
  };

  const uploadImage = async (file, tempId, previewUrl) => {
    const controller = new AbortController();
    setUploadStates((prev) => ({
      ...prev,
      [tempId]: { status: 'uploading', progress: 0, controller }
    }));

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);

    try {
      const response = await api.post(API_ENDPOINTS.RESOURCES.UPLOADS, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: controller.signal,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadStates((prev) => ({
            ...prev,
            [tempId]: { ...prev[tempId], progress: percentCompleted }
          }));
        }
      });

      console.log('Upload response:', response);

      // Handle different response formats - backend returns just the URL string or object
      const imageUrl = typeof response?.data === 'string' ? response.data : response?.data?.url;

      if (imageUrl) {
        // Use ref to get the absolute latest state, avoiding stale closure issues
        const currentImages = formDataRef.current?.images || [];

        const updatedImages = currentImages.map((img) =>
          img.id === tempId ? { ...img, url: imageUrl, id: tempId } : img
        );

        handleInputChange('images', updatedImages);
        URL.revokeObjectURL(previewUrl);
        setUploadStates((prev) => ({
          ...prev,
          [tempId]: { status: 'done' }
        }));
      } else {
        console.error('No URL in response:', response);
        setUploadStates((prev) => ({
          ...prev,
          [tempId]: { status: 'error', error: 'No URL returned from server' }
        }));
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.name !== 'CanceledError') {
        setUploadStates((prev) => ({
          ...prev,
          [tempId]: { status: 'error', error: error?.response?.data?.message || 'Upload failed' }
        }));
      }
    }
  };

  const startPendingUploads = () => {
    if (pendingTasksRef.current.length > 0) {
      enqueue(pendingTasksRef.current);
      pendingTasksRef.current = [];
      setPendingCount(0);
    }
  };

  const removeImage = (imageId) => {
    const s = uploadStates?.[imageId];
    if (s?.controller?.abort && typeof s.controller.abort === 'function') {
      s.controller.abort();
    }
    const currentImages = formData?.images || [];
    const updatedImages = currentImages?.filter((img) => img?.id !== imageId);
    handleInputChange('images', updatedImages);
    setUploadStates((prev) => {
      const n = { ...prev };
      delete n[imageId];
      return n;
    });
  };

  const setMainImage = (imageId) => {
    const currentImages = formData?.images || [];
    const updatedImages = currentImages?.map((img) => ({
      ...img,
      isMain: img?.id === imageId
    }));
    handleInputChange('images', updatedImages);
  };

  const updateImageAlt = (imageId, altText) => {
    const currentImages = formData?.images || [];
    const updatedImages = currentImages?.map((img) =>
      img?.id === imageId ? { ...img, alt: altText } : img
    );
    handleInputChange('images', updatedImages);
  };

  const displayImages = useMemo(() => (formData?.images && formData?.images?.length > 0 ? formData?.images : []), [formData?.images]);

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-semibold text-foreground">Photos & Media</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Add photos to help people understand your service and location (Maximum 10 images)
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ?
              'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`
            }
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}>

            <Icon name="Upload" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Upload Photos</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop images here, or click to select files
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
              id="image-upload" />

            <Button
              variant="outline"
              onClick={() => document.getElementById('image-upload')?.click()}
              iconName="Camera"
              iconPosition="left">

              Choose Files
            </Button>
            {pendingCount > 0 && (
              <Button
                variant="primary"
                className="ml-2"
                onClick={() => startPendingUploads()}
                iconName="Upload"
                iconPosition="left">
                Start Upload ({pendingCount})
              </Button>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: JPG, PNG, GIF (Max 5MB each, 10 images total)
            </p>
          </div>

          <div className="bg-accent rounded-lg p-4">
            <h3 className="font-medium text-accent-foreground mb-2 flex items-center">
              <Icon name="Camera" size={16} className="mr-2" />
              Photo Guidelines
            </h3>
            <ul className="text-sm text-accent-foreground space-y-1">
              <li>• Show your facility or service location</li>
              <li>• Include photos of services in action</li>
              <li>• Ensure good lighting and clear images</li>
              <li>• Respect privacy - get permission for people in photos</li>
              <li>• First image will be used as the main photo</li>
              <li>• Maximum 10 images allowed</li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          {displayImages?.length > 0 ?
            <div>
              <h3 className="font-medium text-foreground mb-3">Uploaded Images ({displayImages?.length}/10)</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {displayImages?.map((image, index) =>
                  <div key={image?.id} className="bg-muted rounded-lg p-3">
                    <div className="flex items-start space-x-3">
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={image?.url}
                          alt={image?.alt}
                          className="w-full h-full object-cover" />

                        {image?.isMain &&
                          <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded">
                            Main
                          </div>
                        }
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">
                            Image {index + 1}
                          </span>
                          <div className="flex items-center space-x-1">
                            {!image?.isMain &&
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setMainImage(image?.id)}
                                iconName="Star"
                                iconSize={14} />

                            }
                            {uploadStates?.[image?.id]?.status === 'uploading' && (
                              <span className="text-xs text-muted-foreground mr-2">{uploadStates?.[image?.id]?.progress || 0}%</span>
                            )}
                            {uploadStates?.[image?.id]?.status && uploadStates?.[image?.id]?.status !== 'uploading' && uploadStates?.[image?.id]?.status !== 'done' && (
                              <span className="text-xs text-destructive mr-2">{uploadStates?.[image?.id]?.error || 'Error'}</span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImage(image?.id)}
                              iconName="Trash2"
                              iconSize={14} />

                          </div>
                        </div>

                        {uploadStates?.[image?.id]?.status === 'uploading' && (
                          <div className="w-full h-2 bg-background rounded">
                            <div className="h-2 bg-primary rounded" style={{ width: `${uploadStates?.[image?.id]?.progress || 0}%` }} />
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-1">
                            Alt Text (for accessibility)
                          </label>
                          <textarea
                            className="w-full h-16 px-2 py-1 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                            placeholder="Describe what's shown in this image"
                            value={image?.alt}
                            onChange={(e) => updateImageAlt(image?.id, e?.target?.value)} />

                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div> :

            <div className="text-center py-8 bg-muted rounded-lg">
              <Icon name="ImageIcon" size={32} color="var(--color-muted-foreground)" className="mx-auto mb-2" />
              <p className="text-muted-foreground">No images uploaded yet</p>
              <p className="text-sm text-muted-foreground">Add photos to make your listing more appealing</p>
            </div>
          }

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Video URL (Optional)
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
                value={formData?.videoUrl}
                onChange={(e) => handleInputChange('videoUrl', e?.target?.value)} />

              <p className="text-xs text-muted-foreground mt-1">
                YouTube, Vimeo, or other video platform links
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Virtual Tour Link (Optional)
              </label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="https://..."
                value={formData?.virtualTourUrl}
                onChange={(e) => handleInputChange('virtualTourUrl', e?.target?.value)} />

              <p className="text-xs text-muted-foreground mt-1">
                360° tour or interactive map of your facility
              </p>
            </div>
          </div>
        </div>
      </div>
      {errors?.images &&
        <p className="text-sm text-destructive">{errors?.images}</p>
      }
    </div>);

};

export default MediaSection;