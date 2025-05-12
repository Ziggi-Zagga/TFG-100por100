import {  redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as authService from '$lib/server/services/auth.service';
import { ServiceError } from '$lib/utils/errors/ServiceError';
import { basicErrorHandler } from '$lib/utils/errors/errors';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) { 
		throw redirect(302, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		try {
			const formData = await event.request.formData();
			const email = formData.get('email') as string;
			const password = formData.get('password') as string;
			const result = await authService.login(email, password);
			if (!result) {
				throw new ServiceError('Invalid credentials', 'AUTHENTICATION_ERROR', 400);
			}

			const { session, token } = result;
			event.cookies.set('auth-session', token, {
				path: '/',
				expires: new Date(session.expires_at),
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax'
			});

			throw redirect(302, '/dashboard');
		} catch (error: unknown) {

			if (error && typeof error === 'object' && 'status' in error && error['status'] === 302 && 'location' in error) {
				throw error;
			}
			console.error('LOGIN ERROR:', error); 
			return basicErrorHandler(error as Error);
		}
	}
};
