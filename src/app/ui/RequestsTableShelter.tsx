'use client';

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Check, MoreHorizontal, Pencil, Trash, X } from 'lucide-react';
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
import { RequestListQuery, useRequestList } from '@/hooks/api/useRequestList';
import { ErrorApi } from '@/app/ui/ErrorApi';
import {
  REQUEST_STATUS_LABELS,
  RequestType,
  URGENCY_LABELS,
  UrgencyType,
} from '@/constants/Request';
import { useDebounceCallback } from 'usehooks-ts';
import { DatePickerWithRange } from '@/app/ui/DatePickerWithRange';
import { DateRange } from 'react-day-picker';
import { format, parseISO } from 'date-fns';

export type Request = {
  title: string;
  location: string;
  urgency: UrgencyType;
  status: 'open' | 'in progress';
  dueDate: string;
  type: RequestType;
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
        <Flex align="center">
          <Input
            placeholder="Search requests by title..."
            value={title}
            onChange={handleSearchChange}
            className="max-w-[500px] w-[300px]"
          />
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
