'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { REQUEST_TYPE, URGENCY } from '@/constants/Request';
import { useRequestCreate } from '@/hooks/api/useRequestCreate';
import { Box, Button } from '@radix-ui/themes';
import { ErrorApi } from '@/app/ui/ErrorApi';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  title: z.string().min(2),
  dueDate: z.date(),
  details: z.string(),
  location: z.string(),
  type: z.nativeEnum(REQUEST_TYPE),
  urgency: z.nativeEnum(URGENCY),
});

export function NewRequestForm() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    mutate: createRequest,
    isMutating,
    error,
  } = useRequestCreate({
    onSuccess: () => {
      toast({
        title: 'Request created',
        description: 'Your request is now visible',
      });
      router.push('/');
    },
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    createRequest({ ...data });
  }

  return (
    <Box>
      {!!error && (
        <Box mb="3">
          <ErrorApi error={error} />
        </Box>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Request title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Cleaning supplies, Dog food, Volunteer help"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the location where help is needed"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of request</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={REQUEST_TYPE.SUPPLIES}>
                      Supplies
                    </SelectItem>
                    <SelectItem value={REQUEST_TYPE.SERVICES}>
                      Services
                    </SelectItem>
                    <SelectItem value={REQUEST_TYPE.VOLUNTEERS}>
                      Volunteers
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How urgent is this request?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an urgency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={URGENCY.HIGH}>High</SelectItem>
                    <SelectItem value={URGENCY.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={URGENCY.LOW}>Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Select a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Details about the request</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide additional information, such as quantities, specific needs, or deadlines"
                    className="resize-y"
                    rows={7}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" highContrast color="gray" loading={isMutating}>
            Create request
          </Button>
        </form>
      </Form>
    </Box>
  );
}
