'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Flex, Skeleton, Box } from '@radix-ui/themes';
import { RequestListQuery, useRequestList } from '@/hooks/api/useRequestList';
import { ErrorApi } from '@/app/ui/ErrorApi';
import { URGENCY } from '@/constants/Request';
import { useDebounceCallback } from 'usehooks-ts';
import { DatePickerWithRange } from '@/app/ui/DatePickerWithRange';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { columns } from '@/app/ui/RequestsTable/columns';

export default function RequestsTableShelter() {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [title, setTitle] = React.useState('');
  const [query, setQuery] = React.useState<RequestListQuery>({
    page: 1,
    limit: 5,
  });
  const { requests, total, limit, isLoading, error } = useRequestList(query);

  const debouncedSearch = useDebounceCallback((newText: string) => {
    setQuery((prev) => ({ ...prev, text: newText, page: 1 }));
  }, 500);

  const handlePageChange = (newPage: number) => {
    const updatedQuery = { ...query, page: newPage };
    setQuery(updatedQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedSearch(e.target.value);
  };

  const resetAllFilters = () => {
    setDate(undefined);
    setTitle('');
    const updatedQuery = { page: 1, limit: 5 };
    setQuery(updatedQuery);
  };

  const handleDateRangeChange = (range?: DateRange) => {
    const formattedStartDate = range?.from
      ? format(range.from, 'yyyy-MM-dd')
      : '';
    const formattedEndDate = range?.to ? format(range.to, 'yyyy-MM-dd') : '';
    setQuery((prev) => ({
      ...prev,
      page: 1,
      dueDateStart: formattedStartDate,
      dueDateEnd: formattedEndDate,
    }));
  };

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) return <ErrorApi error={error} />;

  return (
    <div className="w-full">
      <Flex py="4" justify="between" align="center">
        <Flex align="center" gap="2">
          <Box>
            <Input
              placeholder="Search requests by title..."
              value={title}
              onChange={handleSearchChange}
              className="max-w-[220px] w-[220px]"
            />
          </Box>

          <Box>
            <Select onValueChange={console.dir} value={''}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={URGENCY.LOW}>Low</SelectItem>
                <SelectItem value={URGENCY.MEDIUM}>Medium</SelectItem>
                <SelectItem value={URGENCY.HIGH}>High</SelectItem>
              </SelectContent>
            </Select>
          </Box>
        </Flex>

        <Flex align="center" gap="2">
          <DatePickerWithRange
            date={date}
            setDate={setDate}
            onSelect={handleDateRangeChange}
            placeholder="Filter by due date"
          />

          <Button variant="outline" onClick={resetAllFilters}>
            <X /> Reset all filters
          </Button>
        </Flex>
      </Flex>
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
          Page {query.page} of {Math.ceil(total / limit)}
        </span>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(query.page - 1, 1))}
            disabled={query.page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handlePageChange(
                query.page < Math.ceil(total / limit)
                  ? query.page + 1
                  : query.page
              )
            }
            disabled={query.page >= Math.ceil(total / limit)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
