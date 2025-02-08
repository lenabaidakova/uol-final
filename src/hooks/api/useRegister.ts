import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { MutationOptions } from '@/types/Api';
import { RoleType } from '@/types/RoleType';

export type RegistrationData = {
  email: string;
  name: string;
  password: string;
  role: RoleType;
};

export type RegistrationResponse = {
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: RoleType;
  };
};

const registerUser = (
  data: RegistrationData
): Promise<RegistrationResponse> => {
  return apiClient.post('/auth/register', data);
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
