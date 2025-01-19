import { describe, it, expect, vi } from 'vitest';
import { PATCH } from '@/app/api/requests/archive/route';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
    default: {
        request: {
            update: vi.fn(),
        },
    },
}));

describe('/api/requests/archive', () => {
    it('should return 400 if request ID is missing', async () => {
        const response = await PATCH(
            new Request('http://localhost:3000/api/requests/archive', {
                method: 'PATCH',
                body: JSON.stringify({}),
                headers: { 'Content-Type': 'application/json' },
            })
        );

        const body = await response.json();
        expect(response.status).toBe(400);
        expect(body.message).toBe('Request ID is required');
    });

    it('should return 404 if the request is not found', async () => {
        prisma.request.update.mockRejectedValueOnce({
            code: 'P2025',
        });

        const response = await PATCH(
            new Request('http://localhost:3000/api/requests/archive', {
                method: 'PATCH',
                body: JSON.stringify({ id: 'nonexistent-id' }),
                headers: { 'Content-Type': 'application/json' },
            })
        );

        const body = await response.json();
        expect(response.status).toBe(404);
        expect(body.message).toBe('Request not found');
    });

    it('should return 200 if the request is successfully archived', async () => {
        const mockRequest = {
            id: 'existing-id',
            title: 'Need Blankets',
            type: 'SUPPLIES',
            urgency: 'HIGH',
            dueDate: '2025-02-01T00:00:00.000Z',
            details: 'We need blankets for winter.',
            location: 'New York',
            status: 'ARCHIVED',
            createdAt: '2025-01-19T12:34:56.000Z',
            updatedAt: '2025-01-19T13:00:00.000Z',
        };

        prisma.request.update.mockResolvedValueOnce(mockRequest);

        const response = await PATCH(
            new Request('http://localhost:3000/api/requests/archive', {
                method: 'PATCH',
                body: JSON.stringify({ id: 'existing-id' }),
                headers: { 'Content-Type': 'application/json' },
            })
        );

        const body = await response.json();
        expect(response.status).toBe(200);
        expect(body.message).toBe('Request archived successfully');
        expect(body.request).toEqual(mockRequest);
    });
});
