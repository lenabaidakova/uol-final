import { http, HttpResponse } from 'msw';
import { User } from '@prisma/client';

type RegisterRequestBody = Pick<User, 'email' | 'password' | 'role'>;

type RegisterResponseBody = {
  message: string;
  user?: Pick<User, 'id' | 'email' | 'role'>;
};

type EmptyParams = {};

export const handlers = [
  http.post<
    EmptyParams,
    RegisterRequestBody,
    RegisterResponseBody,
    '/api/register'
  >('/api/register', async ({ request }) => {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return HttpResponse.json(
        { message: 'Email, password, and role are required fields' },
        { status: 400 }
      );
    }

    if (role !== 'SUPPORTER' && role !== 'SHELTER') {
      return HttpResponse.json(
        { message: 'Role should be supporter or shelter' },
        { status: 400 }
      );
    }

    if (email === 'existing@example.com') {
      return HttpResponse.json(
        { message: 'Email is already registered' },
        { status: 400 }
      );
    }

    const confirmationToken = 'mock-confirmation-token';

    return HttpResponse.json(
      {
        message:
          'Registration successful. Please check your email to confirm your account.',
        user: { id: '1', email, role },
      },
      { status: 201 }
    );
  }),
];
