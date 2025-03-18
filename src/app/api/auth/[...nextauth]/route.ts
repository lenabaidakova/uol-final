import NextAuth, { AuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { JWT } from 'next-auth/jwt';
import { ROLES } from '@/constants/Role';

// prisma doesn't generate relations types by default, need to use Prisma utils
// https://github.com/prisma/prisma/discussions/10928
// https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types
type UserWithRole = Prisma.UserGetPayload<{
  include: { role: true };
}>;

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
          where: { email },
          include: { role: true },
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        if (!user.verified) {
          throw new Error('Email not verified. Please check your inbox.');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role?.name || 'SUPPORTER',
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }

      const updatedUser = (await prisma.user.findUnique({
        where: { id: token.id as string },
        include: { role: true },
      })) as UserWithRole | null;

      // update token info if user updated name
      if (updatedUser && updatedUser.name) {
        if (token.name !== updatedUser.name) {
          token.name = updatedUser.name;
        }
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = String(token.id ?? '');
        session.user.name = token.name ?? '';
        session.user.email = token.email ?? '';
        session.user.role = String(token.role ?? ROLES.SUPPORTER);
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
