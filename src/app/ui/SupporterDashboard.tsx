import PageHeader from '@/app/ui/PageHeader';
import { Box, Grid, Skeleton } from '@radix-ui/themes';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Check, Clipboard, MessageCircle } from 'lucide-react';
import React from 'react';
import { SupporterRequestsInProgress } from '@/app/ui/SupporterRequestsInProgress';
import SupporterRequestsSuggested from '@/app/ui/SupporterRequestsSuggested';
import { useSupporterDashboard } from '@/hooks/api/useSupporterDashboard';
import { useUserData } from '@/providers/UserProvider';

export default function SupporterDashboard() {
  const { name } = useUserData();
  const { data, isLoading } = useSupporterDashboard();

  return (
    <>
      <PageHeader
        heading={isLoading ? 'Dashboard' : `${name}'s Dashboard`}
        columns="auto 1fr auto"
      />

      <Box maxWidth="1400px" m="auto" px="4">
        <Grid gap="3" columns="1fr 1fr 1fr">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-x-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Requests in progress
              </CardTitle>
              <Clipboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Skeleton loading={isLoading}>
                  {data?.requestsInProgress || 0}
                </Skeleton>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-x-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Fulfilled requests
              </CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Skeleton loading={isLoading}>
                  {data?.fulfilledRequests || 0}
                </Skeleton>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-x-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unread messages
              </CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Skeleton loading={isLoading}>
                  {data?.unreadMessages || 0}
                </Skeleton>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid gap="3" columns="1fr 1fr" mt="3">
          <Box>
            <Card>
              <CardHeader>
                <CardTitle>Recently in progress</CardTitle>
                <CardDescription>
                  Track the latest contributions you’re actively working on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SupporterRequestsInProgress
                  data={data?.recentRequests || []}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card>
              <CardHeader>
                <CardTitle>Suggested requests</CardTitle>
                <CardDescription>
                  Check out open requests from shelters needing support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SupporterRequestsSuggested
                  data={data?.suggestedRequests || []}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Box>
    </>
  );
}
