'use client';

import React from 'react';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Theme } from '@radix-ui/themes';
import { UserProvider } from '@/providers/UserProvider';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';
import { ApiError } from '@/types/Api';
import { toast } from '@/hooks/use-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error: ApiError, query) => {
      // show toast on query error
      toast({
        title: query.meta?.name as string,
        description: error?.message || error?.error,
        variant: 'destructive',
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: ApiError, _variables, _context, mutation) => {
      // show toast on mutation error
      toast({
        title: mutation.meta?.name as string,
        description: error?.message || error?.error,
        variant: 'destructive',
      });
    },
  }),
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Theme accentColor="grass">
          <UserProvider>
            {children}

            <Toaster />
          </UserProvider>
        </Theme>
      </QueryClientProvider>
    </SessionProvider>
  );
}
