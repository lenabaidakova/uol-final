'use client';

import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Theme } from '@radix-ui/themes';

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
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        <Theme accentColor="grass" grayColor="olive">
          {children}
        </Theme>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
