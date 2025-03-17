import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/messages/mark-as-read/route';
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
      deleteMany: vi.fn(),
    },
  },
}));

describe('/api/messages/mark-as-read', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if the user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const response = await POST(
      new Request('http://localhost:3000/api/messages/mark-as-read', {
        method: 'POST',
        body: JSON.stringify({ requestId: 'request-id-123' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.message).toBe('Unauthorized');
  });

  it('should return 400 if requestId is missing', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'user-id-123' },
    });

    const response = await POST(
      new Request('http://localhost:3000/api/messages/mark-as-read', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe('Request ID is required');
  });

  it('should delete unread messages for the user in the specified request', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'user-id-123' },
    });

    vi.mocked(prisma.unreadMessage.deleteMany).mockResolvedValueOnce({
      count: 3,
    });

    const response = await POST(
      new Request('http://localhost:3000/api/messages/mark-as-read', {
        method: 'POST',
        body: JSON.stringify({ requestId: 'request-id-123' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.message).toBe('Messages marked as read');
    expect(prisma.unreadMessage.deleteMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-id-123',
        requestId: 'request-id-123',
      },
    });
  });
});
