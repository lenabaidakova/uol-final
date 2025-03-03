import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getSupporterDashboard } from '@/app/api/dashboard/supporter/route';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    getServerSession: vi.fn(),
  };
});

vi.mock('@/lib/prisma', () => ({
  default: {
    request: {
      count: vi.fn(),
      findMany: vi.fn(),
    },
    unreadMessage: {
      count: vi.fn(),
    },
  },
}));

describe('/api/dashboard/supporter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if the user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const response = await getSupporterDashboard(
      new Request('http://localhost:3000/api/dashboard/supporter')
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe('Unauthorized');
  });

  it('should return 403 if user does not have the SUPPORTER role', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: '123', role: 'SHELTER' },
    });

    const response = await getSupporterDashboard(
      new Request('http://localhost:3000/api/dashboard/supporter')
    );

    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.message).toBe('Only supporters can access dashboard');
  });

  it('should return dashboard data for valid supporter user', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'supporter-123', role: 'SUPPORTER' },
    });

    prisma.request.count
      .mockResolvedValueOnce(7) // requests in progress
      .mockResolvedValueOnce(3); // fulfilled requests

    prisma.unreadMessage.count.mockResolvedValueOnce(2); // unread messages

    prisma.request.findMany
      .mockResolvedValueOnce([
        {
          title: 'Blankets for winter',
          creator: { name: 'Happy Paws Shelter' },
          dueDate: new Date('2024-12-04'),
        },
      ]) // recent in progress requests
      .mockResolvedValueOnce([
        {
          title: 'Food donations for winter',
          creator: { name: 'Happy Paws Shelter' },
          dueDate: new Date('2024-12-25'),
        },
      ]); // suggested requests

    const response = await getSupporterDashboard(
      new Request('http://localhost:3000/api/dashboard/supporter')
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      requestsInProgress: 7,
      fulfilledRequests: 3,
      unreadMessages: 2,
      recentRequests: [
        {
          title: 'Blankets for winter',
          creator: { name: 'Happy Paws Shelter' },
          dueDate: '2024-12-04T00:00:00.000Z',
        },
      ],
      suggestedRequests: [
        {
          title: 'Food donations for winter',
          creator: { name: 'Happy Paws Shelter' },
          dueDate: '2024-12-25T00:00:00.000Z',
        },
      ],
    });
  });
});
