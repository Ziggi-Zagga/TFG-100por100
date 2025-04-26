import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as authService from '$lib/server/service/auth.service';
import { ServiceError } from '$lib/utils/errors/ServiceError';
import { basicErrorHandler } from '$lib/utils/errors/errors';

export const load: PageServerLoad = async (event: any) => {
	if (event.locals.user) {
		throw redirect(302, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	default: async (event: any) => {
		try {
			const formData = await event.request.formData();
			const email = formData.get('email') as string;
			const username = formData.get('username') as string;
			const password = formData.get('password') as string;
			const confirmPassword = formData.get('confirmPassword') as string;

			const result = await authService.signup(email, username, password, confirmPassword);
			console.log('FormData:', [...formData.entries()]);
			
			if (!result) {
				throw new ServiceError('Error creating user', 'VALIDATION', 400);
			}

			const { session, token } = result;
			event.cookies.set('auth-session', token, {
				path: '/',
				expires: new Date(session.expires_at),
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax'
			});
			console.log('Session created:', session);
			return { success: true };
		} catch (error: any) {
			console.error('Signup error:', error); // 

			return fail(400, { message: error.message || 'Internal server error' });
		}
	}
};