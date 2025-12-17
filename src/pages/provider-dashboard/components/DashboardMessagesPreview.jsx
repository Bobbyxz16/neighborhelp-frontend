import React from 'react';
import { MessageSquare, User, Clock } from 'lucide-react';
import Button from '../../../components/ui/ui-components/Button';

// Helper to get user image with fallback
const getUserImage = (user) => {
    if (!user) return null;

    if (user.organizationName) {
        // Organization logic
        const logo = user.profile?.avatar || user.avatar;
        if (logo) return logo;
        return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.organizationName) + '&size=120&background=10b981&color=fff';
    } else {
        // Individual user logic
        const avatar = user.profile?.avatar || user.avatar;
        if (avatar) return avatar;

        const name = user.name || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username) || 'User';
        return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&size=120&background=4f46e5&color=fff';
    }
};

const DashboardMessagesPreview = ({ conversations, onConversationClick }) => {
    const formatTimeAgo = (timestamp) => {
        if (!timestamp) return '';
        const now = new Date();
        const messageTime = new Date(timestamp);
        const diffInHours = Math.floor((now - messageTime) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Messages & Inquiries</h2>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {conversations?.reduce((acc, c) => acc + c.unreadCount, 0)} New
                </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px]">
                {conversations?.length === 0 ? (
                    <div className="p-8 text-center">
                        <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No recent conversations</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {conversations?.map((conversation) => (
                            <button
                                key={conversation.id}
                                onClick={() => onConversationClick(conversation)}
                                className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 group"
                            >
                                <div className="flex-shrink-0 relative">
                                    {getUserImage(conversation?.user) ? (
                                        <img
                                            src={getUserImage(conversation.re)}
                                            alt={conversation.userName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                    )}
                                    {conversation.unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                                            {conversation.unreadCount}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                            {conversation.userName}
                                        </h4>
                                        <div className="flex items-center text-xs text-gray-400">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {formatTimeAgo(conversation.lastMessageDate)}
                                        </div>
                                    </div>

                                    <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {conversation.lastMessage}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {conversations?.length > 0 && (
                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <Button
                        variant="ghost"
                        className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 justify-center"
                        onClick={() => onConversationClick({ id: null })} // Go to messages tab generally
                    >
                        View All Messages
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DashboardMessagesPreview;
