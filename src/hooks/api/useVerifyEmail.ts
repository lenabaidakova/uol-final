import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import type { MutationOptions } from '@/types/Api';

export type VerifyEmailData = {
  token: string;
};

export type VerifyEmailResponse = {
  message: string;
};

const verifyEmail = (data: VerifyEmailData): Promise<VerifyEmailResponse> => {
  return apiClient.post('/auth/confirm-email', data);
};

export function useVerifyEmail(
  opt?: MutationOptions<VerifyEmailResponse, VerifyEmailData>
) {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: verifyEmail,
    meta: {
      name: 'Verify email',
    },
    ...opt,
  });

  return {
    mutate,
    isMutating: isPending,
    error: isError ? error : null,
  };
}
