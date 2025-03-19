import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PATCH } from './route';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { ROLES } from '@/constants/Role';
import { REQUEST_STATUS } from '@/constants/Request';

vi.mock('@/lib/prisma', () => {
  return {
    default: {
      request: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      requestType: {
        findUnique: vi.fn(),
      },
      requestUrgency: {
        findUnique: vi.fn(),
      },
      requestStatus: {
        findUnique: vi.fn(),
      },
    },
  };
});

vi.mock('next-auth', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    getServerSession: vi.fn(),
  };
});

describe('/api/requests/update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if the user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const response = await PATCH(
      new Request('http://localhost:3000/api/requests/update', {
        method: 'PATCH',
        body: JSON.stringify({ id: 'request-id-123', title: 'Updated Title' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.message).toBe('Unauthorized');
  });

  it('should return 400 if request ID is missing', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'user-id-123' },
    });

    const response = await PATCH(
      new Request('http://localhost:3000/api/requests/update', {
        method: 'PATCH',
        body: JSON.stringify({ title: 'Updated title' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe('Request ID is required');
  });

  it('should return 404 if the request is not found', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'user-id-123' },
    });

    prisma.request.findUnique.mockResolvedValueOnce(null);

    const response = await PATCH(
      new Request('http://localhost:3000/api/requests/update', {
        method: 'PATCH',
        body: JSON.stringify({ id: 'nonexistent-id', title: 'Updated Title' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.message).toBe('Request not found');
  });

  it('should return 400 if supporter tries to take not pending request', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'supporter-id', role: ROLES.SUPPORTER },
    });
    prisma.request.findUnique.mockResolvedValueOnce({
      id: 'request-id',
      statusId: 'in-progress-id',
    });
    prisma.requestStatus.findUnique.mockResolvedValueOnce({ id: 'pending-id' });

    const response = await PATCH(
      new Request('http://localhost:3000/api/requests/update', {
        method: 'PATCH',
        body: JSON.stringify({
          id: 'request-id',
          status: REQUEST_STATUS.IN_PROGRESS,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe('Only pending requests can be taken');
  });

  it('should return 200 if the request is successfully updated', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'user-id-123', role: ROLES.SHELTER },
    });
    prisma.request.findUnique.mockResolvedValueOnce({
      id: 'existing-id',
      creatorId: 'user-id-123',
    });
    prisma.requestStatus.findUnique.mockResolvedValueOnce({ id: 'status-id' });
    prisma.request.update.mockResolvedValueOnce({
      id: 'existing-id',
      statusId: 'status-id',
      title: 'Updated title',
    });

    const response = await PATCH(
      new Request('http://localhost:3000/api/requests/update', {
        method: 'PATCH',
        body: JSON.stringify({
          id: 'existing-id',
          title: 'Updated title',
          status: REQUEST_STATUS.IN_PROGRESS,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.message).toBe('Request updated successfully');
    expect(body.request.title).toBe('Updated title');
  });
});
