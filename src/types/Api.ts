import { UseMutationOptions } from '@tanstack/react-query';

export type ApiError = {
  message?: string;
  error?: string;
  statusCode?: number;
  headers?: Headers;
};

export type MutationOptions<
  Response,
  TVariables = unknown,
> = UseMutationOptions<Response, ApiError, TVariables, unknown>;
