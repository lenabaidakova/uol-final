import { describe, it, expect } from 'vitest';

describe('/api/register', () => {
  it('should return 400 if fields are missing', async () => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe(
      'Username, password and role are required fields'
    );
  });

  it('should return 400 for an invalid role', async () => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
        role: 'INVALID_ROLE',
      }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe('Role should be supporter or shelter');
  });

  it('should return 201 if registration is successful', async () => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
        role: 'SUPPORTER',
      }),
    });

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.message).toBe('User registered successfully');
    expect(body.user).toEqual({
      id: '1',
      username: 'testuser',
      role: 'SUPPORTER',
    });
  });
});
