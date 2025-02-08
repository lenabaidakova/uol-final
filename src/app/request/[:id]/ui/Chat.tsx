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

type ChatCardProps = {
  requestId: string;
};

export function ChatCard({ requestId }: ChatCardProps) {
  const { data: session } = useSession();
  const [input, setInput] = React.useState('');
  const inputLength = input.trim().length;
  const { data } = useMessageGetByRequestId({ id: requestId });
  const currentUserId = session?.user?.id;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Discuss this request</CardTitle>
          <CardDescription>Alex Johnson</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.messages?.map((message, index) => (
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
            <Button type="submit" size="icon" disabled={inputLength === 0}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
