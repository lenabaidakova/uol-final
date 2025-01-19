import { describe, it, expect, vi } from 'vitest';
import { POST } from './route';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      update: vi.fn(),
    },
  },
}));

describe('/api/users/updateName', () => {
  it('should return 400 if userId or newName is missing', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/users/updateName', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe('User ID and new name are required');
  });

  it('should return 400 if only newName is provided', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/users/updateName', {
        method: 'POST',
        body: JSON.stringify({ newName: 'John Doe' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe('User ID and new name are required');
  });

  it('should return 200 if user name is successfully updated', async () => {
    const mockUser = {
      id: '12345',
      name: 'John Doe',
    };

    prisma.user.update.mockResolvedValueOnce(mockUser);

    const response = await POST(
      new Request('http://localhost:3000/api/users/updateName', {
        method: 'POST',
        body: JSON.stringify({ userId: '12345', newName: 'John Doe' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe('Updated successfully');
    expect(body.user).toEqual(mockUser);
    expect(body.refreshSession).toBe(true);
  });
});
