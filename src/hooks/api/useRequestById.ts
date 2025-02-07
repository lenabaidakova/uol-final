import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { MutationOptions } from '@/types/Api';
import { RequestType, UrgencyType } from '@/constants/Request';

export type RequestByIdArgs = {
  id: string;
};

type RequestByIdResponse = {
  title: string;
  dueDate: string;
  details: string;
  location: string;
  type: RequestType;
  urgency: UrgencyType;
};

const getRequestById = (
  data: RequestByIdArgs
): Promise<RequestByIdResponse> => {
  return apiClient.get('/requests/item', {
    params: {
      id: data.id,
    },
  });
};

export function useRequestById(
  opt?: MutationOptions<RequestByIdResponse, RequestByIdArgs>
) {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: getRequestById,
    meta: {
      name: 'Get request by id',
    },
    ...opt,
  });

  return {
    mutate,
    isMutating: isPending,
    error: isError ? error : null,
  };
}
