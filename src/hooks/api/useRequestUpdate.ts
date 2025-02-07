import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { MutationOptions } from '@/types/Api';
import { RequestType, UrgencyType } from '@/constants/Request';

export type UpdateRequestData = {
  title: string;
  dueDate: string;
  details: string;
  location: string;
  type: RequestType;
  urgency: UrgencyType;
};

const createRequest = (data: UpdateRequestData): Promise<unknown> => {
  return apiClient.post('/requests/update', data);
};

export function useRequestUpdate(
  opt?: MutationOptions<unknown, UpdateRequestData>
) {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createRequest,
    meta: {
      name: 'Update request',
    },
    ...opt,
  });

  return {
    mutate,
    isMutating: isPending,
    error: isError ? error : null,
  };
}
