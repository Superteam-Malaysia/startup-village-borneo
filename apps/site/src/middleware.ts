import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/** Reachable without a session. */
const PUBLIC_PREFIXES = ['/invite/', '/login', '/register', '/forgot-password', '/reset-password'];

const SUPER_ADMIN_PATHS = ['/dashboard/members', '/dashboard/invites'];
const ADMIN_PATHS = [
  '/dashboard/events',
  '/dashboard/partners',
  '/dashboard/content',
  '/dashboard/manage-perks',
  '/dashboard/community',
  '/dashboard/metrics',
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  const { pathname, search } = request.nextUrl;

  if (PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return response;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  // /admin/* is the old prefix; keep the redirect so bookmarks still work.
  if (pathname.startsWith('/admin')) {
    const newPath = pathname.replace(/^\/admin/, '/dashboard');
    return NextResponse.redirect(new URL(newPath || '/dashboard', request.url));
  }

  const signIn = () => {
    const url = new URL('/login', request.url);
    url.searchParams.set('next', pathname + search);
    return NextResponse.redirect(url);
  };

  if (pathname === '/pending') {
    if (!user) return signIn();
    return response;
  }

  if (pathname.startsWith('/dashboard') || pathname === '/onboarding') {
    // Previously this fell through to a client-side check, so protected pages
    // rendered briefly before redirecting.
    if (!user) return signIn();

    // app_metadata is the trustworthy copy -- it's signed into the JWT, unlike
    // profiles.user_role, which is only a mirror for the UI.
    const userRole = (user.app_metadata?.user_role as string) || 'member';

    if (user.app_metadata?.deactivated === true) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/dashboard')) {
      if (SUPER_ADMIN_PATHS.some((p) => pathname.startsWith(p)) && userRole !== 'super_admin') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      if (
        ADMIN_PATHS.some((p) => pathname.startsWith(p)) &&
        userRole !== 'super_admin' &&
        userRole !== 'admin'
      ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/onboarding',
    '/pending',
    '/invite/:path*',
    '/login',
    '/register',
  ],
};
