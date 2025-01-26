import { describe, it, expect, vi } from 'vitest';
import { GET } from './route';
import prisma from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  default: {
    request: {
      groupBy: vi.fn(),
    },
  },
}));

describe('/api/requests/locations', () => {
  it('should return a list of locations', async () => {
    const mockLocations = [
      { location: 'Madrid' },
      { location: 'Manchester' },
      { location: 'London' },
    ];

    prisma.request.groupBy.mockResolvedValueOnce(mockLocations);

    const response = await GET(
      new Request('http://localhost:3000/api/requests/locations')
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.locations).toEqual(['Madrid', 'Manchester', 'London']);
  });

  it('should return an empty list if no locations are found', async () => {
    prisma.request.groupBy.mockResolvedValueOnce([]);

    const response = await GET(
      new Request('http://localhost:3000/api/requests/locations')
    );

    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.locations).toEqual([]);
  });
});
