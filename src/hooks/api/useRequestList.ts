import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import {
  RequestType,
  UrgencyType,
  RequestStatusType,
} from '@/constants/Request';

export type Request = {
  id: string;
  title: string;
  type: RequestType;
  urgency: UrgencyType;
  dueDate?: string | null;
  details: string;
  location: string;
  status: RequestStatusType;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
};

export type RequestListResponse = {
  requests: Request[];
  pagination: {
    totalRequests: number;
    page: number;
    limit: number;
  };
};

export type RequestListQuery = {
  page?: number;
  limit?: number;
  text?: string;
  dueDateStart?: string;
  dueDateEnd?: string;
};

const fetchRequestList = async (
  query: RequestListQuery
): Promise<RequestListResponse> => {
  const {
    page = 1,
    limit = 10,
    text = '',
    dueDateStart = '',
    dueDateEnd = '',
  } = query;

  return apiClient.get('/requests/list', {
    params: { page, limit, text, dueDateStart, dueDateEnd },
  });
};

export function useRequestList(
  query: RequestListQuery,
  options?: UseQueryOptions<RequestListResponse>
) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['requestList', query],
    queryFn: () => fetchRequestList(query),
    retry: 2,
    meta: {
      name: 'Request list',
    },
    ...options,
  });

  return {
    requests: data?.requests || [],
    total: data?.pagination?.totalRequests || 0,
    page: data?.pagination?.page || query.page || 1,
    limit: data?.pagination?.limit || query.limit || 10,
    isLoading,
    error: isError ? error : null,
  };
}
