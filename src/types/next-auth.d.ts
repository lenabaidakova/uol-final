// Documentation https://next-auth.js.org/getting-started/typescript
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
