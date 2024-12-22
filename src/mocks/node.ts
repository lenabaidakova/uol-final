import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// initialize msw API mocking server
export const server = setupServer(...handlers);
