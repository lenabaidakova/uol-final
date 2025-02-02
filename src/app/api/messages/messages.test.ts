import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/messages/route';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

vi.mock('@/lib/prisma', () => ({
  default: {
    message: {
      create: vi.fn(),
    },
  },
}));

vi.mock('next-auth', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    getServerSession: vi.fn(),
  };
});

describe('/api/messages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if the user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce(null);

    const response = await POST(
      new Request('http://localhost:3000/api/messages', {
        method: 'POST',
        body: JSON.stringify({ requestId: 'request-id-123', text: 'Hello!' }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.message).toBe('Unauthorized');
  });

  it('should return 400 if requestId or text is missing', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'user-id-123' },
    });

    const response = await POST(
      new Request('http://localhost:3000/api/messages', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.message).toBe('Missing required fields');
  });

  it('should return 201 if message is successfully stored', async () => {
    vi.mocked(getServerSession).mockResolvedValueOnce({
      user: { id: 'user-id-123' },
    });

    const mockMessage = {
      id: 'msg-123',
      requestId: 'request-id-123',
      senderId: 'user-id-123',
      text: 'Hi, this is a test message',
      createdAt: '2025-02-02T13:37:25.827Z',
    };

    prisma.message.create.mockResolvedValueOnce(mockMessage);

    const response = await POST(
      new Request('http://localhost:3000/api/messages', {
        method: 'POST',
        body: JSON.stringify({
          requestId: 'request-id-123',
          text: 'Hi, this is a test message',
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    );

    const body = await response.json();
    expect(response.status).toBe(201);
    expect(body.message).toBe('Message sent');
    expect(body.data).toEqual(mockMessage);
  });
});
