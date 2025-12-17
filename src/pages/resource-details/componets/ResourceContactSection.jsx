import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import Modal from '../../../components/ui/ui-components/Modal';
import api from '../../../api/axios';
import { API_ENDPOINTS } from '../../../utils/constants';

const ResourceContactSection = ({ resource }) => {
  const navigate = useNavigate();
  const [showHoursModal, setShowHoursModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageForm, setMessageForm] = useState({
    subject: '',
    content: '',
    priority: 'NORMAL'
  });
  const [error, setError] = useState('');

  // Parse contactInfo string
  const parseContactInfo = (infoStr) => {
    if (!infoStr) return {};
    const result = {};

    const parts = infoStr.split(',').map(p => p.trim());

    parts.forEach(part => {
      if (part.startsWith('Tel:')) {
        result.phone = part.replace('Tel:', '').trim();
      } else if (part.includes('Email:')) {
        let val = part.substring(part.indexOf('Email:') + 6).trim();
        if (val.startsWith('Email:')) val = val.replace('Email:', '').trim();
        result.email = val;
      } else if (part.includes('Web:')) {
        result.website = part.replace('Web:', '').trim();
      }
    });
    return result;
  };

  const parsedContact = parseContactInfo(resource?.contactInfo);
  const displayPhone = parsedContact.phone || resource?.contact?.phone;
  const displayEmail = parsedContact.email || resource?.contact?.email;
  const displayWebsite = resource?.websiteUrl || resource?.website || parsedContact.website || resource?.contact?.website;
  const displayVideo = resource?.videoUrl || resource?.video;
  const displayVirtualTour = resource?.virtualTourUrl || resource?.virtualTour || resource?.tour360;

  const handleOpenMessageModal = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to send a message.');
      navigate('/login');
      return;
    }
    // Pre-fill subject with resource title
    setMessageForm(prev => ({
      ...prev,
      subject: `Inquiry about: ${resource?.title || 'Resource'}`
    }));
    setShowMessageModal(true);
    setError('');
  };

  const handleSendMessage = async () => {
    if (!messageForm.subject.trim() || !messageForm.content.trim()) {
      setError('Please fill in both subject and message.');
      return;
    }

    setIsSending(true);
    setError('');
    try {
      const payload = {
        recipientId: Number(resource.user?.id),
        resourceId: Number(resource.id),
        subject: messageForm.subject,
        content: messageForm.content,
        priority: messageForm.priority || 'NORMAL'
      };

      await api.post(API_ENDPOINTS.MESSAGES.SEND, payload);

      // Close modal immediately on success
      setShowMessageModal(false);
      setMessageForm({
        subject: '',
        content: '',
        priority: 'NORMAL'
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      if (error.response?.status === 401) {
        setError('You cannot message yourself.');
      } else {
        setError(error.response?.data?.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setIsSending(false);
    }
  };

  const contactMethods = [
    {
      type: 'phone',
      label: 'Phone',
      value: displayPhone,
      icon: 'Phone',
      action: () => displayPhone && window.open(`tel:${displayPhone}`, '_self'),
      available: !!displayPhone
    },
    {
      type: 'email',
      label: 'Email',
      value: displayEmail,
      icon: 'Mail',
      action: () => displayEmail && window.open(`mailto:${displayEmail}`, '_self'),
      available: !!displayEmail
    },
    {
      type: 'website',
      label: 'Website',
      value: displayWebsite,
      icon: 'Globe',
      action: () => displayWebsite && window.open(displayWebsite.startsWith('http') ? displayWebsite : `https://${displayWebsite}`, '_blank'),
      available: !!displayWebsite
    },
    {
      type: 'video',
      label: 'Video Tour',
      value: 'Watch Video',
      icon: 'Video',
      action: () => displayVideo && window.open(displayVideo, '_blank'),
      available: !!displayVideo
    },
    {
      type: 'virtualTour',
      label: '360° Virtual Tour',
      value: 'View Tour',
      icon: 'Compass',
      action: () => displayVirtualTour && window.open(displayVirtualTour, '_blank'),
      available: !!displayVirtualTour
    },
    {
      type: 'emergency',
      label: 'Emergency Line',
      value: resource?.contact?.emergencyLine,
      icon: 'AlertTriangle',
      action: () => window.open(`tel:${resource?.contact?.emergencyLine}`, '_self'),
      available: !!resource?.contact?.emergencyLine
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
      </div>

      {/* Contact Methods */}
      <div className="space-y-3 mb-6">
        {contactMethods?.filter(method => method?.available)?.map((method, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent transition-smooth group cursor-pointer"
            onClick={method?.action}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${method?.type === 'emergency' ? 'bg-red-100 text-red-600' :
                method?.type === 'video' ? 'bg-purple-100 text-purple-600' :
                  method?.type === 'virtualTour' ? 'bg-green-100 text-green-600' :
                    'bg-primary/10 text-primary'
                }`}>
                <Icon name={method?.icon} size={16} />
              </div>
              <div>
                <div className="font-medium text-foreground">{method?.label}</div>
                <div className="text-sm text-muted-foreground">{method?.value}</div>
              </div>
            </div>
            <Icon name="ExternalLink" size={16} className="text-muted-foreground group-hover:text-foreground" />
          </div>
        ))}
      </div>

      {/* Quick Actions - Only show message button if NOT a default resource */}
      {!resource?.isDefaultResource && (
        <div className="space-y-3">
          <Button
            variant="primary"
            className="w-full"
            iconName="MessageCircle"
            iconPosition="left"
            onClick={handleOpenMessageModal}
          >
            Send Message
          </Button>
        </div>
      )}

      {/* Full Hours Toggle */}
      <div className="mt-6 pt-6 border-t border-border">
        <Button
          variant="ghost"
          onClick={() => setShowHoursModal(true)}
          className="w-full flex items-center justify-between text-muted-foreground hover:text-foreground"
        >
          <span>All Operating Hours</span>
          <Icon name="ChevronRight" size={16} />
        </Button>
      </div>

      {/* Operation Hours Modal */}
      <Modal
        isOpen={showHoursModal}
        onClose={() => setShowHoursModal(false)}
        title="Operating Hours"
      >
        <div className="space-y-4">
          <div className="bg-accent/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2 flex items-center">
              <Icon name="Clock" size={16} className="mr-2 text-primary" />
              Standard Hours
            </h4>
            <div className="space-y-2">
              {resource?.availability ? (
                resource.availability.split(', ').map((slot, index) => {
                  const isDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].some(d => slot.includes(d));
                  return (
                    <div key={index} className="flex items-start">
                      <div className={`text-sm ${isDay ? 'font-medium text-foreground' : 'text-muted-foreground ml-4'}`}>
                        {slot}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">No specific hours listed.</p>
              )}
            </div>
          </div>

          {resource?.seasonalNotes && (
            <div className="bg-blue-50 text-blue-800 rounded-lg p-4 text-sm">
              <p className="font-medium mb-1">Seasonal Information</p>
              <p>{resource.seasonalNotes}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground mt-4">
            * Hours may vary on holidays. Please contact the resource directly to confirm.
          </div>
        </div>
      </Modal>

      {/* Send Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Send Message</h2>
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setError('');
                  }}
                  className="p-2 -mr-2 rounded-lg hover:bg-gray-100"
                >
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Resource Info */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Package" size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900 truncate">
                      {resource?.title}
                    </p>
                    <p className="text-xs text-blue-700">
                      Message will be sent to the resource owner
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <Icon name="AlertCircle" size={16} className="text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={messageForm.content}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Type your message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows="5"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowMessageModal(false);
                  setError('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!messageForm.subject.trim() || !messageForm.content.trim() || isSending}
                className="min-w-24"
              >
                {isSending ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceContactSection;