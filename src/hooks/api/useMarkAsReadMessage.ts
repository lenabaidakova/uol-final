import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { MutationOptions } from '@/types/Api';

export type MarkAsReadData = {
  requestId: string;
};

export type MarkAsReadResponse = {
  message: string;
};

const markMessagesAsRead = (
  data: MarkAsReadData
): Promise<MarkAsReadResponse> => {
  return apiClient.post('/messages/mark-as-read', data);
};

export function useMarkAsReadMessage(
  opt?: MutationOptions<MarkAsReadResponse, MarkAsReadData>
) {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: markMessagesAsRead,
    meta: {
      name: 'Mark messages as read',
    },
    ...opt,
  });

  return {
    mutate,
    isMutating: isPending,
    error: isError ? error : null,
  };
}
