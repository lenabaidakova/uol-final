import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ROLES } from '@/constants/Role';

// protect all routes
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // public routes
  const publicPaths = [
    '/login',
    '/registration',
    '/registration/confirmation',
    '/public/:path*',
    '/docs',
  ];

  // routes restricted for supporter
  const restrictedPathsForSupporters = [
    '/request/create',
    /^\/request\/[^/]+\/edit$/,
  ];

  // https://github.com/nextauthjs/next-auth/issues/8578
  if (
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/api/docs')
  ) {
    return NextResponse.next();
  }

  const escapedPaths = publicPaths.map((path) =>
    path.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/:\w+/g, '.*')
  );

  const isPublicPath = escapedPaths.some((path) =>
    new RegExp(`^${path}$`).test(request.nextUrl.pathname)
  );

  // redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // redirect to home if supporter doesn't have access to page
  if (token?.role === ROLES.SUPPORTER) {
    const isRestrictedPath = restrictedPathsForSupporters.some((path) =>
      typeof path === 'string'
        ? request.nextUrl.pathname === path
        : path.test(request.nextUrl.pathname)
    );

    if (isRestrictedPath) {
      return NextResponse.redirect(new URL('/', request.url)); // redirect to home
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'], // exclude static assets
};
