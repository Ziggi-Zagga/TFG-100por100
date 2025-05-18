import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import type { AuthUser } from '$lib/types/auth.types';

export const load: ServerLoad = async ({ locals }: { locals: App.Locals }) => {


	if (!locals.user) {
		throw redirect(302, '/onboarding/login');
	}

	return {
		user: locals.user
	};
};

