import { redirect, isRedirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import * as authService from '$lib/server/services/auth.service';
import { ServiceError } from '$lib/utils/errors/ServiceError';
import { storeError, getStoredError } from '$lib/stores/error.store'; 

export const load: PageServerLoad = async (event: any) => {
	if (event.locals.user) {
		throw redirect(302, '/dashboard');
	}
	const error = getStoredError();

	return { error };
};

export const actions: Actions = {
	default: async (event: any) => {
		try {
			const formData = await event.request.formData();
			const email = formData.get('email') as string;
			const username = formData.get('username') as string;
			const password = formData.get('password') as string;
			const confirmPassword = formData.get('confirmPassword') as string;
			const ip = event.getClientAddress?.() ?? event.request.headers.get('x-forwarded-for') ?? 'unknown';
			const userAgent = event.request.headers.get('user-agent') ?? 'unknown';

			const result = await authService.signup(email, username, password, confirmPassword, ip, userAgent, event);
			
			if (!result) {
				throw new ServiceError('Error creating user', 'VALIDATION', 400);
			}

			const { session, token } = result;
			event.cookies.set('auth-session', token, {
				path: '/',
				expires: session.expiresAt,
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax'
			});
		  
			
			return redirect(302, '/dashboard');
		} catch (error: any) {
			let message = 'Unexpected error';
			let type = 'INTERNAL';
			let field = '';

			if (error instanceof ServiceError) {
				message = error.message;
				type = error.type;
				field = error.field ?? '';
			}

			storeError({
				message,
				type,
				field
			});

			throw redirect(302, `/onboarding/signup`);
		}
	}
};