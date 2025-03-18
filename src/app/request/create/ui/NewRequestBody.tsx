'use client';

import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRequestCreate } from '@/hooks/api/useRequestCreate';
import { useRouter } from 'next/navigation';
import { RequestForm, RequestFormSchema } from '@/app/ui/RequestForm';
import { appRoutes } from '@/lib/appRoutes';

export function NewRequestBody() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: createRequest, isMutating } = useRequestCreate({
    onSuccess: () => {
      toast({
        title: 'Request created',
        description: 'Your request is now visible',
      });
      router.push(appRoutes.requests());
    },
  });

  function onSubmit(data: z.infer<typeof RequestFormSchema>) {
    createRequest({ ...data, dueDate: new Date(data.dueDate).toISOString() });
  }

  return <RequestForm onSubmit={onSubmit} isMutating={isMutating} />;
}
