import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { appRoutes } from '@/lib/appRoutes';
import { Link, Skeleton } from '@radix-ui/themes';
import { format } from 'date-fns';
import RouterLink from 'next/link';

type RecentRequest = {
  id: string;
  title: string;
  assignedTo?: { name: string } | null;
  updatedAt: string;
};

type RecentRequestsInProgressProps = {
  data: RecentRequest[];
  isLoading?: boolean;
};

export function RecentRequestsInProgress({
  data,
  isLoading,
}: RecentRequestsInProgressProps) {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div className="flex items-center" key={i}>
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="ml-4 space-y-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="ml-auto h-3 w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {data.map((item) => {
        const initials = item.assignedTo?.name
          ? item.assignedTo.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
          : 'SP';

        return (
          <div className="flex items-center" key={item.id}>
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={`https://robohash.org/${item.id}.png?set=set4&size=150x150`}
                alt="Avatar"
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <Link color="gray" asChild>
                <RouterLink href={appRoutes.request(item.id)}>
                  {item.title}
                </RouterLink>
              </Link>
              <p className="text-sm text-muted-foreground">
                {item.assignedTo?.name || 'Unknown supporter'}
              </p>
            </div>
            <div className="ml-auto text-sm">
              {format(new Date(item.updatedAt), 'MMM d')}
            </div>
          </div>
        );
      })}
    </div>
  );
}
