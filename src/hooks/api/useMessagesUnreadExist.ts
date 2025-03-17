import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { MessagesQueryKeys } from '@/lib/queryKeyFactory';

type ResponseType = {
  hasUnread: boolean;
};

const fetchUnreadMessagesIndicator = (): Promise<ResponseType> => {
  return apiClient.get('/messages/unread-exists');
};

export function useMessagesUnreadExist(
  options?: UseQueryOptions<ResponseType>
) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: MessagesQueryKeys.unreadExist(),
    queryFn: fetchUnreadMessagesIndicator,
    retry: 2,
    meta: {
      name: 'Unread messages indicator',
    },
    ...options,
  });

  return {
    data: data,
    isLoading,
    error: isError ? error : null,
  };
}
