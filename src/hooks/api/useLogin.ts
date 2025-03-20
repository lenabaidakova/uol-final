import { useMutation } from '@tanstack/react-query';
import { getSession, signIn } from 'next-auth/react';
import type { MutationOptions } from '@tanstack/react-query';

export type LoginData = {
  email: string;
  password: string;
};

export type LoginResponse = {
  ok: boolean;
  error?: string;
};

const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const result = await signIn('credentials', {
    redirect: false,
    email: data.email,
    password: data.password,
  });

  if (!result) {
    throw new Error('Unexpected error occurred during login.');
  }

  if (result.error) {
    throw new Error(result.error);
  }

  await getSession();

  return { ok: true };
};

export function useLogin(
  options?: MutationOptions<LoginResponse, Error, LoginData>
) {
  const { mutate, isPending, isError, error } = useMutation<
    LoginResponse,
    Error,
    LoginData
  >({
    mutationFn: loginUser,
    meta: {
      name: 'Login',
    },
    ...options,
  });

  return {
    mutate,
    isMutating: isPending,
    error: isError ? error : null,
  };
}
