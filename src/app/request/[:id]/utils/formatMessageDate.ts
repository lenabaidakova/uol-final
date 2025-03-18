import { format, isToday, isYesterday, parseISO } from 'date-fns';

export function formatMessageTimestamp(timestamp: string) {
  const date = parseISO(timestamp);

  if (isToday(date)) {
    return format(date, 'HH:mm'); // current time for fresh messages
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'HH:mm')}`; // for yesterday
  }

  return format(date, 'MMM d, yyyy HH:mm'); // full date
}
