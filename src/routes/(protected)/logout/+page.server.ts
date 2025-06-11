import { redirect, type Cookies } from '@sveltejs/kit';

export const actions = {
	default: async ({ cookies }: { cookies: Cookies }) => {
		cookies.delete('auth-session', { path: '/' });
		console.log('[LOGOUT] Session deleted');
		throw redirect(302, '/onboarding/login');
	}
};
