import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user) {
    const redirectTo = url.searchParams.get('redirect');
    if (redirectTo) {
      throw redirect(302, redirectTo);
    }
    throw redirect(302, '/dashboard');
  }
  
  throw redirect(302, '/onboarding/login');
};
