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
    expect(body.message).toBe('Email, password, and role are required fields');
  });

  it('should return 400 for an invalid role', async () => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123',
        role: 'INVALID_ROLE',
      }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe('Role should be supporter or shelter');
  });

  it('should return 400 if email is already registered', async () => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'existing@example.com',
        password: 'password123',
        role: 'SUPPORTER',
      }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.message).toBe('Email is already registered');
  });

  it('should return 201 if registration is successful', async () => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'newuser@example.com',
        password: 'password123',
        role: 'SUPPORTER',
      }),
    });

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.message).toBe(
      'Registration successful. Please check your email to confirm your account.'
    );
  });
});
