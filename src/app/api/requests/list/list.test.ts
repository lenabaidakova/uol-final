import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/requests/list/route';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    default: vi.fn(),
    getServerSession: vi.fn(),
  };
});

vi.mock('@/lib/prisma', () => ({
  default: {
    request: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe('/api/requests/list', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if the user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const response = await GET(
      new Request('http://localhost:3000/api/requests/list')
    );

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.message).toBe('Unauthorized');
  });

  it('should return all requests if the user is a SUPPORTER', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'supporter-id-123', role: 'SUPPORTER' },
    });

    const mockRequests = Array.from({ length: 10 }, (_, i) => ({
      id: `request-id-${i}`,
      title: `Request title ${i}`,
      type: 'SUPPLIES',
      urgency: 'HIGH',
      dueDate: null,
      details: `Request details ${i}`,
      location: 'Test location',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    prisma.request.findMany.mockResolvedValueOnce(mockRequests);
    prisma.request.count.mockResolvedValueOnce(25);

    const response = await GET(
      new Request('http://localhost:3000/api/requests/list')
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.requests).toHaveLength(10);
  });

  it("should return only the shelter's own requests if the user is a SHELTER", async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'shelter-id-123', role: 'SHELTER' },
    });

    const mockRequests = [
      {
        id: 'request-id-1',
        title: "Shelter's own request",
        type: 'SUPPLIES',
        urgency: 'MEDIUM',
        location: 'Los Angeles',
        status: 'PENDING',
        creatorId: 'shelter-id-123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    prisma.request.findMany.mockResolvedValueOnce(mockRequests);
    prisma.request.count.mockResolvedValueOnce(1);

    const response = await GET(
      new Request('http://localhost:3000/api/requests/list')
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.requests).toHaveLength(1);
    expect(body.requests[0].creatorId).toBe('shelter-id-123');
  });

  it('should return filtered requests by location for a SUPPORTER', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'supporter-id-123', role: 'SUPPORTER' },
    });

    const mockRequests = [
      {
        id: 'request-id-1',
        title: 'Food donation needed',
        type: 'SUPPLIES',
        urgency: 'MEDIUM',
        dueDate: null,
        details: 'Request details 1',
        location: 'Chicago',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    prisma.request.findMany.mockResolvedValueOnce(mockRequests);
    prisma.request.count.mockResolvedValueOnce(1);

    const response = await GET(
      new Request('http://localhost:3000/api/requests/list?text=Food')
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.requests).toHaveLength(1);
    expect(body.requests[0].title).toContain('Food');
  });
});
