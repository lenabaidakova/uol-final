'use client';

import {
  REQUEST_STATUS_LABELS,
  RequestType,
  URGENCY_LABELS,
  UrgencyType,
} from '@/constants/Request';
import { ColumnDef } from '@tanstack/react-table';
import { Badge, Flex, Link, Text } from '@radix-ui/themes';
import { format, parseISO } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import * as React from 'react';

export type Request = {
  title: string;
  location: string;
  urgency: UrgencyType;
  status: 'open' | 'in progress';
  dueDate: string;
  type: RequestType;
};

export const columns: ColumnDef<Request>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <Link color="gray" href={`/request/${row.original.id}`}>
        {row.getValue('title')}
      </Link>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => <div>{row.getValue('type').toLowerCase()}</div>,
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => <div>{row.getValue('location')}</div>,
  },
  {
    accessorKey: 'urgency',
    header: 'Urgency',
    cell: ({ row }) => {
      const value: UrgencyType = row.getValue('urgency');

      if (!value) {
        return null;
      }
      const color = URGENCY_LABELS[value]?.badge;
      const label = URGENCY_LABELS[value]?.label;

      return <Badge color={color}>{label || value}</Badge>;
    },
  },
  {
    accessorKey: 'dueDate',
    header: 'Due date',
    cell: ({ row }) => {
      const value = row.getValue('dueDate');
      const formattedDate = value
        ? format(parseISO(value), 'MMMM d, yyyy')
        : '-';
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      if (!status) {
        return null;
      }

      const label = REQUEST_STATUS_LABELS[status]?.label;
      const Icon = REQUEST_STATUS_LABELS[status]?.icon;

      return (
        <div className="capitalize">
          <Flex gap="2" align="center">
            {Icon && (
              <Text color="gray">
                <Icon size="18px" />
              </Text>
            )}{' '}
            {<Text color="gray">{label}</Text>}
          </Flex>
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Check />
                Close
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil />
                Edit
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-700">
              <Trash />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
