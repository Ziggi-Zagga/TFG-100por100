import type {Handle} from '@sveltejs/kit';
import * as authService from '$lib/server/services/auth.service';

const sessionCookieName = 'auth-session';


export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
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
	
		event.locals.user = user;
		event.locals.session = session;
	} else {
		event.cookies.delete('auth-session', { path: '/' });
		event.locals.user = null;
		event.locals.session = null;
	}
	
	return resolve(event);
};
