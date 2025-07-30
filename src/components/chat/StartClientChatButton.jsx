'use client';

import { Button } from '@/components/ui/button1';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function StartClientChatButton({ orderId, clientId, clientName, orderNumber }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartChat = async () => {
    if (!clientId) {
      toast.error('No client assigned to this order');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/chat/start-client-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          orderId,
          orderNumber,
          subject: `Order #${orderNumber} - ${clientName || 'Client'}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start chat');
      }

      const { chatId } = await response.json();
      router.push(`/customer/support/client-chat/${chatId}`);
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleStartChat}
      disabled={isLoading || !clientId}
      variant="outline"
      className="flex items-center gap-2"
    >
      <MessageCircle className="h-4 w-4" />
      {isLoading ? 'Starting Chat...' : 'Chat with Client'}
    </Button>
  );
}