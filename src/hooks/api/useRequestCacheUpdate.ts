import { useQueryClient } from '@tanstack/react-query';
import {
  Request,
  REQUEST_LIST_KEY,
  RequestListResponse,
} from '@/hooks/api/useRequestList';
import { RequestStatusType } from '@/constants/Request';

type updateStatusArgs = {
  requestId: string;
  newStatus: RequestStatusType;
};

export function useRequestCacheUpdate() {
  const queryClient = useQueryClient();

  const updateStatus = ({ requestId, newStatus }: updateStatusArgs) => {
    const cachedPages = queryClient.getQueriesData<RequestListResponse>({
      queryKey: [REQUEST_LIST_KEY],
    });

    cachedPages.forEach(([queryKey, cachedData]) => {
      if (!cachedData) return;

      queryClient.setQueryData(queryKey, {
        ...cachedData,
        requests: cachedData.requests.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req
        ),
      });
    });
  };

  return { updateStatus };
}
