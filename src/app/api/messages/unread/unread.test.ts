import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';

import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', async (importOriginal) => {
  const original = await importOriginal<typeof import('next-auth')>();
  return {
    ...original,
    default: vi.fn(),
    getServerSession: vi.fn(),
  };
});

vi.mock('@/lib/prisma', () => ({
  default: {
    unreadMessage: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe('/api/messages/unread', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const response = await GET(
      new Request('http://localhost:3000/api/messages/unread')
    );

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.message).toBe('Unauthorized');
  });

  it('should return unread messages for SHELTER', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'shelter-id-123', role: 'SHELTER' },
    });

    const mockUnreadMessages = Array.from({ length: 10 }, (_, i) => ({
      id: `unread-${i}`,
      userId: 'shelter-id-123',
      messageId: `msg-${i}`,
      requestId: `request-id-${i}`,
      createdAt: new Date(),
      message: {
        id: `msg-${i}`,
        text: `Message ${i}`,
        createdAt: new Date(),
        sender: { id: `sender-id-${i}`, name: `User ${i}` },
        request: { id: `request-id-${i}`, title: `Request ${i}` },
      },
    }));

    vi.mocked(prisma.unreadMessage.findMany).mockResolvedValueOnce(
      mockUnreadMessages
    );
    vi.mocked(prisma.unreadMessage.count).mockResolvedValueOnce(10);

    const response = await GET(
      new Request('http://localhost:3000/api/messages/unread?page=1&limit=10')
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.unreadRequests).toHaveLength(10);
    expect(body.pagination).toEqual({
      currentPage: 1,
      limit: 10,
      totalUnread: 10,
      totalPages: 1,
    });
  });

  it('should return an empty list if no unread messages', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'supporter-id-123', role: 'SUPPORTER' },
    });

    vi.mocked(prisma.unreadMessage.findMany).mockResolvedValueOnce([]);
    vi.mocked(prisma.unreadMessage.count).mockResolvedValueOnce(0);

    const response = await GET(
      new Request('http://localhost:3000/api/messages/unread')
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.unreadRequests).toHaveLength(0);
    expect(body.pagination.totalUnread).toBe(0);
  });
});
