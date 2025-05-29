import type { Handle } from '@sveltejs/kit';
import * as authService from '$lib/server/services/auth.service';
import { redirect } from '@sveltejs/kit';
import type { SafeUser } from '$lib/types/auth.types';

const sessionCookieName = 'auth-session';

const CORS_ORIGIN = 'http://localhost:5173'; 
const ALLOWED_FILE_TYPES = 'image/*, application/pdf';

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': `default-src 'self'; img-src 'self' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';`
};

export const handle: Handle = async ({ event, resolve }) => {
  // Manejar CORS preflight
  if (event.request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': CORS_ORIGIN,
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }

  // Handle session
  const sessionToken = event.cookies.get(sessionCookieName);
  
  try {
    if (!sessionToken) {
      event.locals.user = null;
      event.locals.session = null;
      const response = await resolve(event);
      addSecurityHeaders(response);
      response.headers.set('Access-Control-Allow-Origin', CORS_ORIGIN);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Accept', ALLOWED_FILE_TYPES);
      return response;
    }

    const { session, user } = await authService.validateSession(sessionToken);
    
    if (session && user) {
      event.cookies.set('auth-session', sessionToken, {
        path: '/',
        expires: session.expiresAt,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      // Convertir a SafeUser antes de asignar a event.locals
      const { id, username, email, roleId } = user;
      event.locals.user = { id, username, email, roleId } as SafeUser;
      event.locals.session = session;

    
      if (event.url.pathname.startsWith('/dashboard/users')) {
        if (roleId !== '1') { 
          throw redirect(302, '/dashboard?error=unauthorized');
        }
      }
    } else {
      event.cookies.delete('auth-session', { path: '/' });
      event.locals.user = null;
      event.locals.session = null;
    }

    const response = await resolve(event);
    addSecurityHeaders(response);
    response.headers.set('Access-Control-Allow-Origin', CORS_ORIGIN);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Accept', ALLOWED_FILE_TYPES);
    return response;

  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return new Response('Internal Server Error', { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Helper function to add security headers to the response
function addSecurityHeaders(response: Response) {
  Object.entries(securityHeaders).forEach(([header, value]) => {
    response.headers.set(header, value);
  });
}