import { describe, it, expect, vi } from 'vitest';
import { GET } from '@/app/api/requests/list/route';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
    default: {
        request: {
            findMany: vi.fn(),
            count: vi.fn(),
        },
    },
}));

describe('/api/requests/list', () => {
    it('should return 400 if page or limit is invalid', async () => {
        const response = await GET(
            new Request('http://localhost:3000/api/requests/list?page=-1&limit=0')
        );

        const body = await response.json();
        expect(response.status).toBe(400);
        expect(body.message).toBe('Must be positive integers');
    });

    it('should return paginated requests with default values (page=1, limit=10)', async () => {
        const mockRequests = Array.from({ length: 10 }, (_, i) => ({
            id: `request-id-${i}`,
            title: `Request title ${i}`,
            type: 'SUPPLIES',
            urgency: 'HIGH',
            dueDate: null,
            details: `Request details ${i}`,
            location: 'Test location',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));

        prisma.request.findMany.mockResolvedValueOnce(mockRequests);
        prisma.request.count.mockResolvedValueOnce(25);

        const response = await GET(
            new Request('http://localhost:3000/api/requests/list')
        );

        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.requests).toHaveLength(10);
        expect(body.pagination).toEqual({
            currentPage: 1,
            limit: 10,
            totalRequests: 25,
            totalPages: 3,
        });
    });

    it('should return the correct page of requests', async () => {
        const mockRequests = Array.from({ length: 5 }, (_, i) => ({
            id: `request-id-${i + 10}`,
            title: `Request tile ${i + 10}`,
            type: 'SUPPLIES',
            urgency: 'MEDIUM',
            dueDate: null,
            details: `Request details ${i + 10}`,
            location: 'Test location',
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }));

        prisma.request.findMany.mockResolvedValueOnce(mockRequests);
        prisma.request.count.mockResolvedValueOnce(25);

        const response = await GET(
            new Request('http://localhost:3000/api/requests/list?page=2&limit=5')
        );

        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body.requests).toHaveLength(5);
        expect(body.pagination).toEqual({
            currentPage: 2,
            limit: 5,
            totalRequests: 25,
            totalPages: 5,
        });
    });
});
