import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export const SUPPORTER_DASHBOARD_KEY = 'supporterDashboard';

export type SupporterDashboardResponse = {
  requestsInProgress: number;
  fulfilledRequests: number;
  unreadMessages: number;
  recentRequests: {
    id: string;
    title: string;
    creator: { name: string };
    dueDate: string | null;
  }[];
  suggestedRequests: {
    id: string;
    title: string;
    creator: { name: string };
    dueDate: string | null;
  }[];
};

const fetchSupporterDashboard = (): Promise<SupporterDashboardResponse> => {
    return apiClient.get('/dashboard/supporter');
  };

export function useSupporterDashboard(
  options?: UseQueryOptions<SupporterDashboardResponse>
) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [SUPPORTER_DASHBOARD_KEY],
    queryFn: fetchSupporterDashboard,
    retry: 2,
    meta: {
      name: 'Supporter dashboard',
    },
    ...options,
  });

  return {
    data,
    isLoading,
    error: isError ? error : null,
  };
}
