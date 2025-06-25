import type { Handle } from '@sveltejs/kit';
import * as authService from '$lib/server/services/auth.service';
import type { SafeUser } from '$lib/types/auth.types';


const PUBLIC_ROUTES: string[] = [
	'/api',
	'/onboarding/login',
	'/onboarding/signup',
	'/onboarding/forgot-password',
	'/onboarding/reset-password',
	'/onboarding/verify-email',
	'/onboarding/verify-email/success',
	'/onboarding/verify-email/error',
	'/onboarding/reset-password/success',
	'/onboarding/reset-password/error',
	'/onboarding/forgot-password/success',
	'/onboarding/forgot-password/error',
	'/onboarding/signup/success',
	'/onboarding/signup/error',
	'/onboarding/login/error',
	'/onboarding/logout',
	'/onboarding/logout/callback',
	'/onboarding/error'
];

const securityHeaders = {
	'X-Frame-Options': 'DENY',
	'X-Content-Type-Options': 'nosniff',
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
	'X-XSS-Protection': '1; mode=block',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
	'Cross-Origin-Embedder-Policy': 'require-corp',
	'Cross-Origin-Opener-Policy': 'same-origin',
	'Cross-Origin-Resource-Policy': 'same-site',
	'Access-Control-Allow-Origin': 'http://localhost:5173',
	'Access-Control-Allow-Credentials': 'true',
	Accept: 'application/json, text/plain, */*'
};

const createRedirectResponse = (url: string) =>
	new Response(null, { status: 302, headers: { location: url } });

const setAuthCookie = (event: any, token: string, expires: Date) => {
	event.cookies.set('auth-session', token, {
		path: '/',
		expires,
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax'
	});
};

const clearAuthCookie = (event: any) => {
	event.cookies.delete('auth-session', {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax'
	});
};

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('auth-session');
	const isPublicRoute = PUBLIC_ROUTES.some((route) => event.url.pathname.startsWith(route));
	const { pathname } = event.url;

	try {
		if (!sessionToken) {
			event.locals = { user: null, session: null };
			if (!isPublicRoute && !pathname.startsWith('/onboarding')) {
				console.log('No session, redirecting to login');
				return createRedirectResponse(`/onboarding/login?redirect=${encodeURIComponent(pathname)}`);
			}
		} else {
			try {
				const result = await authService.validateSession(sessionToken);

				if (result?.session && result?.user) {
					const { session, user } = result;
					setAuthCookie(event, sessionToken, session.expiresAt);
					const { id, username, email, roleId } = user;
					event.locals = {
						user: { id, username, email, roleId } as SafeUser,
						session
					};
					return await addSecurityHeaders(await resolve(event));
				}
			} catch (error) {
				console.error('Session validation error:', error);
			}

			clearAuthCookie(event);
			event.locals = { user: null, session: null };

			if (!isPublicRoute) {
				console.log('Invalid session, redirecting to login');
				return createRedirectResponse(`/onboarding/login?redirect=${encodeURIComponent(pathname)}`);
			}
		}

		return await addSecurityHeaders(await resolve(event));
	} catch (error) {
		console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};

async function addSecurityHeaders(response: Response) {
	Object.entries(securityHeaders).forEach(([key, value]) =>
		response.headers.set(key, value as string)
	);
	return response;
}
