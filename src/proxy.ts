import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 1. PUBLIC ROUTES (Exempt from Auth)
  const isPublicApi = 
    pathname === '/api/auth/login' || 
    pathname === '/api/track-view' || 
    (pathname === '/api/campaigns' && method === 'GET') ||
    (pathname === '/api/posts' && method === 'GET');

  if (isPublicApi) {
    return NextResponse.next();
  }

  // 2. PROTECTED ROUTES
  const isProtected = 
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/posts') ||
    pathname.startsWith('/api/analytics') ||
    (pathname.startsWith('/api/campaigns/') && ['PATCH', 'DELETE'].includes(method));

  if (isProtected) {
    const sessionCookie = request.cookies.get('sb-session');
    
    if (!sessionCookie?.value) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const session = JSON.parse(sessionCookie.value);
      if (!session?.access_token) throw new Error();

      // We add a header for downstream use
      const response = NextResponse.next();
      response.headers.set('x-user-id', session.user?.id || '');
      
      // Add Security Headers (Section 7.2)
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
  ],
};
