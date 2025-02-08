'use client';

import * as React from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useMessageGetByRequestId } from '@/hooks/api/useMessageGetByRequestId';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

type ChatCardProps = {
  requestId: string;
};

export function ChatCard({ requestId }: ChatCardProps) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [input, setInput] = React.useState('');
  const inputLength = input.trim().length;
  const { data } = useMessageGetByRequestId({ id: requestId });
  const socketRef = React.useRef<any>(null);
  const [messages, setMessages] = React.useState(data?.messages || []);

  // initial loading
  React.useEffect(() => {
    if (data?.messages && !messages.length) {
      setMessages(data.messages);
    }
  }, [data]);

  // ws connection
  React.useEffect(() => {
    const socket = io(SOCKET_URL, { path: '/api/socket' });

    socket.emit('join_request', requestId);

    socket.on('receive_message', (newMessage) => {
      if (newMessage.requestId === requestId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [requestId]);

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputLength === 0 || !currentUserId || !socketRef.current) return;

    const newMessage = {
      requestId,
      senderId: currentUserId,
      text: input,
    };

    socketRef.current.emit('send_message', newMessage);

    setInput('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discuss this request</CardTitle>
        <CardDescription>Chat with Alex Johnson</CardDescription>
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
          onSubmit={handleSendMessage}
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
          <Button type="submit" size="icon" disabled={inputLength === 0}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
