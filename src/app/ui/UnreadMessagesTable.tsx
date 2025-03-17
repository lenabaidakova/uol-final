'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Flex, Skeleton } from '@radix-ui/themes';
import { ErrorApi } from '@/app/ui/ErrorApi';
import {
  UnreadMessage,
  UnreadMessagesQuery,
  useUnreadMessages,
} from '@/hooks/api/useUnreadMessages';
import UnreadLink from '@/app/ui/UnreadMessagesTable/UnreadLink';

export const columns: ColumnDef<UnreadMessage>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const requestId = row.original.requestId;
      const title: string = row.getValue('title');

      return <UnreadLink title={title} requestId={requestId} />;
    },
  },
  {
    accessorKey: 'lastMessageFrom',
    header: 'Last message from',
    cell: ({ row }) => <div>{row.getValue('lastMessageFrom')}</div>,
  },
  {
    accessorKey: 'lastMessageDate',
    header: 'Last message date',
    cell: ({ row }) => <div>{row.getValue('lastMessageDate')}</div>,
  },
  {
    accessorKey: 'unreadCount',
    header: () => <div className="text-right">Unread messages</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {row.getValue('unreadCount')}
      </div>
    ),
  },
];

export default function UnreadMessagesTable() {
  const [query, setQuery] = React.useState<UnreadMessagesQuery>({
    page: 1,
    limit: 5,
  });
  const { unreadMessages, totalUnread, limit, isLoading, error } =
    useUnreadMessages(query);

  const handlePageChange = (newPage: number) => {
    const updatedQuery = { ...query, page: newPage };
    setQuery(updatedQuery);
  };

  const table = useReactTable({
    data: unreadMessages,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) return <ErrorApi error={error} />;

  const page = query.page;

  return (
    <div className="w-full">
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
                    <TableCell key={column.id}>
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
                  No unread messages
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {page && page > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <span className="flex-1 text-sm text-muted-foreground">
            Page {page} of {Math.ceil(totalUnread / limit)}
          </span>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(page - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handlePageChange(
                  page < Math.ceil(totalUnread / limit) ? page + 1 : page
                )
              }
              disabled={page >= Math.ceil(totalUnread / limit)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
