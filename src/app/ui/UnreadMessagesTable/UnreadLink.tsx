import { appRoutes } from '@/lib/appRoutes';
import { Link } from '@radix-ui/themes';
import * as React from 'react';
import { useMarkAsReadMessage } from '@/hooks/api/useMarkAsReadMessage';
import RouterLink from 'next/link';

type UnreadLink = {
  title: string;
  requestId: string;
};

export default function UnreadLink({ title, requestId }: UnreadLink) {
  const { mutate } = useMarkAsReadMessage();

  return (
    <Link color="gray" asChild>
      <RouterLink
        href={appRoutes.request(requestId)}
        onClick={() => mutate({ requestId })}
      >
        {title}
      </RouterLink>
    </Link>
  );
}
