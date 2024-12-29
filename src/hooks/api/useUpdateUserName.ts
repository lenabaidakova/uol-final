import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { MutationOptions } from '@/types/Api';

export type UpdateUserNameData = {
  userId: string;
  newName: string;
};

export type UpdateUserNameResponse = {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

const updateUserName = (
  data: UpdateUserNameData
): Promise<UpdateUserNameResponse> => {
  console.dir();
  return apiClient.post('/user/update-name', data);
};

export function useUpdateUserName(
  opt?: MutationOptions<UpdateUserNameResponse, UpdateUserNameData>
) {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateUserName,
    meta: {
      name: 'Update user name',
    },
    ...opt,
  });

  return {
    mutate,
    isMutating: isPending,
    error: isError ? error : null,
  };
}
