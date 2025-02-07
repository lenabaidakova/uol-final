'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Theme } from '@radix-ui/themes';
import { RoleProvider } from '@/providers/RoleProvider';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <Theme accentColor="grass">
          <RoleProvider>
            {children}

            <Toaster />
          </RoleProvider>
        </Theme>
      </QueryClientProvider>
    </SessionProvider>
  );
}
