import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getShelterDashboard } from '@/app/api/dashboard/shelter/route';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { subMonths, startOfMonth, format } from 'date-fns';

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
      groupBy: vi.fn(),
    },
    unreadMessage: {
      count: vi.fn(),
    },
  },
}));

describe('/api/dashboard/shelter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if the user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const response = await getShelterDashboard(
      new Request('http://localhost:3000/api/dashboard/shelter')
    );

    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe('Unauthorized');
  });

  it('should return 403 if user does not have the SHELTER role', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: '123', role: 'SUPPORTER' },
    });

    const response = await getShelterDashboard(
      new Request('http://localhost:3000/api/dashboard/shelter')
    );

    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.message).toBe('Only shelters can access dashboard');
  });

  it('should return dashboard data for valid shelter user', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'shelter-123', role: 'SHELTER' },
    });

    prisma.request.count
      .mockResolvedValueOnce(10) // active requests
      .mockResolvedValueOnce(5); // fulfilled requests

    prisma.unreadMessage.count.mockResolvedValueOnce(3); // unread messages

    prisma.request.findMany.mockResolvedValueOnce([
      {
        id: 'req-1',
        title: 'Need blankets',
        assignedTo: { name: 'John Smith' },
        updatedAt: new Date('2024-02-01'),
      },
    ]); // recent requests

    // last 12 months
    const months = Array.from({ length: 12 }).map((_, i) =>
      format(startOfMonth(subMonths(new Date(), 11 - i)), 'yyyy-MM')
    );

    const createdMockData = [
      { createdAt: new Date('2024-01-01'), _count: { _all: 20 } },
      { createdAt: new Date('2024-02-01'), _count: { _all: 25 } },
    ];

    const fulfilledMockData = [
      { updatedAt: new Date('2024-01-01'), _count: { _all: 10 } },
      { updatedAt: new Date('2024-02-01'), _count: { _all: 15 } },
    ];

    prisma.request.groupBy
      .mockResolvedValueOnce(createdMockData) // created requests
      .mockResolvedValueOnce(fulfilledMockData); // fulfilled requests

    const response = await getShelterDashboard(
      new Request('http://localhost:3000/api/dashboard/shelter')
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      activeRequests: 10,
      fulfilledRequests: 5,
      unreadMessages: 3,
      recentRequests: [
        {
          id: 'req-1',
          title: 'Need blankets',
          assignedTo: { name: 'John Smith' },
          updatedAt: '2024-02-01T00:00:00.000Z',
        },
      ],
      stats: months.map((month) => ({
        month,
        created: createdMockData.reduce(
          (total, c) =>
            format(c.createdAt, 'yyyy-MM') === month
              ? total + c._count._all
              : total,
          0
        ),
        fulfilled: fulfilledMockData.reduce(
          (total, f) =>
            format(f.updatedAt, 'yyyy-MM') === month
              ? total + f._count._all
              : total,
          0
        ),
      })),
    });
  });

  it('should return an empty stats array if no requests exist', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'shelter-123', role: 'SHELTER' },
    });

    prisma.request.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);
    prisma.unreadMessage.count.mockResolvedValueOnce(0);
    prisma.request.findMany.mockResolvedValueOnce([]);

    prisma.request.groupBy.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    const response = await getShelterDashboard(
      new Request('http://localhost:3000/api/dashboard/shelter')
    );

    const body = await response.json();

    // Generate last 12 months
    const months = Array.from({ length: 12 }).map((_, i) =>
      format(startOfMonth(subMonths(new Date(), 11 - i)), 'yyyy-MM')
    );

    expect(response.status).toBe(200);
    expect(body).toEqual({
      activeRequests: 0,
      fulfilledRequests: 0,
      unreadMessages: 0,
      recentRequests: [],
      stats: months.map((month) => ({
        month,
        created: 0,
        fulfilled: 0,
      })),
    });
  });
});
