// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

vi.mock('@/lib/prisma', () => ({
  default: {
    message: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock('next-auth', async (importOriginal) => {
  const original = await importOriginal<typeof import('next-auth')>();
  return {
    ...original,
    getServerSession: vi.fn(),
  };
});

describe('/api/messages/[requestId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const response = await GET(
      new Request('http://localhost:3000/api/messages/request-id-123'),
      { params: { requestId: 'request-id-123' } }
    );

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.message).toBe('Unauthorized');
  });

  it('should return 400 if requestId is missing', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'user-id-123' },
    });

    const response = await GET(
      new Request('http://localhost:3000/api/messages/'),
      { params: { requestId: '' } }
    );

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe('Missing requestId');
  });

  it('should return 200 and messages if user is authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'user-id-123', name: 'John' },
    });

    const mockMessages = [
      {
        id: 'msg-1',
        requestId: 'request-id-123',
        senderId: 'user-1',
        text: 'Hi, do you still need help?',
        createdAt: '2025-02-02T13:46:41.683Z',
        sender: { name: 'John' },
      },
    ];

    prisma.message.findMany.mockResolvedValueOnce(mockMessages);

    const response = await GET(
      new Request('http://localhost:3000/api/messages/request-id-123'),
      { params: { requestId: 'request-id-123' } }
    );

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.messages).toEqual([
      {
        id: 'msg-1',
        requestId: 'request-id-123',
        senderId: 'user-1',
        senderName: 'John',
        text: 'Hi, do you still need help?',
        createdAt: '2025-02-02T13:46:41.683Z',
      },
    ]);
  });
});
