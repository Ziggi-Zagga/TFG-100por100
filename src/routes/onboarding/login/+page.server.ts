import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as authService from '$lib/server/services/auth.service';
import { ServiceError } from '$lib/utils/errors/ServiceError';
import { storeError, getStoredError } from '$lib/stores/error.store';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		throw redirect(302, '/dashboard');
	}

	const error = getStoredError();

	return { error };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const identifier = formData.get('identifier') as string;
		const password = formData.get('password') as string;
		const ip = event.getClientAddress?.() ?? 'unknown';
		const userAgent = event.request.headers.get('user-agent') ?? 'unknown';

		try {
			const result = await authService.login(identifier, password, ip, userAgent);

			if (!result) {
				return fail(400, {
					success: false,
					error: {
						message: 'Invalid credentials',
						field: 'identifier'
					}
				});
			}

			const { session, token } = result;
			const expires = new Date(session.expiresAt);

			// Set the auth cookie
			event.cookies.set('auth-session', token, {
				path: '/',
				expires: expires,
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax'
			});

			// Return success response with redirect
			return {
				success: true,
				redirect: '/dashboard',
				error: null
			};
		} catch (error: any) {
			console.error('Login error:', error);

			let message = 'An unexpected error occurred';
			let field = '';

			if (error instanceof ServiceError) {
				message = error.message;
				field = error.field || '';
			}

			return fail(400, {
				success: false,
				error: { message, field },
				redirect: null
			});
		}
	}
};
