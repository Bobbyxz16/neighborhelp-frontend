import React, { useState, useEffect, useRef } from 'react';
import {
    Send,
    MessageSquare,
    User,
    Trash2,
    Search,
    X,
} from 'lucide-react';
import Button from '../../../components/ui/ui-components/Button';
import Input from '../../../components/ui/ui-components/Input';
import api from '../../../api/axios';
import { API_ENDPOINTS } from '../../../utils/constants';

const ProviderMessagesPage = ({ onMessagesRead, initialConversationId }) => {
    // State
    const [messages, setMessages] = useState([]);
    const [replyContent, setReplyContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCompose, setShowCompose] = useState(false);
    const [composeForm, setComposeForm] = useState({
        resourceId: '',
        subject: '',
        content: '',
        priority: 'NORMAL',
        contactMethod: 'EMAIL'
    });
    const [myResources, setMyResources] = useState([]);
    const [error, setError] = useState('');
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);

        // Helper to get user image with fallback
    const getUserImage = (user) => {
        if (!user) return null;

        // Check if user has avatar from backend
        if (user.avatar) {
            return user.avatar;
        }

        // Fallback to UI Avatars
        if (user.organizationName || user.name?.includes(' ')) {
            // Organization or full name
            const name = user.organizationName || user.name;
            return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&size=120&background=10b981&color=fff';
        } else {
            // Username or email fallback
            const name = user.name || user.username || user.email || 'User';
            return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&size=120&background=4f46e5&color=fff';
        }
    };

    // Update fetchConversations to use backend avatars
    const fetchConversations = async () => {
        setIsLoading(true);
        try {
            const [inboxResponse, sentResponse] = await Promise.all([
                api.get(`${API_ENDPOINTS.MESSAGES.INBOX}?size=100`),
                api.get(`${API_ENDPOINTS.MESSAGES.SENT}?size=100`)
            ]);

            const inboxMessages = (inboxResponse.data.content || inboxResponse.data || []).map(msg => ({
                ...msg,
                isSentByMe: false
            }));

            const sentMessages = (sentResponse.data.content || sentResponse.data || []).map(msg => ({
                ...msg,
                isSentByMe: true
            }));

            const allMessages = [...inboxMessages, ...sentMessages];
            const conversationMap = new Map();

            allMessages.forEach(message => {
                const isSentByMe = message.isSentByMe;
                const otherUser = isSentByMe ? message.recipient : message.sender;
                const otherUserId = otherUser?.id;
                const otherUserName = otherUser?.name || otherUser?.organizationName || 'Unknown User';
                
                // Use avatar from backend response
                const otherUserImage = getUserImage(otherUser);

                if (!otherUserId) return;

                if (!conversationMap.has(otherUserId)) {
                    conversationMap.set(otherUserId, {
                        id: otherUserId,
                        userName: otherUserName,
                        userEmail: otherUser?.email,
                        userImage: otherUserImage,
                        userAvatar: otherUser?.avatar, // Store original avatar
                        messages: [],
                        unreadCount: 0,
                        lastMessageDate: message.createdAt
                    });
                }

                const conversation = conversationMap.get(otherUserId);
                conversation.messages.push({ ...message, isSentByMe });

                if (!message.isRead && !isSentByMe) {
                    conversation.unreadCount++;
                }

                if (new Date(message.createdAt) > new Date(conversation.lastMessageDate)) {
                    conversation.lastMessageDate = message.createdAt;
                }
            });

            const sortedConversations = Array.from(conversationMap.values())
                .map(conv => ({
                    ...conv,
                    messages: conv.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                }))
                .sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));

            setConversations(sortedConversations);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchConversationMessages = async (conversationId) => {
        if (!conversationId) return;

        try {
            const conversation = conversations.find(c => c.id === conversationId);
            if (conversation) {
                setMessages(conversation.messages);
                setSelectedConversationId(conversationId);

                // Mark unread messages as read
                const unreadMessages = conversation.messages.filter(msg => !msg.isRead && !msg.isSentByMe);
                if (unreadMessages.length > 0) {
                    unreadMessages.forEach(msg => markAsRead(msg.id));
                    // Notify parent component about read messages
                    if (onMessagesRead) {
                        onMessagesRead(unreadMessages.map(m => m.id));
                    }
                }

                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } catch (error) {
            console.error('Failed to fetch conversation messages:', error);
        }
    };

    const fetchMyResources = async () => {
        try {
            const { data } = await api.get(API_ENDPOINTS.RESOURCES.MY_RESOURCES, {
                params: { size: 100, sort: 'createdAt', direction: 'desc' }
            });
            setMyResources(data.content || data || []);
        } catch (error) {
            console.error('Failed to fetch resources:', error);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const { data } = await api.get(API_ENDPOINTS.USERS.ME);
            setCurrentUser(data);
        } catch (error) {
            console.error('Failed to fetch current user:', error);
        }
    };

    const markAsRead = async (messageId) => {
        try {
            await api.patch(API_ENDPOINTS.MESSAGES.MARK_READ(messageId));

            setMessages(prev =>
                prev.map(msg => msg.id === messageId ? { ...msg, isRead: true } : msg)
            );

            if (selectedConversationId) {
                setConversations(prev =>
                    prev.map(conv => {
                        if (conv.id === selectedConversationId) {
                            return {
                                ...conv,
                                unreadCount: Math.max(0, conv.unreadCount - 1),
                                messages: conv.messages.map(msg =>
                                    msg.id === messageId ? { ...msg, isRead: true } : msg
                                )
                            };
                        }
                        return conv;
                    })
                );
            }

            if (onMessagesRead) {
                onMessagesRead([messageId]);
            }
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const handleReplyInConversation = async () => {
        if (!replyContent.trim() || !selectedConversationId) return;

        setIsSending(true);
        try {
            const lastMessage = messages[messages.length - 1];

            const replyData = {
                recipientId: selectedConversationId,
                subject: lastMessage?.subject ? `Re: ${lastMessage.subject.replace(/^Re: /, '')}` : 'Message',
                content: replyContent,
                priority: 'NORMAL'
            };

            if (lastMessage?.resource?.id) {
                replyData.resourceId = lastMessage.resource.id;
            }

            const response = await api.post(API_ENDPOINTS.MESSAGES.SEND, replyData);

            const newMessage = { ...response.data, isSentByMe: true };

            setMessages(prev => [...prev, newMessage]);

            setConversations(prev =>
                prev.map(conv => {
                    if (conv.id === selectedConversationId) {
                        return {
                            ...conv,
                            messages: [...conv.messages, newMessage],
                            lastMessageDate: newMessage.createdAt
                        };
                    }
                    return conv;
                })
            );

            setReplyContent('');
            setError('');

            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error('Failed to send reply:', error);
            if (error.response?.status === 401) {
                setError('You cannot reply to your own message.');
            } else {
                setError(error.response?.data?.message || 'Failed to send message. Please try again.');
            }
        } finally {
            setIsSending(false);
        }
    };

    const handleSendNewMessage = async () => {
        if (!composeForm.resourceId || !composeForm.subject.trim() || !composeForm.content.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSending(true);
        try {
            const payload = {
                resourceId: Number(composeForm.resourceId),
                subject: composeForm.subject,
                content: composeForm.content,
                priority: composeForm.priority || 'NORMAL',
                contactMethod: composeForm.contactMethod || 'EMAIL'
            };

            const response = await api.post(API_ENDPOINTS.MESSAGES.SEND, payload);

            const newMessage = { ...response.data, isSentByMe: true };
            const recipientId = newMessage.recipient?.id;
            const recipientName = newMessage.recipient?.organizationName || newMessage.recipient?.name;
            const recipientImage = getUserImage(newMessage.recipient);

            setConversations(prev => {
                const existingConvIndex = prev.findIndex(c => c.id === recipientId);

                if (existingConvIndex >= 0) {
                    const updatedConvs = [...prev];
                    updatedConvs[existingConvIndex] = {
                        ...updatedConvs[existingConvIndex],
                        messages: [...updatedConvs[existingConvIndex].messages, newMessage],
                        lastMessageDate: newMessage.createdAt
                    };
                    return updatedConvs;
                } else {
                    const newConversation = {
                        id: recipientId,
                        userName: recipientName,
                        userEmail: newMessage.recipient?.email,
                        userImage: recipientImage,
                        messages: [newMessage],
                        unreadCount: 0,
                        lastMessageDate: newMessage.createdAt
                    };
                    return [newConversation, ...prev];
                }
            });

            setShowCompose(false);
            setComposeForm({
                resourceId: '',
                subject: '',
                content: '',
                priority: 'NORMAL',
                contactMethod: 'EMAIL'
            });
            fetchConversations();
            setError('');
        } catch (error) {
            console.error('Failed to send message:', error);
            setError('Failed to send message. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const handleDelete = async (messageId) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            await api.delete(API_ENDPOINTS.MESSAGES.DELETE(messageId));

            setMessages(prev => prev.filter(msg => msg.id !== messageId));

            setConversations(prev =>
                prev.map(conv => ({
                    ...conv,
                    messages: conv.messages.filter(msg => msg.id !== messageId)
                })).filter(conv => conv.messages.length > 0)
            );

            const updatedConv = conversations.find(c => c.id === selectedConversationId);
            if (updatedConv && updatedConv.messages.filter(m => m.id !== messageId).length === 0) {
                setSelectedConversationId(null);
                setMessages([]);
            }

            setError('');
        } catch (error) {
            console.error('Failed to delete message:', error);
            setError('Failed to delete message. Please try again.');
        }
    };

    useEffect(() => {
        fetchConversations();
        fetchMyResources();
        fetchCurrentUser();
    }, []);

    // Handle initial conversation selection
    useEffect(() => {
        if (initialConversationId && conversations.length > 0) {
            const conversation = conversations.find(c => c.id === initialConversationId);
            if (conversation) {
                fetchConversationMessages(initialConversationId);
            }
        }
    }, [initialConversationId, conversations.length]);

    const filteredConversations = conversations.filter(conv =>
        conv.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.messages.some(msg =>
            msg.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
        if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const getLastMessagePreview = (conversation) => {
        if (!conversation.messages || conversation.messages.length === 0) return '';
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        const prefix = lastMessage.isSentByMe ? 'You: ' : '';
        const content = lastMessage.content?.substring(0, 40) + (lastMessage.content?.length > 40 ? '...' : '');
        return prefix + content;
    };

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    if (isLoading && conversations.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-gray-600">Loading your messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[calc(100vh-200px)] flex flex-col">
            {/* Error Message */}
            {error && (
                <div className="m-4 mb-0 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <X className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-800 text-sm">{error}</p>
                    <button onClick={() => setError('')} className="ml-auto">
                        <X className="h-4 w-4 text-red-600" />
                    </button>
                </div>
            )}

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Inbox (Conversations) */}
                <div className="w-1/3 border-r border-gray-200 flex flex-col min-w-[300px]">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                        <h2 className="text-lg font-semibold text-gray-900">Inbox</h2>
                        
                    </div>

                    {/* Search */}
                    <div className="p-4 border-b border-gray-200 flex-shrink-0">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Conversations List - Scrollable */}
                    <div
                        className="flex-1 overflow-y-auto"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#d1d5db #f3f4f6'
                        }}
                    >
                        {filteredConversations.length === 0 ? (
                            <div className="p-8 text-center">
                                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    {searchTerm ? 'No conversations found' : 'No conversations yet'}
                                </p>
                                <p className="text-sm text-gray-400 mt-2 mb-4">
                                    Start a conversation by sending a new message
                                </p>
                            
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredConversations.map((conversation) => (
                                    <button
                                        key={conversation.id}
                                        onClick={() => fetchConversationMessages(conversation.id)}
                                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${selectedConversationId === conversation.id
                                            ? 'bg-blue-50 border-l-4 border-blue-600'
                                            : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={conversation.userImage}
                                                    alt={conversation.userName}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h3 className={`text-sm font-medium text-gray-900 truncate ${conversation.unreadCount > 0 ? 'font-bold' : ''
                                                        }`}>
                                                        {conversation.userName}
                                                    </h3>
                                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                        {formatDate(conversation.lastMessageDate)}
                                                    </span>
                                                </div>
                                                <p className={`text-sm truncate mt-1 ${conversation.unreadCount > 0
                                                    ? 'text-gray-900 font-medium'
                                                    : 'text-gray-600'
                                                    }`}>
                                                    {getLastMessagePreview(conversation)}
                                                </p>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-xs text-gray-500">
                                                        {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
                                                    </span>
                                                    {conversation.unreadCount > 0 && (
                                                        <span className="text-xs bg-blue-600 text-white rounded-full h-5 min-w-[20px] px-1.5 flex items-center justify-center">
                                                            {conversation.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content - Chat View */}
                <div className="flex-1 flex flex-col bg-gray-50">
                    {selectedConversationId ? (
                        <>
                            {/* Conversation Header */}
                            <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={selectedConversation.userImage}
                                        alt={selectedConversation?.userName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {selectedConversation?.userName}
                                        </h2>
                                        <p className="text-sm text-gray-500">{selectedConversation?.userEmail}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages List - Chat Style with Scroll */}
                            <div
                                className="flex-1 p-4 overflow-y-auto space-y-4"
                                style={{
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#d1d5db #f3f4f6'
                                }}
                            >
                                {messages.length === 0 ? (
                                    <div className="text-center py-12">
                                        <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                                        <p className="text-gray-500">Start a conversation by sending a message below.</p>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((message, index) => {
                                            const showDate = index === 0 ||
                                                new Date(message.createdAt).toDateString() !==
                                                new Date(messages[index - 1].createdAt).toDateString();

                                            return (
                                                <React.Fragment key={message.id}>
                                                    {showDate && (
                                                        <div className="flex justify-center my-4">
                                                            <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                                                {new Date(message.createdAt).toLocaleDateString('en-US', {
                                                                    weekday: 'short',
                                                                    month: 'short',
                                                                    day: 'numeric'
                                                                })}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className={`flex ${message.isSentByMe ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`flex items-end gap-2 max-w-[75%] ${message.isSentByMe ? 'flex-row-reverse' : ''}`}>
                                                            {!message.isSentByMe && (
                                                                <div className="flex-shrink-0 mb-1">
                                                                    <img
                                                                        src={selectedConversation?.userImage}
                                                                        alt=""
                                                                        className="w-8 h-8 rounded-full object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            {message.isSentByMe && (
                                                                <div className="flex-shrink-0 mb-1">
                                                                    <img
                                                                        src={getUserImage(currentUser)}
                                                                        alt="Me"
                                                                        className="w-8 h-8 rounded-full object-cover"
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className={`group relative ${message.isSentByMe ? 'items-end' : 'items-start'}`}>
                                                                <div
                                                                    className={`px-4 py-2 rounded-2xl ${message.isSentByMe
                                                                        ? 'bg-blue-600 text-white rounded-br-md'
                                                                        : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md shadow-sm'
                                                                        }`}
                                                                >
                                                                    {message.subject && !message.subject.startsWith('Re:') && (
                                                                        <p className={`text-xs font-medium mb-1 ${message.isSentByMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                                                            {message.subject}
                                                                        </p>
                                                                    )}
                                                                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                                                </div>
                                                                <div className={`flex items-center gap-2 mt-1 ${message.isSentByMe ? 'justify-end' : 'justify-start'}`}>
                                                                    <span className="text-xs text-gray-500">
                                                                        {formatTime(message.createdAt)}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleDelete(message.id)}
                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                                                                    >
                                                                        <Trash2 className="h-3 w-3 text-gray-400" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Reply Form - Always visible */}
                            <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
                                <div className="flex items-end gap-3">
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleReplyInConversation();
                                            }
                                        }}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                        rows="1"
                                        style={{ minHeight: '44px', maxHeight: '120px' }}
                                    />
                                    <Button
                                        onClick={handleReplyInConversation}
                                        disabled={!replyContent.trim() || isSending}
                                        className="h-11 w-11 rounded-full p-0 flex items-center justify-center"
                                    >
                                        <Send className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center p-8">
                                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Select a conversation
                                </h3>
                                <p className="text-gray-500 max-w-md mb-6">
                                    Choose a conversation from your inbox to view the message history, or start a new conversation.
                                </p>
                            
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Compose Modal */}
            {showCompose && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">New Message</h2>
                                <button
                                    onClick={() => {
                                        setShowCompose(false);
                                        setError('');
                                    }}
                                    className="p-2 -mr-2 rounded-lg hover:bg-gray-100"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Related Resource <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={composeForm.resourceId}
                                    onChange={(e) => setComposeForm(prev => ({ ...prev, resourceId: e.target.value }))}
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select a resource</option>
                                    {myResources.map(resource => (
                                        <option key={resource.id} value={resource.id}>
                                            {resource.title}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    Select one of your resources to provide context for this message.
                                </p>
                            </div>

                            <Input
                                label="Subject"
                                value={composeForm.subject}
                                onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                                placeholder="Enter subject"
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={composeForm.content}
                                    onChange={(e) => setComposeForm(prev => ({ ...prev, content: e.target.value }))}
                                    placeholder="Type your message..."
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    rows="6"
                                    required
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowCompose(false);
                                    setError('');
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSendNewMessage}
                                disabled={!composeForm.resourceId || !composeForm.subject.trim() || !composeForm.content.trim() || isSending}
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

export default ProviderMessagesPage;
