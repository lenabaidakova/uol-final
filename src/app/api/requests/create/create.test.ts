import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/requests/create/route';

vi.mock('next-auth', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        default: vi.fn(),
        getServerSession: vi.fn()
    };
});

vi.mock('@/lib/prisma', async (importOriginal) => {
    const original = await importOriginal();
    return {
        ...original,
        default: {
            request: {
                create: vi.fn(),
            },
        },
    };
});

import prisma from '@/lib/prisma';

describe('/api/requests/create', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 401 if the user is not authenticated', async () => {
        const { getServerSession } = await import('next-auth');
        vi.mocked(getServerSession).mockResolvedValueOnce(null);

        const response = await POST(
            new Request('http://localhost:3000/api/requests/create', {
                method: 'POST',
                body: JSON.stringify({
                    title: 'Need blankets',
                    type: 'SUPPLIES',
                    urgency: 'HIGH',
                    details: 'We need 100 blankets for the winter season.',
                    location: 'New York',
                }),
                headers: { 'Content-Type': 'application/json' },
            })
        );

        const body = await response.json();

        expect(response.status).toBe(401);
        expect(body.message).toBe('Unauthorized');
    });

    it('should return 403 if the user does not have the SHELTER role', async () => {
        const { getServerSession } = await import('next-auth');
        vi.mocked(getServerSession).mockResolvedValueOnce({
            user: { id: '123', role: 'SUPPORTER' },
        });

        const response = await POST(
            new Request('http://localhost:3000/api/requests/create', {
                method: 'POST',
                body: JSON.stringify({
                    title: 'Need blankets',
                    type: 'SUPPLIES',
                    urgency: 'HIGH',
                    details: 'We need 100 blankets for the winter season.',
                    location: 'New York',
                }),
                headers: { 'Content-Type': 'application/json' },
            })
        );

        const body = await response.json();

        expect(response.status).toBe(403);
        expect(body.message).toBe('Only users with the SHELTER role can create requests');
    });

    it('should return 201 if the request is successfully created', async () => {
        const { getServerSession } = await import('next-auth');
        vi.mocked(getServerSession).mockResolvedValueOnce({
            user: { id: '123', role: 'SHELTER' },
        });

        vi.mocked(prisma.request.create).mockResolvedValueOnce({
            id: 'request-id-123',
            title: 'Need blankets',
            type: 'SUPPLIES',
            urgency: 'HIGH',
            dueDate: new Date('2025-02-01'),
            details: 'We need 100 blankets for the winter season.',
            location: 'New York',
            creatorId: '123',
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const response = await POST(
            new Request('http://localhost:3000/api/requests/create', {
                method: 'POST',
                body: JSON.stringify({
                    title: 'Need blankets',
                    type: 'SUPPLIES',
                    urgency: 'HIGH',
                    dueDate: '2025-02-01',
                    details: 'We need 100 blankets for the winter season.',
                    location: 'New York',
                }),
                headers: { 'Content-Type': 'application/json' },
            })
        );

        const body = await response.json();

        expect(response.status).toBe(201);
        expect(body.message).toBe('Request created successfully');
        expect(body.request).toHaveProperty('id');
        expect(body.request.title).toBe('Need blankets');
        expect(body.request.type).toBe('SUPPLIES');
        expect(body.request.urgency).toBe('HIGH');
        expect(body.request.details).toBe('We need 100 blankets for the winter season.');
        expect(body.request.location).toBe('New York');
        expect(body.request.creatorId).toBe('123');
    });
});
