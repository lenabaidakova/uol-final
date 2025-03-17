import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// protect all routes
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // public routes
  const publicPaths = ['/login', '/registration', '/public/:path*', '/docs'];

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

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'], // exclude static assets
};
