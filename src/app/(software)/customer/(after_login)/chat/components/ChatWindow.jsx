import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, 
  Paperclip, 
  X, 
  User, 
  Package, 
  Truck, 
  Building, 
  Warehouse, 
  XCircle, 
  Phone, 
  Video, 
  MoreVertical 
} from 'lucide-react';

export default function ChatWindow({ 
  session, 
  messages = [], 
  currentUser, 
  onSendMessage, 
  onLoadMore = async () => ({ messages: [], pagination: { hasMore: false } }),
  onMarkAsRead = async () => {}
}) {
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
  }, [messages, currentUser?.id]);

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

  const getOtherUser = () => {
    return session.expand?.client || { firstname: 'Unknown', lastname: 'User' };
  };

  // State is already declared at the top of the component

  // Handle scroll to load more messages
  const handleScroll = useCallback((e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      loadMoreMessages();
    }
  }, [hasMoreMessages, isLoadingMore]);

  // Load more messages when scrolling to top
  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMoreMessages) return;
    
    setIsLoadingMore(true);
    setError(null);
    
    try {
      const nextPage = Math.ceil(messages.length / 50) + 1;
      const { messages: newMessages, pagination } = await onLoadMore(nextPage, 50);
      
      // Save scroll position
      const container = messagesContainerRef.current;
      const oldScrollHeight = container.scrollHeight;
      
      // Update messages (prepend to maintain order)
      setMessages(prev => [...newMessages, ...prev]);
      
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file)
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      URL.revokeObjectURL(newAttachments[index].url);
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMyMessage = (message) => {
    return message.sender === currentUser.id;
  };

  const otherUser = getOtherUser();
  const ServiceIcon = getServiceIcon(session.serviceType);
  const serviceColorClass = getServiceColor(session.serviceType);

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden shadow-sm">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* User Avatar */}
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={20} className="text-gray-600" />
            </div>
            
            {/* User Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {`${otherUser.firstname || ''} ${otherUser.lastname || ''}`.trim() || otherUser.username || 'Unknown User'}
              </h2>
              <div className="flex items-center space-x-2">
                {session.serviceType && (
                  <div className="flex items-center space-x-1">
                    <ServiceIcon size={14} className={serviceColorClass} />
                    <span className="text-sm text-gray-600">{session.serviceType}</span>
                  </div>
                )}
                <span className="text-sm text-gray-500">•</span>
                <span className={`text-sm ${
                  session.status === 'Active' ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {session.status}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Phone size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Video size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Chat Subject */}
        {session.subject && (
          <div className="mt-2 text-sm text-gray-600">
            <strong>Subject:</strong> {session.subject}
          </div>
        )}
      </div>

      {/* Messages Area */}
      {/* Error message display */}
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
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isMine = isMyMessage(message);
            const showAvatar = index === 0 || messages[index - 1]?.sender !== message.sender;
            const showTime = index === messages.length - 1 || messages[index + 1]?.sender !== message.sender;
            
            return (
              <div 
                key={message.id || index}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-4' : 'mt-1'}`}
              >
                {!isMine && showAvatar && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center mr-2">
                    <User size={16} className="text-gray-600" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${!isMine ? 'ml-2' : ''}`}>
                  <div 
                    className={`px-4 py-2 rounded-lg ${
                      isMine 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    
                    {message.attachment && (
                      <div className="mt-2">
                        <a 
                          href={message.attachment.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center text-xs text-blue-500 hover:underline"
                        >
                          <Paperclip size={12} className="mr-1" />
                          {message.attachment.name}
                        </a>
                      </div>
                    )}
                    
                    {showTime && (
                      <div className={`text-xs mt-1 text-right ${
                        isMine ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatMessageTime(message.created || message.timestamp)}
                      </div>
                    )}
                  </div>
                </div>
                
                {isMine && (
                  <div className="w-8 h-8 ml-2 flex-shrink-0">
                    {showAvatar && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* File attachment preview */}
      {attachments.length > 0 && (
        <div className="mb-2 p-2 bg-gray-50 rounded-lg relative">
          <div className="flex items-center">
            <Paperclip className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700 truncate">
              {attachments[0].name}
            </span>
            <button
              onClick={() => setAttachments([])}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}



      {/* Message Input Area */}
      {session.status === 'Open' ? (
        <div className="border-t border-gray-200 p-4 bg-white">
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
            </button>

            {/* Message input */}
            <div className="flex-1 mx-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isSending}
              />
            </div>

            {/* Send button */}
            <button
              onClick={handleSendMessage}
              disabled={isSending || (!messageText.trim() && !attachments.length)}
              className={`p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isSending || (!messageText.trim() && !attachments.length)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              <Send size={20} />
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>
      ) : (
        <div className="border-t border-gray-200 bg-gray-50 p-4 text-center">
          <p className="text-gray-600 text-sm">This chat has been closed. No new messages can be sent.</p>
        </div>
      )}
    </div>
  );
}