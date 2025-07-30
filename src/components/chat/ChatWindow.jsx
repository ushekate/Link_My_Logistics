import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, X, User, Package, Truck, Building, Warehouse, XCircle } from 'lucide-react';

const ChatWindow = ({ 
  session, 
  messages = [], 
  currentUser, 
  onSendMessage, 
  onLoadMore = async () => ({ messages: [], pagination: { hasMore: false } }),
  onMarkAsRead = async () => {}
}) => {
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
      if (isNearBottom || messages.length === 0) {
        scrollToBottom();
      }
    }
    
    // Mark messages as read when component mounts or messages change
    if (messages.some(msg => !msg.isRead && msg.sender !== currentUser?.id)) {
      onMarkAsRead();
    }
  }, [messages, currentUser?.id, onMarkAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'CFS': return Package;
      case 'Transport': return Truck;
      case '3PL': return Building;
      case 'Warehouse': return Warehouse;
      default: return User;
    }
  };

  const getServiceColor = (serviceType) => {
    switch (serviceType) {
      case 'CFS': return 'text-blue-600';
      case 'Transport': return 'text-green-600';
      case '3PL': return 'text-purple-600';
      case 'Warehouse': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const handleSendMessage = async () => {
    if ((!messageText.trim() && attachments.length === 0) || isSending) return;
    
    setError(null);
    setIsSending(true);
    
    try {
      await onSendMessage(messageText.trim(), attachments[0] || null);
      setMessageText('');
      setAttachments([]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Handle loading more messages when scrolling to top
  const handleScroll = useCallback((e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      loadMoreMessages();
    }
  }, [hasMoreMessages, isLoadingMore]);
  
  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMoreMessages) return;
    
    setIsLoadingMore(true);
    setError(null);
    
    try {
      const nextPage = Math.ceil(messages.length / 50) + 1;
      const { messages: newMessages, pagination } = await onLoadMore(nextPage, 50);
      
      const container = messagesContainerRef.current;
      const oldScrollHeight = container.scrollHeight;
      
      // Update messages (prepend to maintain order)
      const updatedMessages = [...newMessages, ...messages];
      
      // Restore scroll position after messages are rendered
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight - oldScrollHeight;
      });
      
      setHasMoreMessages(pagination.hasMore);
    } catch (err) {
      console.error('Error loading more messages:', err);
      setError('Failed to load more messages. ' + (err.message || 'Please try again.'));
    } finally {
      setIsLoadingMore(false);
    }
  };

  const isMyMessage = (message) => {
    return message.sender === currentUser?.id;
  };

  const formatMessageTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachments([file]);
    }
  };

  const removeAttachment = () => {
    setAttachments([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const otherUser = session.client || { firstname: 'Unknown', lastname: 'User' };
  const ServiceIcon = getServiceIcon(session.serviceType);
  const serviceColorClass = getServiceColor(session.serviceType);

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden shadow-sm">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${serviceColorClass} bg-opacity-10`}>
              <ServiceIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {otherUser.firstname} {otherUser.lastname}
              </h3>
              <p className="text-sm text-gray-500">
                {session.serviceType || 'Logistics Service'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
              <Phone className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-2">
          <div className="flex items-center">
            <XCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Loading indicator for older messages */}
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isMine = isMyMessage(message);
            const showAvatar = index === 0 || messages[index - 1].sender !== message.sender;

            return (
              <div
                key={message.id || index}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-xs lg:max-w-md ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  {showAvatar && !isMine && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                      <User size={16} className="text-gray-600" />
                    </div>
                  )}
                  {!showAvatar && !isMine && <div className="w-10" />}

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isMine
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    {/* Message Content */}
                    {message.content && (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}

                    {/* File Attachments */}
                    {message.attachments?.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, attachIndex) => (
                          <div
                            key={attachIndex}
                            className={`flex items-center space-x-2 p-2 rounded ${
                              isMine ? 'bg-blue-500' : 'bg-gray-100'
                            }`}
                          >
                            <Paperclip size={14} />
                            <span className="text-xs flex-1 truncate">{attachment.name}</span>
                            <a 
                              href={attachment.url} 
                              download
                              className="text-xs hover:underline"
                            >
                              <Download size={12} />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Message Time */}
                    <div className={`text-xs mt-1 ${
                      isMine ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatMessageTime(message.created || new Date())}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {/* File attachment preview */}
        {attachments.length > 0 && (
          <div className="mb-2 p-2 bg-gray-50 rounded-lg relative">
            <div className="flex items-center">
              <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700 truncate">
                {attachments[0].name}
              </span>
              <button
                onClick={removeAttachment}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center">
          {/* File upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
            disabled={isSending}
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />
          </button>
          
          {/* Message input */}
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isSending}
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          
          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={isSending || (!messageText.trim() && !attachments.length)}
            className={`px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSending || (!messageText.trim() && !attachments.length)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
            }`}
          >
            {isSending ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;