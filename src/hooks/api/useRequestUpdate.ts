import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { MutationOptions } from '@/types/Api';
import {
  RequestStatusType,
  RequestType,
  UrgencyType,
} from '@/constants/Request';

export type UpdateRequestData = {
  id: string;
  title?: string;
  dueDate?: string;
  details?: string;
  location?: string;
  type?: RequestType;
  urgency?: UrgencyType;
  status?: RequestStatusType;
};

const createRequest = (data: UpdateRequestData): Promise<unknown> => {
  return apiClient.patch('/requests/update', data);
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
