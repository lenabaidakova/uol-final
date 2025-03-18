import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import {
  RequestStatusType,
  RequestType,
  UrgencyType,
} from '@/constants/Request';
import { RequestsQueryKeys } from '@/lib/queryKeyFactory';

type RequestByIdResponse = {
  request: {
    id: string;
    title: string;
    dueDate: string;
    details: string;
    location: string;
    type: RequestType;
    urgency: UrgencyType;
    status: RequestStatusType;
    creatorName: string;
  };
};

export type RequestByIdQuery = {
  id: string;
};

const getRequestById = async (
  query: RequestByIdQuery
): Promise<RequestByIdResponse> => {
  return apiClient.get('/requests/item', {
    params: {
      id: query.id,
    },
  });
};

export function useRequestById(
  query: RequestByIdQuery,
  options?: UseQueryOptions<RequestByIdResponse>
) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: RequestsQueryKeys.byId(query.id),
    enabled: !!query.id,
    queryFn: () => getRequestById(query),
    retry: 2,
    meta: {
      name: 'Get request by id',
    },
    ...options,
  });

  return {
    data,
    isLoading,
    error: isError ? error : null,
  };
}
