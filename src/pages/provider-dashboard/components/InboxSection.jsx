import React, { useState } from 'react';
import Icon from '../../../components/ui/AppIcon';
import Button from '../../../components/ui/ui-components/Button';
import Image from '../../../components/ui/AppImage';

const InboxSection = ({ messages, onMarkAsRead, onReply }) => {
  const [, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredMessages = messages?.filter(message => {
    if (filter === 'unread') return !message?.isRead;
    if (filter === 'urgent') return message?.priority === 'urgent';
    return true;
  });

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      urgent: { color: 'bg-red-100 text-red-800', icon: 'AlertTriangle' },
      high: { color: 'bg-orange-100 text-orange-800', icon: 'AlertCircle' },
      normal: { color: 'bg-blue-100 text-blue-800', icon: 'Info' }
    };
    
    const config = priorityConfig?.[priority] || priorityConfig?.normal;
    
    return (
      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        <Icon name={config?.icon} size={12} />
        <span className="capitalize">{priority}</span>
      </div>
    );
  }; 

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.floor((now - messageTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 border border-border">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Messages & Inquiries</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({messages?.filter(m => !m?.isRead)?.length})
            </Button>
            <Button
              variant={filter === 'urgent' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('urgent')}
            >
              Urgent
            </Button>
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredMessages?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No messages found</h3>
            <p className="text-muted-foreground">
              {filter === 'unread' ? 'All messages have been read' : 'No messages match your filter'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredMessages?.map((message) => (
              <div
                key={message?.id}
                className={`p-4 hover:bg-accent transition-smooth cursor-pointer ${
                  !message?.isRead ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="flex items-start space-x-3">
                  <Image
                    src={message?.senderAvatar}
                    alt={message?.senderAvatarAlt}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-foreground">
                          {message?.senderName}
                        </h4>
                        {!message?.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(message?.priority)}
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(message?.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">
                        Re: {message?.resourceTitle}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Icon name="MapPin" size={12} />
                        <span>{message?.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-foreground line-clamp-2">
                      {message?.content}
                    </p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Icon name="Phone" size={12} />
                        <span>{message?.contactMethod}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!message?.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Check"
                            onClick={(e) => {
                              e?.stopPropagation();
                              onMarkAsRead(message?.id);
                            }}
                          />
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="Reply"
                          iconPosition="left"
                          onClick={(e) => {
                            e?.stopPropagation();
                            onReply(message?.id);
                          }}
                        >
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxSection;