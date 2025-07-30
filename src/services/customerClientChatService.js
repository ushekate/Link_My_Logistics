/**
 * Customer-Client Chat Service
 * Uses unified chat_session and messages collections
 * Supports both GOL support chat and client-customer communication
 */

import pbclient from '@/lib/db';

class CustomerClientChatService {
  constructor() {
    this.pb = pbclient;
  }

  /**
   * Create a new chat session between customer and client
   * @param {string} customerId - Customer user ID
   * @param {string} clientId - Client user ID
   * @param {string} subject - Chat subject/topic
   * @param {string} serviceType - Type of service (CFS, Transport, 3PL, Warehouse)
   * @returns {Promise<Object>} Created chat session
   */
  async createChatSession(customerId, clientId, subject = '', serviceType = '') {
    try {
      // Check if a chat session already exists between these userst
      this.pb.autoCancellation(false);
      const existingSessions = await this.pb.collection('chat_session').getList(1, 1, {
        filter: `chatType = "client_customer" && ((customer = "${customerId}" && client = "${clientId}") || (customer = "${clientId}" && client = "${customerId}"))`,
        sort: '-created'
      });

      if (existingSessions.items.length > 0) {
        console.log('Existing chat session found:', existingSessions.items[0]);
        return existingSessions.items[0];
      }

      // Create new chat session (same as GOL system)
      const sessionData = {
        chatType: 'client_customer',
        customer: customerId,
        client: clientId,
        subject: subject || 'General Inquiry',
        serviceType: serviceType,
        status: 'Open',
        lastMessageAt: new Date().toISOString()
      };

      console.log('Creating new chat session:', sessionData);
      const session = await this.pb.collection('chat_session').create(sessionData);
      console.log('Chat session created successfully:', session);

      return session;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw error;
    }
  }

  /**
   * Get chat sessions for a user
   * @param {string} userId - User ID (customer or client)
   * @param {string} userType - 'customer' or 'client'
   * @returns {Promise<Array>} List of chat sessions
   */
  async getChatSessions(userId, userType = 'customer') {
    try {
      const filter = userType === 'customer'
        ? `chatType = "client_customer" && customer = "${userId}"`
        : `chatType = "client_customer" && client = "${userId}"`;
      this.pb.autoCancellation(false);
      const sessions = await this.pb.collection('chat_session').getList(1, 50, {
        filter: filter,
        sort: '-lastMessageAt,-created',
        expand: 'customer,client'
      });

      console.log(`Retrieved ${sessions.items.length} chat sessions for ${userType}:`, userId);
      return sessions.items;
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      throw error;
    }
  }

