import { useQueryClient } from '@tanstack/react-query';
import {
  REQUEST_LIST_KEY,
  RequestListResponse,
} from '@/hooks/api/useRequestList';
import { RequestStatusType } from '@/constants/Request';
import { RequestsQueryKeys } from '@/lib/queryKeyFactory';

/**
Hook to update the request list cache after a status change.

React Query caches API responses to avoid unnecessary network requests.
However, if a request status is updated (for example, from "Pending" to "In progress"),
UI should reflect this change immediately. Instead of refetching all data,
we update cached request list directly. This improves performance by keeping
the UI in sync without making extra API calls
 */

type UpdateStatusArgs = {
  requestId: string;
  newStatus: RequestStatusType;
};

export function useRequestCacheUpdate() {
  const queryClient = useQueryClient(); // get query cache
  const updateStatus = ({ requestId, newStatus }: UpdateStatusArgs) => {
    // retrieve all cached pages of the request list
    const cachedPages = queryClient.getQueriesData<RequestListResponse>({
      queryKey: [REQUEST_LIST_KEY],
    });

    cachedPages.forEach(([queryKey, cachedData]) => {
      if (!cachedData) return;

      // update the status of the specific request in the cache
      queryClient.setQueryData(queryKey, {
        ...cachedData,
        requests: cachedData.requests.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req
        ),
      });
    });

    // update the individual request cache
    const requestCacheKey = RequestsQueryKeys.byId(requestId);
    queryClient.setQueryData(
      requestCacheKey,
      (cachedRequest: { request: Request | null }) => {
        if (!cachedRequest) return null;
        return { request: { ...cachedRequest.request, status: newStatus } };
      }
    );
  };

  return { updateStatus }; // return function so components can trigger cache updates
}
