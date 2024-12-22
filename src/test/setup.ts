// msw API mocking setup
import { server } from '@/mocks/node';
import { beforeAll, afterAll, afterEach } from 'vitest';

// start server
beforeAll(() => server.listen());

// reset handlers after each test
afterEach(() => server.resetHandlers());

// stop server
afterAll(() => server.close());
