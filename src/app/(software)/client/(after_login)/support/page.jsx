'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useChat } from '@/hooks/useChat';
import { ROLES } from '@/constants/roles';
import { toast } from 'sonner';
import {
  MessageCircle,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  HelpCircle,
  Phone,
  Mail,
  MessageSquare,
  Ticket
} from 'lucide-react';
import { useTicket } from '@/hooks/useTicket';

export default function ClientSupportPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { createChatSession, getUserChatSessions } = useChat();
  const { createTicket } = useTicket();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketContent, setTicketContent] = useState('');

  // Load user's chat sessions
  const loadSessions = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Filter for customer-client sessions only
      const allSessions = await getUserChatSessions();
      const clientSessions = allSessions.filter(
        s => s.agent === user.id
      );
      console.log(clientSessions)
      setSessions(clientSessions);
    } catch (error) {
      toast.error('Failed to load chat sessions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error('Please log in to access support');
        router.push('/login');
        return;
      }
      // Only allow CLIENT and CUSTOMER roles
      if (![ROLES.MERCHANT, ROLES.CUSTOMER].includes(user.role)) {
        toast.error('Access denied');
        router.push('/');
        return;
      }

      loadSessions();
    }
  }, [user, authLoading, router]);

  const handleStartNewChat = async () => {
    if (!user) {
      toast.error('Please log in to start a chat session');
      return;
    }
    if (!user.id) {
      toast.error('Invalid user session. Please log in again.');
      return;
    }
    setCreating(true);
    try {
      const session = await createChatSession();
      if (session) {
        toast.success('New chat session created!');
        router.push(`/client/support/chat/${session.id}`);
      } else {
        toast.error('Failed to create chat session. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to create chat session. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenChat = (sessionId) => {
    router.push(`/client/support/chat/${sessionId}`);
  };

  const handleCreateTicket = async () => {
    if (!user) {
      toast.error('Please log in to create a ticket');
      return;
    }
    if (!ticketContent.trim()) {
      toast.error('Please provide a description for your ticket');
      return;
    }
    setCreating(true);
    try {
      const ticket = await createTicket(ticketContent);
      if (ticket) {
        toast.success('Ticket created successfully!');
        setTicketContent('');
        setShowTicketForm(false);
      }
    } catch (error) {
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const getSessionStatusIcon = (status) => {
    switch (status) {
      case 'Open':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Close':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTimeSince = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-accent shadow-sm border-b border-primary/20">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Client Support Center</h1>
              <p className="text-foreground/70">Get help from your client support team</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-foreground/70">
                Welcome, {user?.username || user?.email}
              </span>
              <span className="px-2 py-1 bg-primary text-accent text-xs rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Start New Chat Section */}
            <div className="bg-accent rounded-lg shadow-sm border border-primary/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Start New Chat</h2>
                  <p className="text-foreground/70">Connect with your client instantly</p>
                </div>
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>

              <button
                onClick={handleStartNewChat}
                disabled={creating || !user}
                className="w-full flex items-center justify-center px-4 py-3 bg-primary text-accent rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent mr-2"></div>
                    Creating Chat...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Start New Chat Session
                  </>
                )}
              </button>
            </div>

            {/* Create Ticket Section */}
            <div className="bg-accent rounded-lg shadow-sm border border-primary/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Need More Help?</h2>
                  <p className="text-foreground/70">Create a ticket for complex issues</p>
                </div>
                <Ticket className="w-8 h-8 text-primary" />
              </div>

              {!showTicketForm ? (
                <button
                  onClick={() => setShowTicketForm(true)}
                  className="w-full flex items-center justify-center px-4 py-3 bg-secondary text-accent rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  Create Support Ticket
                </button>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={ticketContent}
                    onChange={(e) => setTicketContent(e.target.value)}
                    placeholder="Describe your issue in detail..."
                    className="w-full p-3 border border-primary/30 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                    rows={4}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCreateTicket}
                      disabled={creating || !ticketContent.trim()}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-primary text-accent rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {creating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Ticket className="w-4 h-4 mr-2" />
                          Create Ticket
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowTicketForm(false);
                        setTicketContent('');
                      }}
                      className="px-4 py-2 bg-background text-foreground border border-primary/30 rounded-lg hover:bg-background/80 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Sessions */}
            <div className="bg-accent rounded-lg shadow-sm border border-primary/20">
              <div className="p-6 border-b border-primary/20">
                <h2 className="text-lg font-semibold text-foreground">Customer Chats</h2>
                <p className="text-foreground/70">Chats initiated by customers</p>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-foreground/70">Loading chat sessions...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No customer chats yet</h3>
                  <p className="text-gray-600 mb-4">Chats started by customers will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleOpenChat(session.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">
                            Order: {session.orderId || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">
                            Status: {session.status}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Help */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <HelpCircle className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Quick Help</h3>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-gray-600">
                  Our client support team is available to help you with:
                </p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Order tracking and updates</li>
                  <li>• Shipping and logistics queries</li>
                  <li>• Account and billing support</li>
                  <li>• Technical assistance</li>
                  <li>• General inquiries</li>
                </ul>
              </div>
            </div>
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">+91-1234567890</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">support@greenoceanlogistics.com</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                    <p className="text-sm text-gray-600">+91-9876543210</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Business Hours */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Business Hours</h3>
              <p className="text-sm text-blue-800">
                Our client support team is available for live chat and emergency support.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Phone support: Monday - Friday, 9 AM - 6 PM IST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

