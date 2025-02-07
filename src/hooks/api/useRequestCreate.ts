import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { MutationOptions } from '@/types/Api';
import { RoleType } from '@/types/RoleType';

export type CreateRequestData = {
  email: string;
  name: string;
  password: string;
  role: RoleType;
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
