import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_EMAIL = 'arifm9991@gmail.com';
const COOKIE_NAME = 'sb-session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // ─── PUBLIC ROUTES (exempt from auth) ───
  const isPublicApi = 
    pathname.startsWith('/api/auth/') ||
    pathname === '/api/track-view' || 
    (pathname === '/api/campaigns' && method === 'GET') ||
    (pathname === '/api/posts' && method === 'GET');

  if (isPublicApi) {
    return NextResponse.next();
  }

  // ─── PROTECTED ROUTES ───
  const isProtected = 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/posts') ||
    pathname.startsWith('/api/analytics') ||
    (pathname.startsWith('/api/campaigns/') && ['PATCH', 'DELETE'].includes(method));

  if (isProtected) {
    const sessionCookie = request.cookies.get(COOKIE_NAME);
    
    if (!sessionCookie?.value) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const session = JSON.parse(sessionCookie.value);
      if (!session?.access_token) throw new Error('No access token');

      // ─── ADMIN EMAIL CHECK ───
      const email = session.user?.email?.trim().toLowerCase();
      if (email !== ADMIN_EMAIL) throw new Error('Not admin');

      // We add a header for downstream use
      const response = NextResponse.next();
      response.headers.set('x-user-id', session.user?.id || '');
      
      // Security Headers
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
      
      return response;
    } catch {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/posts/:path*',
    '/api/campaigns/:path*',
    '/api/analytics/:path*',
    '/api/auth/:path*',
  ],
};
