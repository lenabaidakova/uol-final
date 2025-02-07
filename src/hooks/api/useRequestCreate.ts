import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { MutationOptions } from '@/types/Api';
import { RequestType, UrgencyType } from '@/constants/Request';

export type CreateRequestData = {
  title: string;
  dueDate: string;
  details: string;
  location: string;
  type: RequestType;
  urgency: UrgencyType;
};

const createRequest = (data: CreateRequestData): Promise<unknown> => {
  return apiClient.post('/requests/create', data);
};

export function useRequestCreate(
  opt?: MutationOptions<unknown, CreateRequestData>
) {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createRequest,
    meta: {
      name: 'Create request',
    },
    ...opt,
  });

  return {
    mutate,
    isMutating: isPending,
    error: isError ? error : null,
  };
}
