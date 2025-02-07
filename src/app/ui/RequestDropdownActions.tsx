'use client';

import { EllipsisVertical, Pencil, Trash } from 'lucide-react';
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

type RequestDropdownActionsProps = {
  requestId: string;
};

export default function RequestDropdownActions({
  requestId,
}: RequestDropdownActionsProps) {
  const { isMobile } = useSidebar();

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
          <CompleteRequest requestId={requestId} />

          <DropdownMenuItem asChild>
            <RouterLink href={appRoutes.request(requestId)}>
              <Pencil /> Edit
            </RouterLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <ArchiveRequest requestId={requestId} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
