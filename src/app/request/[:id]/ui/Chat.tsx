'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/socket';
import { Send } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { useMessageGetByRequestId } from '@/hooks/api/useMessageGetByRequestId';

type ChatCardProps = {
  requestId: string;
};

export function ChatCard({ requestId }: ChatCardProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const { data } = useMessageGetByRequestId({ id: requestId });

  const [, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<
    { senderId: string; text: string }[]
  >([]);
  const [input, setInput] = useState('');

  // initial loading
  useEffect(() => {
    if (data?.messages && !messages.length) {
      setMessages(data.messages);
    }
  }, [data, messages.length]);

  useEffect(() => {
    if (socket.connected) {
      setIsConnected(true);
      socket.emit('join_request', requestId);
    }

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join_request', requestId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receive_message');
    };
  }, [requestId]);

  const sendMessage = () => {
    if (input.trim() === '' || !currentUserId) return;

    const message = {
      requestId,
      senderId: currentUserId,
      text: input.trim(),
    };

    socket.emit('send_message', message);
    setInput('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discuss this request</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
                message.senderId === currentUserId
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              {message.text}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <Button type="submit" size="icon" disabled={!input.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
