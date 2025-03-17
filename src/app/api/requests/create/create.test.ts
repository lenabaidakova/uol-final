// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', async (importOriginal) => {
  const original = await importOriginal<typeof import('next-auth')>();
  return {
    ...original,
    getServerSession: vi.fn(),
  };
});

vi.mock('@/lib/prisma', () => ({
  default: {
    request: {
      create: vi.fn(),
    },
    requestType: {
      findUnique: vi.fn(),
    },
    requestUrgency: {
      findUnique: vi.fn(),
    },
  },
}));

describe('/api/requests/create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if the user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const response = await POST(
      new Request('http://localhost:3000/api/requests/create', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Need blankets',
          type: 'SUPPLIES',
          urgency: 'HIGH',
          details: 'We need 100 blankets for the winter season.',
          location: 'New York',
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe('Unauthorized');
  });

  it('should return 403 if the user does not have the SHELTER role', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: '123', role: 'SUPPORTER' },
    });

    const response = await POST(
      new Request('http://localhost:3000/api/requests/create', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Need blankets',
          type: 'SUPPLIES',
          urgency: 'HIGH',
          details: 'We need 100 blankets for the winter season.',
          location: 'New York',
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.message).toBe(
      'Only users with the SHELTER role can create requests'
    );
  });

  it('should return 201 if the request is successfully created', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: '123', role: 'SHELTER' },
    });

    prisma.requestType.findUnique.mockResolvedValueOnce({ id: 'type-id' });
    prisma.requestUrgency.findUnique.mockResolvedValueOnce({
      id: 'urgency-id',
    });

    const mockRequest = {
      id: 'request-id-123',
      title: 'Need blankets',
      typeId: 'type-id',
      urgencyId: 'urgency-id',
      dueDate: '2025-02-01T00:00:00.000Z',
      details: 'We need 100 blankets for the winter season.',
      location: 'New York',
      creatorId: '123',
      createdAt: '2025-02-01T00:00:00.000Z',
      updatedAt: '2025-02-01T00:00:00.000Z',
    };

    prisma.request.create.mockResolvedValueOnce(mockRequest);

    const response = await POST(
      new Request('http://localhost:3000/api/requests/create', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Need blankets',
          type: 'SUPPLIES',
          urgency: 'HIGH',
          dueDate: '2025-02-01',
          details: 'We need 100 blankets for the winter season.',
          location: 'New York',
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();
    expect(response.status).toBe(201);
    expect(body.message).toBe('Request created successfully');
    expect(body.request).toEqual(mockRequest);
  });
});
