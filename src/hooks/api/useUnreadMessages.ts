import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export const UNREAD_MESSAGES_KEY = 'unreadMessages';

export type UnreadMessage = {
  requestId: string;
  title: string;
  lastMessageFrom: string;
  lastMessageDate: string;
  unreadCount: number;
};

export type UnreadMessagesResponse = {
  unreadRequests: UnreadMessage[];
  pagination: {
    totalUnread: number;
    page: number;
    limit: number;
  };
};

export type UnreadMessagesQuery = {
  page?: number;
  limit?: number;
};

const fetchUnreadMessages = async (
  query: UnreadMessagesQuery
): Promise<UnreadMessagesResponse> => {
  const { page = 1, limit = 10 } = query;

  return apiClient.get('/messages/unread', {
    params: { page, limit },
  });
};

export function useUnreadMessages(
  query: UnreadMessagesQuery,
  options?: UseQueryOptions<UnreadMessagesResponse>
) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [UNREAD_MESSAGES_KEY, query],
    queryFn: () => fetchUnreadMessages(query),
    retry: 2,
    meta: {
      name: 'Unread messages',
    },
    ...options,
  });

  return {
    unreadMessages: data?.unreadRequests || [],
    totalUnread: data?.pagination?.totalUnread || 0,
    page: data?.pagination?.page || query.page || 1,
    limit: data?.pagination?.limit || query.limit || 10,
    isLoading,
    error: isError ? error : null,
  };
}
