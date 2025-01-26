'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Check, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge, Flex, Link, Text, Skeleton } from '@radix-ui/themes';
import { useRequestList } from '@/hooks/api/useRequestList';
import { ErrorApi } from '@/app/ui/ErrorApi';
import {
  REQUEST_STATUS_LABELS,
  URGENCY_LABELS,
  UrgencyType,
} from '@/constants/Request';

export type Request = {
  title: string;
  location: string;
  urgency: UrgencyType;
  status: 'open' | 'in progress';
};

const columns: ColumnDef<Request>[] = [
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
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => <div>{row.getValue('location')}</div>,
  },
  {
    accessorKey: 'urgency',
    header: 'Urgency',
    cell: ({ row }) => {
      const value: string = row.getValue('urgency');

      if (!value) {
        return null;
      }
      const color = URGENCY_LABELS[value]?.badge;
      const label = URGENCY_LABELS[value]?.label;

      return <Badge color={color}>{label || value}</Badge>;
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

export default function RequestsTableShelter() {
  const [page, setPage] = React.useState(1);
  const { requests, total, limit, isLoading, error } = useRequestList({
    page,
    limit: 5,
  });

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) return <ErrorApi error={error} />;

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search requests by keyword (e.g., cleaning supplies, Bristol)..."
          onChange={console.log}
          className="max-w-[500px]"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.id || column.accessorKey}>
                      <Flex height="32px" align="center">
                        <Skeleton loading={true} width="80%" height="16px" />
                      </Flex>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <span className="flex-1 text-sm text-muted-foreground">
          Page {page} of {Math.ceil(total / limit)}
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((prev) =>
                prev < Math.ceil(total / limit) ? prev + 1 : prev
              )
            }
            disabled={page >= Math.ceil(total / limit)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
