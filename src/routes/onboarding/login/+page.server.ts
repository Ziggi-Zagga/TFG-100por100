import type { Actions, PageServerLoad } from './$types';
import * as authService from '$lib/server/services/auth.service';
import { redirect } from '@sveltejs/kit';
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
			const { session, token } = result;
			event.cookies.set('auth-session', token, {
				path: '/',
				expires: new Date(session.expiresAt),
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax'
			});
			throw redirect(302, '/dashboard');
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

			throw redirect(302, `/onboarding/login`);
		}
	}
};
