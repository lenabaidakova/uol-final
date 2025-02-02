import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { MutationOptions } from '@/types/Api';

export type SendMessageData = {
  userId: string;
  newName: string;
};

const sendMessage = (data: SendMessageData): Promise<unknown> => {
  return apiClient.post('/messages', data);
};

export function useMessagePost(
  opt?: MutationOptions<unknown, SendMessageData>
) {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: sendMessage,
    meta: {
      name: 'Send message',
    },
    ...opt,
  });

  return {
    mutate,
    isMutating: isPending,
    error: isError ? error : null,
  };
}
