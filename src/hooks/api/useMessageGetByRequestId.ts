import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

type Message = {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
};

export type MessageByIdResponse = {
  messages: Message[];
};

export type MessageQuery = {
  id: string;
};

const fetchMessageById = async (
  query: MessageQuery
): Promise<MessageByIdResponse> => {
  return apiClient.get(`/messages/${query.id}`);
};

export function useMessageGetByRequestId(
  query: MessageQuery,
  options?: UseQueryOptions<MessageByIdResponse>
) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['useMessageGetByRequestId', query],
    enabled: !!query.id,
    queryFn: () => fetchMessageById(query),
    retry: 2,
    meta: {
      name: 'Message by request',
    },
    ...options,
  });

  return {
    data,
    isLoading,
    error: isError ? error : null,
  };
}
