import { describe, it, expect, vi } from 'vitest';
import { GET } from './route';

import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => {
  return {
    default: {
      request: {
        findUnique: vi.fn(),
      },
    },
  };
});

describe('/api/requests/item', () => {
  it('should return 400 if id is not provided', async () => {
    const response = await GET(
      new Request('http://localhost:3000/api/requests/item')
    );

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe('Request ID is required');
  });

  it('should return 404 if request with given id is not found', async () => {
    prisma.request.findUnique.mockResolvedValueOnce(null);

    const response = await GET(
      new Request('http://localhost:3000/api/requests/item?id=nonexistent-id')
    );

    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.message).toBe('Request not found');
  });

  it('should return the request if found', async () => {
    const mockRequest = {
      id: 'request-id-123',
      title: 'Food donation needed',
      type: { name: 'SUPPLIES' },
      urgency: { name: 'MEDIUM' },
      status: { name: 'PENDING' },
      dueDate: null,
      details: 'Request details',
      location: 'Chicago',
      creatorId: 'user-id-456',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    vi.mocked(prisma.request.findUnique).mockResolvedValueOnce(mockRequest);

    const response = await GET(
      new Request('http://localhost:3000/api/requests/item?id=request-id-123')
    );

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.request).toEqual({
      id: 'request-id-123',
      title: 'Food donation needed',
      type: 'SUPPLIES',
      urgency: 'MEDIUM',
      status: 'PENDING',
      dueDate: null,
      details: 'Request details',
      location: 'Chicago',
      creatorId: 'user-id-456',
    });
  });
});
