'use client';

import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { usePathname, useRouter } from 'next/navigation';
import { RequestForm, RequestFormSchema } from '@/app/ui/RequestForm';
import { appRoutes } from '@/lib/appRoutes';
import { useRequestUpdate } from '@/hooks/api/useRequestUpdate';
import { useRequestById } from '@/hooks/api/useRequestById';

export function EditRequestBody() {
  const pathname = usePathname();
  const requestId = pathname.split('/')[2];
  const router = useRouter();
  const { toast } = useToast();
  const { data: requestData } = useRequestById({ id: requestId });
  const { mutate: updateRequest, isMutating } = useRequestUpdate({
    onSuccess: () => {
      toast({
        title: 'Request updated',
        description: 'Your request is now updated',
      });
      router.push(appRoutes.requests());
    },
  });

  function onSubmit(data: z.infer<typeof RequestFormSchema>) {
    updateRequest({
      ...data,
      dueDate: new Date(data.dueDate).toISOString(),
      id: requestId,
    });
  }

  if (!requestData) {
    return null;
  }

  return (
    <RequestForm
      onSubmit={onSubmit}
      isMutating={isMutating}
      defaultValues={requestData.request}
      isEdit={true}
    />
  );
}
