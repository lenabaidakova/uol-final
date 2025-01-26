import { Box, Flex } from '@radix-ui/themes';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { REQUEST_STATUS, URGENCY } from '@/constants/Request';
import { DatePickerWithRange } from '@/app/ui/DatePickerWithRange';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { useDebounceCallback } from 'usehooks-ts';
import { RequestListQuery } from '@/hooks/api/useRequestList';
import LocationsCombobox from '@/app/ui/RequestsTable/LocationsCombobox';

type FiltersProps = {
  query: RequestListQuery;
  setQuery: (query: RequestListQuery) => void;
};

export default function Filters({ setQuery, query }: FiltersProps) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [title, setTitle] = React.useState('');
  const [urgency, setUrgency] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [location, setLocation] = React.useState('');

  const debouncedSearch = useDebounceCallback((newText: string) => {
    setQuery({ ...query, text: newText, page: 1 });
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleUrgencyChange = (value: string) => {
    setUrgency(value);
    setQuery({ ...query, urgency: value, page: 1 });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setQuery({ ...query, status: value, page: 1 });
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setQuery({ ...query, location: value, page: 1 });
  };

  const resetAllFilters = () => {
    setDate(undefined);
    setTitle('');
    setUrgency('');
    setStatus('');
    setLocation('');

    const updatedQuery = { page: 1, limit: 5 };
    setQuery(updatedQuery);
  };

  const handleDateRangeChange = (range?: DateRange) => {
    const formattedStartDate = range?.from
      ? format(range.from, 'yyyy-MM-dd')
      : '';
    const formattedEndDate = range?.to ? format(range.to, 'yyyy-MM-dd') : '';
    setQuery({
      ...query,
      page: 1,
      dueDateStart: formattedStartDate,
      dueDateEnd: formattedEndDate,
    });
  };

  return (
    <Flex py="4" justify="between" align="center" gap="2">
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
          <Select onValueChange={handleUrgencyChange} value={urgency}>
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

        <Box>
          <Select onValueChange={handleStatusChange} value={status}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={REQUEST_STATUS.IN_PROGRESS}>
                In Progress
              </SelectItem>
              <SelectItem value={REQUEST_STATUS.PENDING}>Pending</SelectItem>
              <SelectItem value={REQUEST_STATUS.COMPLETED}>
                Completed
              </SelectItem>
              <SelectItem value={REQUEST_STATUS.ARCHIVED}>Archived</SelectItem>
            </SelectContent>
          </Select>
        </Box>

        <Box>
          <LocationsCombobox value={location} onChange={handleLocationChange} />
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
  );
}
