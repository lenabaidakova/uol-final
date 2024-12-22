import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { MutationOptions } from '@/types/Api';
import { RoleType } from '@/types/RoleType';

export type RegistrationData = {
  username: string;
  password: string;
  role: RoleType;
};

export type RegistrationResponse = {
  message: string;
  user?: {
    id: string;
    username: string;
    role: RoleType;
  };
};

const registerUser = (
  data: RegistrationData
): Promise<RegistrationResponse> => {
  return apiClient.post('/register', data);
};

export function useRegister(
  opt?: MutationOptions<RegistrationResponse, RegistrationData>
) {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: registerUser,
    meta: {
      name: 'Registration',
    },
    ...opt,
  });

  return {
    mutate,
    isMutating: isPending,
    error: isError ? error : null,
  };
}
