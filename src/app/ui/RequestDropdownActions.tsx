'use client';

import { EllipsisVertical, Pencil } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import RouterLink from 'next/link';
import { appRoutes } from '@/lib/appRoutes';
import CompleteRequest from '@/app/ui/RequestDropdownActions/CompleteRequest';
import ArchiveRequest from '@/app/ui/RequestDropdownActions/ArchiveRequest';
import { REQUEST_STATUS, RequestStatusType } from '@/constants/Request';
import { useUserData } from '@/providers/UserProvider';
import { ROLES } from '@/constants/Role';

type RequestDropdownActionsProps = {
  requestId: string;
  requestStatus: RequestStatusType;
};

export default function RequestDropdownActions({
  requestId,
  requestStatus,
}: RequestDropdownActionsProps) {
  const { role } = useUserData();
  const { isMobile } = useSidebar();

  // request actions are forbidden for Supporter
  if (role === ROLES.SUPPORTER) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          {(requestStatus === REQUEST_STATUS.IN_PROGRESS ||
            requestStatus === REQUEST_STATUS.PENDING) && (
            <CompleteRequest requestId={requestId} />
          )}

          {(requestStatus === REQUEST_STATUS.IN_PROGRESS ||
            requestStatus === REQUEST_STATUS.PENDING) && (
            <DropdownMenuItem asChild>
              <RouterLink href={appRoutes.requestUpdate(requestId)}>
                <Pencil /> Edit
              </RouterLink>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>

        {requestStatus !== REQUEST_STATUS.ARCHIVED && (
          <>
            <DropdownMenuSeparator />
            <ArchiveRequest requestId={requestId} />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
