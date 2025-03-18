'use client';

import * as React from 'react';
import {
  RequestStatusType,
  RequestType,
  URGENCY_LABELS,
  UrgencyType,
} from '@/constants/Request';
import { ColumnDef } from '@tanstack/react-table';
import { Badge, Link } from '@radix-ui/themes';
import { format, parseISO } from 'date-fns';
import RequestDropdownActions from '@/app/ui/RequestDropdownActions';
import RouterLink from 'next/link';
import { RoleType } from '@/types/RoleType';
import { ROLES } from '@/constants/Role';
import RequestStatusBadge from '@/app/ui/RequestStatusBadge';

export type Request = {
  id: string;
  title: string;
  location: string;
  urgency: UrgencyType;
  status: RequestStatusType;
  dueDate: string;
  type: RequestType;
  shelterName?: string;
};

// build columns for requests table
export const getColumns = (userRole: RoleType | null): ColumnDef<Request>[] => {
  const baseColumns: ColumnDef<Request>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <Link color="gray" asChild>
          <RouterLink href={`/request/${row.original.id}`}>
            {row.getValue('title')}
          </RouterLink>
        </Link>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.getValue<RequestType>('type');
        return <div>{type.toLowerCase()}</div>;
      },
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
        if (!value) return null;
        const color = URGENCY_LABELS[value]?.badge;
        const label = URGENCY_LABELS[value]?.label;
        return <Badge color={color}>{label || value}</Badge>;
      },
    },
    {
      accessorKey: 'dueDate',
      header: 'Due date',
      cell: ({ row }) => {
        const value: string = row.getValue('dueDate');
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
        const status = row.getValue<RequestStatusType>('status');
        if (!status) return null;

        return <RequestStatusBadge status={status} size="2" />;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const requestId = row.original.id;
        const requestStatus = row.original.status;
        return (
          <RequestDropdownActions
            requestId={requestId}
            requestStatus={requestStatus}
          />
        );
      },
    },
  ];

  // show shelter name column only for supporter
  if (userRole === ROLES.SUPPORTER) {
    baseColumns.splice(1, 0, {
      accessorKey: 'shelterName',
      header: 'Shelter',
      cell: ({ row }) => <div>{row.getValue('shelterName') || '-'}</div>,
    });
  }

  return baseColumns;
};
