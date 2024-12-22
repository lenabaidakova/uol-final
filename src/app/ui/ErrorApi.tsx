import React from 'react';
import { Callout } from '@/app/ui/Callout';
import type { ApiError } from '@/types/Api';
import { Heading } from '@radix-ui/themes';

type ErrorApiProps = {
  error: ApiError;
  title?: string;
};

export function ErrorApi({ error, title }: ErrorApiProps) {
  const message = error?.error || error?.message;

  if (!message) {
    return null;
  }

  return (
    <Callout color="tomato">
      {!!title && (
        <Heading size="2" mb="2">
          {title}
        </Heading>
      )}
      {message}
    </Callout>
  );
}
