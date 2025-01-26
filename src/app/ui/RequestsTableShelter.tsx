'use client';

import * as React from 'react';
import {
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
import { RequestListQuery, useRequestList } from '@/hooks/api/useRequestList';
import { ErrorApi } from '@/app/ui/ErrorApi';
import { columns } from '@/app/ui/RequestsTable/columns';
import Filters from '@/app/ui/RequestsTable/Filters';

export default function RequestsTableShelter() {
  const [query, setQuery] = React.useState<RequestListQuery>({
    page: 1,
    limit: 5,
  });
  const { requests, total, limit, isLoading, error } = useRequestList(query);

  const handlePageChange = (newPage: number) => {
    const updatedQuery = { ...query, page: newPage };
    setQuery(updatedQuery);
  };

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) return <ErrorApi error={error} />;

  const page = query.page;

  return (
    <div className="w-full">
      <Filters query={query} setQuery={setQuery} />

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

      {page && page > 0 && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <span className="flex-1 text-sm text-muted-foreground">
            Page {page} of {Math.ceil(total / limit)}
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
                  page < Math.ceil(total / limit) ? page + 1 : page
                )
              }
              disabled={page >= Math.ceil(total / limit)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
