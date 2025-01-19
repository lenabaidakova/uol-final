import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/requests/create/route';

describe('/api/requests/create', () => {
    it('should return 400 if required fields are missing', async () => {
        const response = await POST(
            new Request('http://localhost:3000/api/requests/create', {
                method: 'POST',
                body: JSON.stringify({}),
                headers: { 'Content-Type': 'application/json' },
            })
        );

        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.message).toBe('All fields are required except dueDate');
    });

    it('should return 400 if an invalid urgency is provided', async () => {
        const response = await POST(
            new Request('http://localhost:3000/api/requests/create', {
                method: 'POST',
                body: JSON.stringify({
                    title: 'Need Blankets',
                    type: 'SUPPLIES',
                    urgency: 'URGENT',
                    details: 'We need blankets.',
                    location: 'New York',
                }),
                headers: { 'Content-Type': 'application/json' },
            })
        );

        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body.message).toBe('Invalid urgency level. Must be one of: HIGH, MEDIUM, LOW');
    });


    it('should return 201 if the request is successfully created', async () => {
        const response = await POST(
            new Request('http://localhost:3000/api/requests/create', {
                method: 'POST',
                body: JSON.stringify({
                    title: 'Need Blankets',
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
        expect(body.request.title).toBe('Need Blankets');
        expect(body.request.type).toBe('SUPPLIES');
        expect(body.request.urgency).toBe('HIGH');
        expect(body.request.details).toBe('We need 100 blankets for the winter season.');
    });
});
