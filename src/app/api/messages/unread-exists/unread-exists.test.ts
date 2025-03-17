import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/messages/unread-exists/route';
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
    unreadMessage: {
      findFirst: vi.fn(),
    },
  },
}));

describe('/api/messages/unread-exists', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const response = await GET(
      new Request('http://localhost:3000/api/messages/unread-exists')
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.message).toBe('Unauthorized');
  });

  it('should return { hasUnread: true } if unread messages exist', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'user-id-123' },
    });

    prisma.unreadMessage.findFirst.mockResolvedValueOnce({
      id: 'unread-msg-1',
    });

    const response = await GET(
      new Request('http://localhost:3000/api/messages/unread-exists')
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ hasUnread: true });
  });

  it('should return { hasUnread: false } if no unread messages exist', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'user-id-123' },
    });

    prisma.unreadMessage.findFirst.mockResolvedValueOnce(null);

    const response = await GET(
      new Request('http://localhost:3000/api/messages/unread-exists')
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ hasUnread: false });
  });
});
