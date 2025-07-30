'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Plus, Search, Filter, Users, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import customerClientChatService from '@/services/customerClientChatService';
import ClientChatSessionList from './components/ClientChatSessionList';
import ClientChatWindow from './components/ClientChatWindow';
import { toast } from 'sonner';

export default function ClientCustomerChatPage() {
  const { user } = useAuth();
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, closed
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewChats, setHasNewChats] = useState(false);

  // Load chat sessions on component mount
  useEffect(() => {
    if (user) {
      loadChatSessions();
      loadUnreadCount();
    }
  }, [user]);

  // Subscribe to real-time updates for selected session
  useEffect(() => {
    if (selectedSession) {
      const handleNewMessage = (event) => {
        if (event.action === 'create') {
          // Refresh the selected session to show new message
          loadSelectedSession(selectedSession.id);
          // Refresh sessions list to update last message
          loadChatSessions();
        }
      };

      const handleSessionUpdate = (event) => {
        // Refresh sessions list when session is updated
        loadChatSessions();
      };

      customerClientChatService.subscribeToChat(
        selectedSession.id,
        handleNewMessage,
        handleSessionUpdate
      );

      return () => {
        customerClientChatService.unsubscribeFromChat();
      };
    }
  }, [selectedSession]);

  // Subscribe to new chat sessions globally for this client
  useEffect(() => {
    if (user?.id) {
      const handleNewChatSession = async (event) => {
        console.log('New chat session created:', event.record);

        // Set flag for new chat indicator
        setHasNewChats(true);

        try {
          // Get the customer details for the notification
          const sessionData = await customerClientChatService.getChatSession(event.record.id, user.id);
          const session = sessionData.session;
          const customerName = session.expand?.customer?.firstname ||
                              session.expand?.customer?.username ||
                              'A customer';

          // Show notification with customer name and subject
          const subject = event.record.subject || 'General Inquiry';
          toast.success(
            `New chat: ${customerName} started "${subject}"`,
            {
              duration: 5000,
              action: {
                label: 'View',
                onClick: () => {
                  handleSessionSelect(session);
                  setHasNewChats(false); // Clear the indicator when viewed
                }
              }
            }
          );

          // Refresh the chat sessions list to show the new chat
          loadChatSessions();

          // If no session is currently selected, auto-select the new one
          if (!selectedSession) {
            handleSessionSelect(session);
            setHasNewChats(false); // Clear the indicator when auto-selected
          }
        } catch (error) {
          console.error('Error handling new chat session:', error);
          // Fallback notification - use data from the event record directly
          const customerName = event.record.expand?.customer?.firstname ||
                              event.record.expand?.customer?.username ||
                              'A customer';
          const subject = event.record.subject || 'General Inquiry';
          toast.success(`New chat: ${customerName} started "${subject}"`);
          loadChatSessions();
        }
      };

      customerClientChatService.subscribeToNewChatSessions(user.id, handleNewChatSession);

      return () => {
        customerClientChatService.unsubscribeFromNewChatSessions();
      };
    }
  }, [user?.id, selectedSession]);

  const loadChatSessions = async () => {
    try {
      setLoading(true);
      const sessions = await customerClientChatService.getChatSessions(user.id, 'client');
      setChatSessions(sessions);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      toast.error('Failed to load chat sessions');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await customerClientChatService.getUnreadMessageCount(user.id, 'client');
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const loadSelectedSession = async (sessionId) => {
    try {
      const sessionData = await customerClientChatService.getChatSession(sessionId, user.id);
      setSelectedSession(sessionData);
      
      // Mark messages as read
      await customerClientChatService.markMessagesAsRead(sessionId, user.id);
      loadUnreadCount();
    } catch (error) {
      console.error('Error loading selected session:', error);
      toast.error('Failed to load chat session');
    }
  };

  const handleSessionSelect = (session) => {
    loadSelectedSession(session.id);
    setHasNewChats(false); // Clear new chat indicator when user selects a session
  };

  const handleSendMessage = async (content, attachment) => {
    if (!selectedSession) return;

    try {
      await customerClientChatService.sendMessage(
        selectedSession.session.id,
        user.id,
        content,
        attachment
      );

      // Refresh the session to show new message
      loadSelectedSession(selectedSession.session.id);
      loadChatSessions();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };



  const handleCloseChat = async (sessionId) => {
    try {
      await customerClientChatService.closeChatSession(sessionId, user.id);
      loadChatSessions();
      if (selectedSession?.session.id === sessionId) {
        setSelectedSession(null);
      }
      toast.success('Chat session closed');
    } catch (error) {
      console.error('Error closing chat:', error);
      toast.error('Failed to close chat');
    }
  };

  // Filter chat sessions based on search and status
  const filteredSessions = chatSessions.filter(session => {
    const matchesSearch = !searchTerm || 
      session.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.expand?.customer?.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.expand?.customer?.lastname?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && session.status === 'Open') ||
      (filterStatus === 'closed' && session.status === 'Close');
    
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please log in to access chat</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - Chat Sessions */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="text-blue-600" size={24} />
              <h1 className="text-xl font-semibold text-gray-800">Customer Messages</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
              {hasNewChats && (
                <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 animate-pulse">
                  NEW
                </span>
              )}
            </div>
          </div>

          {/* Search and Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Chats</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat Sessions List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredSessions.length > 0 ? (
            <ClientChatSessionList
              sessions={filteredSessions}
              selectedSession={selectedSession?.session}
              onSessionSelect={handleSessionSelect}
              onCloseChat={handleCloseChat}
              currentUserId={user.id}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <Users size={48} className="mb-2 opacity-50" />
              <p className="text-sm">No customer conversations found</p>
              <p className="text-xs text-gray-400 mt-1">
                Customers will appear here when they start a chat with you
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <ClientChatWindow
            session={selectedSession.session}
            messages={selectedSession.messages}
            currentUser={user}
            onSendMessage={handleSendMessage}
            onCloseChat={handleCloseChat}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Select a customer conversation
              </h3>
              <p className="text-gray-500 mb-4">
                Choose a conversation from the sidebar to start messaging with customers
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
                <h4 className="font-medium text-blue-800 mb-2">💡 Pro Tip</h4>
                <p className="text-sm text-blue-700">
                  Customers can start new conversations with you from their dashboard. 
                  You'll see new messages appear here automatically.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}