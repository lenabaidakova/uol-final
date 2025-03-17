import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/messages/unread/route';
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

    const mockUnreadMessages = [
      {
        message: {
          id: 'msg-1',
          text: 'I want to donate supplies',
          createdAt: '2025-02-02T13:37:25.827Z',
          sender: { id: 'supporter-id-1', name: 'John Doe' },
          request: { id: 'request-id-123', title: 'Food donation request' },
        },
      },
    ];

    prisma.unreadMessage.findMany.mockResolvedValueOnce(mockUnreadMessages);
    prisma.unreadMessage.count.mockResolvedValueOnce(1);

    const response = await GET(
      new Request('http://localhost:3000/api/messages/unread')
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.unreadRequests).toHaveLength(1);
    expect(body.unreadRequests[0].title).toBe('Food donation request');
    expect(body.unreadRequests[0].lastMessageFrom).toBe('John Doe');
    expect(body.unreadRequests[0].unreadCount).toBe(1);
  });

  it('should return unread messages for SUPPORTER', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'supporter-id-123', role: 'SUPPORTER' },
    });

    const mockUnreadMessages = [
      {
        message: {
          id: 'msg-1',
          text: 'Thanks for offering help',
          createdAt: '2025-02-02T13:37:25.827Z',
          sender: { id: 'shelter-id-1', name: 'Shelter ABC' },
          request: { id: 'request-id-456', title: 'Winter clothing donation' },
        },
      },
    ];

    prisma.unreadMessage.findMany.mockResolvedValueOnce(mockUnreadMessages);
    prisma.unreadMessage.count.mockResolvedValueOnce(1);

    const response = await GET(
      new Request('http://localhost:3000/api/messages/unread')
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.unreadRequests).toHaveLength(1);
    expect(body.unreadRequests[0].title).toBe('Winter clothing donation');
    expect(body.unreadRequests[0].lastMessageFrom).toBe('Shelter ABC');
    expect(body.unreadRequests[0].unreadCount).toBe(1);
  });

  it('should return paginated unread messages correctly', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'supporter-id-123', role: 'SUPPORTER' },
    });

    const mockUnreadMessages = Array.from({ length: 10 }, (_, i) => ({
      message: {
        id: `msg-${i}`,
        text: `Message ${i}`,
        createdAt: new Date().toISOString(),
        sender: { id: `sender-id-${i}`, name: `User ${i}` },
        request: { id: `request-id-${i}`, title: `Request ${i}` },
      },
    }));

    prisma.unreadMessage.findMany.mockResolvedValueOnce(mockUnreadMessages);
    prisma.unreadMessage.count.mockResolvedValueOnce(50);

    const response = await GET(
      new Request('http://localhost:3000/api/messages/unread?page=2&limit=10')
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.unreadRequests).toHaveLength(10);
    expect(body.pagination).toEqual({
      currentPage: 2,
      limit: 10,
      totalUnread: 50,
      totalPages: 5,
    });
  });

  it('should return an empty list if no unread messages', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'supporter-id-123', role: 'SUPPORTER' },
    });

    prisma.unreadMessage.findMany.mockResolvedValueOnce([]);
    prisma.unreadMessage.count.mockResolvedValueOnce(0);

    const response = await GET(
      new Request('http://localhost:3000/api/messages/unread')
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.unreadRequests).toHaveLength(0);
    expect(body.pagination.totalUnread).toBe(0);
  });
});
