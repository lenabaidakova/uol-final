import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// protect all routes
export async function middleware(request: Request) {
  const token = await getToken({ req: request });

  // public routes
  const publicPaths = ['/login', '/register', '/about', '/public/:path*'];

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