  /**
   * Get a specific chat session with messages
   * @param {string} sessionId - Chat session ID
   * @param {string} userId - Current user ID for access control
   * @returns {Promise<Object>} Chat session with messages
   */
  /**
   * Get a specific chat session with paginated messages
   * @param {string} sessionId - Chat session ID
   * @param {string} userId - Current user ID for access control
   * @param {number} page - Page number (1-based)
   * @param {number} perPage - Number of messages per page
   * @returns {Promise<{session: Object, messages: Array, totalPages: number}>} Chat session with paginated messages
   */
  async getChatSession(sessionId, userId, page = 1, perPage = 50) {
    try {
      if (!sessionId || !userId) {
        throw new Error('Missing required parameters: sessionId and userId are required');
      }

      // Get the chat session with expanded user data
      this.pb.autoCancellation(false);
      const session = await this.pb.collection('chat_session').getOne(sessionId, {
        expand: 'customer,client'
      });

      // Verify this is a client-customer chat and user has access
      if (session.chatType !== 'client_customer') {
        throw new Error('Invalid chat session type');
      }

      const canAccess = session.customer === userId || session.client === userId;
      if (!canAccess) {
        throw new Error('You do not have permission to view this chat');
      }

      // Get paginated messages with error handling for empty results
      let messages = [];
      let totalPages = 1;
      let totalItems = 0;

      try {
        const result = await this.pb.collection('messages').getList(page, perPage, {
          filter: `chat = "${sessionId}"`,
          sort: '-created', // Newest first for pagination
          expand: 'sender'
        });

        messages = result.items;
        totalItems = result.totalItems;
        totalPages = Math.ceil(totalItems / perPage);
      } catch (error) {
        // Handle case where no messages exist yet
        if (error.status === 404 || error.status === 0) {
          console.log('No messages found for this chat yet');
        } else {
          throw error;
        }
      }

      // Mark messages as read if they belong to the other user
      if (messages.length > 0) {
        const unreadMessages = messages.filter(
          msg => !msg.isRead && msg.sender !== userId
        );
        
        if (unreadMessages.length > 0) {
          await this.markMessagesAsRead(sessionId, userId);
        }
      }

      return {
        session,
        messages: messages.reverse(), // Return in chronological order
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages,
          hasMore: page < totalPages
        }
      };
    } catch (error) {
      console.error('Error in getChatSession:', {
        error: error.message,
        sessionId,
        userId,
        status: error.status
      });
      
      // Rethrow with more context if needed
      if (error.status === 403) {
        throw new Error('You do not have permission to access this chat');
      } else if (error.status === 404) {
        throw new Error('Chat session not found');
      } else if (!navigator.onLine) {
        throw new Error('Network error: You are currently offline');
      } else {
        throw new Error(`Failed to load chat: ${error.message}`);
      }
    }
  }

  /**
   * Send a message in a chat session
   * @param {string} sessionId - Chat session ID
   * @param {string} senderId - Sender user ID
   * @param {string} content - Message content
   * @param {File} attachment - Optional file attachment
   * @returns {Promise<Object>} Created message
   */
  async sendMessage(sessionId, senderId, content, attachment = null) {
    try {
      // Input validation
      if (!sessionId || !senderId) {
        throw new Error('Missing required parameters: sessionId and senderId are required');
      }

      if (!content?.trim() && !attachment) {
        throw new Error('Message cannot be empty');
      }

      // Prepare message data
      const messageData = {
        chat: sessionId,
        sender: senderId,
        content: (content || '').trim(),
        messageType: attachment ? 'file' : 'text',
        isRead: false,
        status: 'sending'
      };

      // Handle file attachment if provided
      if (attachment) {
        // Validate file size (e.g., 10MB limit)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        if (attachment.size > MAX_FILE_SIZE) {
          throw new Error('File size exceeds the 10MB limit');
        }

        // Validate file type if needed
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(attachment.type)) {
          throw new Error('Unsupported file type. Please upload images, PDF, or Word documents');
        }

        const formData = new FormData();
        formData.append('file', attachment);
        
        // Add message data to FormData
        Object.entries(messageData).forEach(([key, value]) => {
          formData.append(key, value);
        });

        // Handle both old format (direct File) and new format (object with file property)
        const file = attachment.file || attachment;

        console.log('File details:', {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        });

        formData.append('attachments', file);
        messageData.messageType = 'file';

        console.log('Sending message with attachment via FormData');
        const result = await this.pb.collection('messages').create(formData);
        console.log('Message with attachment sent successfully:', result);

        // Update last message time

        while (retryCount < maxRetries) {
          try {
            message = await this.pb.collection('messages').create(formData);
            
            // Update last message timestamp
            await this.updateLastMessageTime(sessionId);
            
            // Update message status to sent
            message.status = 'sent';
            return message;
            
          } catch (error) {
            lastError = error;
            retryCount++;
            
            // Don't retry for client-side errors
            if (error.status >= 400 && error.status < 500) {
              break;
            }
            
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          }
        }
        
        // If we get here, all retries failed
        throw lastError || new Error('Failed to send message after multiple attempts');
      }

      // Send the message with retry logic
      let message;
      const maxRetries = 3;
      let retryCount = 0;
      let lastError;

      while (retryCount < maxRetries) {
        try {
          message = await this.pb.collection('messages').create(messageData);
          
          // Update last message timestamp
          await this.updateLastMessageTime(sessionId);
          
          // Update message status to sent
          message.status = 'sent';
          return message;
          
        } catch (error) {
          lastError = error;
          retryCount++;
          
          // Don't retry for client-side errors
          if (error.status >= 400 && error.status < 500) {
            break;
          }
          
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
        }
      }
      
      // If we get here, all retries failed
      throw lastError || new Error('Failed to send message after multiple attempts');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Update the last message timestamp for a chat session
   * @param {string} sessionId - Chat session ID
   */
  async updateLastMessageTime(sessionId) {
    try {
      await this.pb.collection('chat_session').update(sessionId, {
        lastMessageAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating last message time:', error);
    }
  }

  /**
   * Mark messages as read
   * @param {string} sessionId - Chat session ID
   * @param {string} userId - User ID marking messages as read
   */
  async markMessagesAsRead(sessionId, userId) {
    try {
      // Get unread messages for this user
      const unreadMessages = await this.pb.collection('messages').getList(1, 100, {
        filter: `chat = "${sessionId}" && sender != "${userId}" && isRead = false`
      });

      // Mark each message as read
      for (const message of unreadMessages.items) {
        await this.pb.collection('messages').update(message.id, {
          isRead: true,
          readAt: new Date().toISOString()
        });
      }

      console.log(`Marked ${unreadMessages.items.length} messages as read`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  /**
   * Get unread message count for a user
   * @param {string} userId - User ID
   * @param {string} userType - 'customer' or 'client'
   * @returns {Promise<number>} Number of unread messages
   */
  async getUnreadMessageCount(userId, userType = 'customer') {
    try {
      // Get all chat sessions for this user
      const sessions = await this.getChatSessions(userId, userType);
      const sessionIds = sessions.map(session => session.id);

      if (sessionIds.length === 0) return 0;

      // Count unread messages across all sessions
      const filter = `chat.id ?~ "${sessionIds.join('|')}" && sender != "${userId}" && isRead = false`;
      
      const unreadMessages = await this.pb.collection('messages').getList(1, 1, {
        filter: filter
      });

      return unreadMessages.totalItems;
    } catch (error) {
      console.error('Error getting unread message count:', error);
      return 0;
    }
  }

  /**
   * Accept a pending chat request (client accepts customer's chat request)
   * @param {string} sessionId - Chat session ID
   * @param {string} clientId - Client user ID accepting the request
   * @returns {Promise<Object>} Updated chat session
   */
  async acceptChatRequest(sessionId, clientId) {
    try {
      // Get the session to verify it's pending and belongs to this client
      const session = await this.pb.collection('chat_session').getOne(sessionId);

      if (session.chatType !== 'client_customer') {
        throw new Error('Invalid chat session type');
      }

      if (session.client !== clientId) {
        throw new Error('You are not authorized to accept this chat request');
      }

      if (session.status !== 'Pending') {
        throw new Error('This chat request has already been processed');
      }

      // Update session status to Active
      const updatedSession = await this.pb.collection('chat_session').update(sessionId, {
        status: 'Active',
        acceptedAt: new Date().toISOString(),
        acceptedBy: clientId
      });

      // Send welcome message from client
      await this.sendMessage(sessionId, clientId,
        "Hello! I've accepted your chat request. How can I help you today?"
      );

      console.log('Chat request accepted:', sessionId);
      return updatedSession;
    } catch (error) {
      console.error('Error accepting chat request:', error);
      throw error;
    }
  }

  /**
   * Reject a pending chat request (client rejects customer's chat request)
   * @param {string} sessionId - Chat session ID
   * @param {string} clientId - Client user ID rejecting the request
   * @param {string} reason - Optional reason for rejection
   * @returns {Promise<Object>} Updated chat session
   */
  async rejectChatRequest(sessionId, clientId, reason = '') {
    try {
      // Get the session to verify it's pending and belongs to this client
      const session = await this.pb.collection('chat_session').getOne(sessionId);

      if (session.chatType !== 'client_customer') {
        throw new Error('Invalid chat session type');
      }

      if (session.client !== clientId) {
        throw new Error('You are not authorized to reject this chat request');
      }

      if (session.status !== 'Pending') {
        throw new Error('This chat request has already been processed');
      }

      // Update session status to Rejected
      const updatedSession = await this.pb.collection('chat_session').update(sessionId, {
        status: 'Rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: clientId,
        rejectionReason: reason
      });

      // Send rejection message from client
      const rejectionMessage = reason
        ? `I'm sorry, but I cannot accept this chat request at this time. Reason: ${reason}`
        : "I'm sorry, but I cannot accept this chat request at this time.";

      await this.sendMessage(sessionId, clientId, rejectionMessage);

      console.log('Chat request rejected:', sessionId);
      return updatedSession;
    } catch (error) {
      console.error('Error rejecting chat request:', error);
      throw error;
    }
  }

  /**
   * Close a chat session
   * @param {string} sessionId - Chat session ID
   * @param {string} userId - User ID closing the session
   */
  async closeChatSession(sessionId, userId) {
    try {
      await this.pb.collection('chat_session').update(sessionId, {
        status: 'Close',
        closed_at: new Date().toISOString()
      });

      console.log('Chat session closed:', sessionId);
    } catch (error) {
      console.error('Error closing chat session:', error);
      throw error;
    }
  }

  /**
   * Subscribe to real-time chat updates
   * @param {string} sessionId - Chat session ID
   * @param {Function} onMessage - Callback for new messages
   * @param {Function} onSessionUpdate - Callback for session updates
   */
  subscribeToChat(sessionId, onMessage, onSessionUpdate) {
    try {
      // Subscribe to new messages for this specific chat
      this.pb.collection('messages').subscribe('*', (e) => {
        if (e.record.chat === sessionId) {
          onMessage(e);
        }
      });

      // Subscribe to session updates for this specific session
      this.pb.collection('chat_session').subscribe('*', (e) => {
        if (e.record.id === sessionId) {
          onSessionUpdate(e);
        }
      });
    } catch (error) {
      console.error('Error subscribing to chat updates:', error);
    }
  }

  /**
   * Subscribe to global new chat sessions for a specific client
   * @param {string} clientId - Client user ID
   * @param {Function} onNewSession - Callback for new chat sessions
   */
  subscribeToNewChatSessions(clientId, onNewSession) {
    try {
      // Subscribe to all new chat sessions where this client is involved
      this.pb.collection('chat_session').subscribe('*', (e) => {
        if (e.action === 'create' && e.record.chatType === 'client_customer' && e.record.client === clientId) {
          console.log('New chat session detected for client:', e.record);
          onNewSession(e);
        }
      });
    } catch (error) {
      console.error('Error subscribing to new chat sessions:', error);
    }
  }

  /**
   * Unsubscribe from chat updates
   */
  unsubscribeFromChat() {
    try {
      this.pb.collection('messages').unsubscribe();
      this.pb.collection('chat_session').unsubscribe();
    } catch (error) {
      console.error('Error unsubscribing from chat updates:', error);
    }
  }

  /**
   * Unsubscribe from new chat session updates only
   */
  unsubscribeFromNewChatSessions() {
    try {
      // Note: PocketBase doesn't have granular unsubscribe, so we need to manage this carefully
      // For now, we'll use the same unsubscribe method but this could be enhanced
      this.pb.collection('chat_session').unsubscribe();
    } catch (error) {
      console.error('Error unsubscribing from new chat sessions:', error);
    }
  }

  /**
   * Search messages in a chat session
   * @param {string} sessionId - Chat session ID
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching messages
   */
  async searchMessages(sessionId, searchTerm) {
    try {
      const messages = await this.pb.collection('messages').getList(1, 50, {
        filter: `chat = "${sessionId}" && content ~ "${searchTerm}"`,
        sort: '-created',
        expand: 'sender'
      });

      return messages.items;
    } catch (error) {
      console.error('Error searching messages:', error);
      throw error;
    }
  }
}

// Export singleton instance
const customerClientChatService = new CustomerClientChatService();
export default customerClientChatService;