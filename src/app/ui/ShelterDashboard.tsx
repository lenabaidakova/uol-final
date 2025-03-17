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
import { RecentRequestsInProgress } from '@/app/ui/RecentRequestsInProgress';
import { RequestsChart } from '@/app/ui/RequestsChart';
import { useShelterDashboard } from '@/hooks/api/useShelterDashboard';

export default function ShelterDashboard() {
  const { data, isLoading } = useShelterDashboard();

  return (
    <>
      <PageHeader
        heading="Paws and Claws Shelter Dashboard"
        columns="auto 1fr auto"
      />

      <Box maxWidth="1400px" m="auto" px="4">
        <Grid gap="3" columns="1fr 1fr 1fr">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-x-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active requests
              </CardTitle>
              <Clipboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Skeleton loading={isLoading}>
                  {data?.activeRequests || 0}
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
                <CardTitle>Recently taken in progress</CardTitle>
                <CardDescription>
                  Track the latest progress on&nbsp;your shelter&rsquo;s needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentRequestsInProgress
                  data={data?.recentRequests || []}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </Box>

          <Box>
            <RequestsChart stats={data?.stats || []} isLoading={isLoading} />
          </Box>
        </Grid>
      </Box>
    </>
  );
}
