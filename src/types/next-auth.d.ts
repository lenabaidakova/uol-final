// Documentation https://next-auth.js.org/getting-started/typescript

// not an error, we should export next-auth types to app
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    role?: string;
  }

  interface Session {
    user: User & {
      role?: string;
    };
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    role?: string;
  }
}
