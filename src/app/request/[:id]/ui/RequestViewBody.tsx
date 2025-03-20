'use client';

import PageHeader from '@/app/ui/PageHeader';
import { Badge, Box, Flex, Grid, Skeleton } from '@radix-ui/themes';
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
import { REQUEST_STATUS, URGENCY_LABELS } from '@/constants/Request';
import * as React from 'react';
import { format } from 'date-fns';
import { ErrorApi } from '@/app/ui/ErrorApi';
import { useUserData } from '@/providers/UserProvider';
import { ROLES } from '@/constants/Role';
import RequestStatusBadge from '@/app/ui/RequestStatusBadge';
import TakeInProgress from '@/app/request/[:id]/ui/TakeInProgress';

export default function RequestViewBody() {
  const { role } = useUserData();
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
          backLink={true}
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

  return (
    <>
      <PageHeader
        heading="Request details"
        columns="auto 1fr auto"
        backLink={true}
        actions={
          // show actions only if the user has Shelter role
          role === ROLES.SHELTER ? (
            <RequestDropdownActions
              requestId={requestId}
              requestStatus={request.status}
            />
          ) : (
            <></>
          )
        }
      >
        <Flex align="center" gap="5">
          <RequestStatusBadge status={request.status} />

          {role === ROLES.SUPPORTER &&
            request.status === REQUEST_STATUS.PENDING && (
              <TakeInProgress requestId={requestId} />
            )}
        </Flex>
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
                  {request.creatorName}, {request.location}
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
