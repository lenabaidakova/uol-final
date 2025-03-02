import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export const SHELTER_DASHBOARD_KEY = 'shelterDashboard';

export type ShelterDashboardResponse = {
  activeRequests: number;
  fulfilledRequests: number;
  unreadMessages: number;
  recentRequests: {
    id: string;
    title: string;
    assignedTo?: { name: string } | null;
    updatedAt: string;
  }[];
  stats: {
    month: string;
    created: number;
    fulfilled: number;
  }[];
};

const fetchShelterDashboard = async (): Promise<ShelterDashboardResponse> => {
  return apiClient.get('/dashboard/shelter');
};

export function useShelterDashboard(
  options?: UseQueryOptions<ShelterDashboardResponse>
) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [SHELTER_DASHBOARD_KEY],
    queryFn: fetchShelterDashboard,
    retry: 2,
    meta: {
      name: 'Shelter dashboard',
    },
    ...options,
  });

  return {
    data,
    isLoading,
    error: isError ? error : null,
  };
}
