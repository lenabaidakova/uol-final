'use client';

import React, { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyEmail } from '@/hooks/api/useVerifyEmail';
import { Box, Card, Skeleton } from '@radix-ui/themes';
import { Callout } from '@/app/ui/Callout';
import { ErrorApi } from '@/app/ui/ErrorApi';
import { useToast } from '@/hooks/use-toast';

function ConfirmEmailPageBody() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');
  const hasRequested = React.useRef(false);

  const { mutate, isMutating, error } = useVerifyEmail({
    onSuccess: () => {
      toast({
        title: 'Email verified',
        description:
          'Your email has been successfully confirmed. You can now log in.',
      });
      router.push('/login');
    },
  });

  useEffect(() => {
    if (token && !hasRequested.current) {
      hasRequested.current = true;
      mutate({ token });
    }
  }, [token, hasRequested, mutate]);

  if (!token) {
    return (
      <Box m="auto" maxWidth="460px" py="3" px="2" mt="4">
        <Card size="4" variant="classic">
          <Callout color="tomato">
            No confirmation token found in the URL. Please check the link or
            request a new one.
          </Callout>
        </Card>
      </Box>
    );
  }

  if (isMutating) {
    return (
      <Box m="auto" maxWidth="460px" py="3" px="2" mt="4">
        <Card size="4">
          <Callout color="gold">
            We are verifying your email, please wait...
          </Callout>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="auto" maxWidth="460px" py="3" px="2" mt="4">
        <ErrorApi error={error} />
      </Box>
    );
  }

  return null;
}

export default function ConfirmEmailPage() {
  return (
    <Suspense
      fallback={
        <Box m="auto" maxWidth="460px" py="3" px="2" mt="4">
          <Card size="4" variant="classic">
            <Skeleton width="300px" height="30px" />
          </Card>
        </Box>
      }
    >
      <ConfirmEmailPageBody />
    </Suspense>
  );
}
