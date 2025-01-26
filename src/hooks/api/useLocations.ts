import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

type ResponseType = {
  locations: string[];
};

const fetchLocationsList = (): Promise<ResponseType> => {
  return apiClient.get('/requests/locations');
};

export function useLocationsList(options?: UseQueryOptions<ResponseType>) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['locationsList'],
    queryFn: fetchLocationsList,
    retry: 2,
    meta: {
      name: 'Locations list',
    },
    ...options,
  });

  return {
    data: data,
    isLoading,
    error: isError ? error : null,
  };
}
