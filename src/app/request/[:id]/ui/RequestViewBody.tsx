'use client';

import PageHeader from '@/app/ui/PageHeader';
import { Badge, Box, Flex, Grid, Skeleton, Text } from '@radix-ui/themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChatCard } from '@/app/request/[:id]/ui/Chat';
import RequestDropdownActions from '@/app/ui/RequestDropdownActions';
import { usePathname } from 'next/navigation';
import { useRequestById } from '@/hooks/api/useRequestById';
import { REQUEST_STATUS_LABELS, URGENCY_LABELS } from '@/constants/Request';
import * as React from 'react';
import { format } from 'date-fns';
import { ErrorApi } from '@/app/ui/ErrorApi';

export default function RequestViewBody() {
  const pathname = usePathname();
  const requestId = pathname.split('/')[2];
  const { data, error, isLoading } = useRequestById({ id: requestId });

  const request = data?.request;

  if (error) {
    return <ErrorApi error={error} />;
  }

  if (isLoading) {
    return (
      <>
        <PageHeader
          heading="Request details"
          columns="auto 1fr auto"
          backLink="/shelter/requests"
        />
        <Grid maxWidth="800px" m="auto" px="2" gap="2">
          <Skeleton height="30px" width="80%" />
          <Skeleton height="30px" width="60%" />
          <Skeleton height="30px" width="40%" />
        </Grid>
      </>
    );
  }

  if (!request) {
    return null;
  }

  const Icon = REQUEST_STATUS_LABELS[request.status].icon;

  return (
    <>
      <PageHeader
        heading="Request details"
        columns="auto 1fr auto"
        backLink="/shelter/requests"
        actions={<RequestDropdownActions requestId={requestId} />}
      >
        <div className="capitalize">
          <Flex gap="2" align="center">
            {Icon && (
              <Text color="gray">
                <Icon size="18px" />
              </Text>
            )}{' '}
            <Text color="gray">
              {' '}
              {REQUEST_STATUS_LABELS[request.status].label}
            </Text>
          </Flex>
        </div>
      </PageHeader>

      <Box maxWidth="800px" m="auto" px="2">
        <div className="max-w-4xl mx-auto p-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="mb-3">
                <Flex gap="2" justify="between">
                  {request.title}
                  <Badge color={URGENCY_LABELS[request.urgency].badge}>
                    {URGENCY_LABELS[request.urgency].label} urgency
                  </Badge>
                </Flex>
              </CardTitle>
              <CardDescription>
                <Flex gap="2" justify="between">
                  Paws and Claws Shelter, {request.location}
                  {!!request.dueDate && (
                    <Badge color="gray">{`Due ${format(request.dueDate, 'd MMMM yyyy')}`}</Badge>
                  )}
                </Flex>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{request.details}</p>
            </CardContent>
          </Card>

          <ChatCard requestId={requestId} />
        </div>
      </Box>
    </>
  );
}
