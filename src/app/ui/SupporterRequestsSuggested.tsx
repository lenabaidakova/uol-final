'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, Skeleton } from '@radix-ui/themes';
import { format } from 'date-fns';
import { appRoutes } from '@/lib/appRoutes';
import * as React from 'react';
import RouterLink from 'next/link';

type SuggestedRequest = {
  id: string;
  title: string;
  creator: { name: string };
  dueDate: string | null;
};

type Props = {
  data: SuggestedRequest[];
  isLoading: boolean;
};

export default function SupporterRequestsSuggested({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="flex items-center" key={i}>
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="ml-4 space-y-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="ml-auto h-3 w-20" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {data.length > 0 ? (
        data.map((item) => {
          const initials =
            item.creator.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase() || 'SH';

          const formattedDate = item.dueDate
            ? `Due ${format(new Date(item.dueDate), 'MMM d')}`
            : 'No due date';

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
                  {item.creator.name || 'Unknown Shelter'}
                </p>
              </div>
              <div className="ml-auto text-sm">{formattedDate}</div>
            </div>
          );
        })
      ) : (
        <p className="text-sm text-muted-foreground">
          No suggested requests available
        </p>
      )}
    </div>
  );
}
