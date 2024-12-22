// msw API mocking setup

import { http, HttpResponse } from 'msw';
import { User } from '@prisma/client';

type RegisterRequestBody = Pick<User, 'username' | 'password' | 'role'>;

type RegisterResponseBody = {
  message: string;
  user?: Pick<User, 'id' | 'username' | 'role'>;
};

type EmptyParams = {};

export const handlers = [
  // registration endpoint mock
  http.post<
    EmptyParams,
    RegisterRequestBody,
    RegisterResponseBody,
    '/api/register'
  >('/api/register', async ({ request }) => {
    const { username, password, role } = await request.json();

    // check required fields
    if (!username || !password || !role) {
      return HttpResponse.json(
        { message: 'Username, password and role are required fields' },
        { status: 400 }
      );
    }

    if (role !== 'SUPPORTER' && role !== 'SHELTER') {
      return HttpResponse.json(
        { message: 'Role should be supporter or shelter' },
        { status: 400 }
      );
    }

    // successful response
    return HttpResponse.json(
      {
        message: 'User registered successfully',
        user: { id: '1', username, role },
      },
      { status: 201 }
    );
  }),
];
