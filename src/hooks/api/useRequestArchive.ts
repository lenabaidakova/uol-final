import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { MutationOptions } from '@/types/Api';

export type UpdateRequestData = {
  id: string;
};

const archiveRequest = (data: UpdateRequestData): Promise<unknown> => {
  return apiClient.patch('/requests/archive', data);
};

export function useRequestArchive(
  opt?: MutationOptions<unknown, UpdateRequestData>
) {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: archiveRequest,
    meta: {
      name: 'Archive request',
    },
    ...opt,
  });

  return {
    mutate,
    isMutating: isPending,
    error: isError ? error : null,
  };
}
