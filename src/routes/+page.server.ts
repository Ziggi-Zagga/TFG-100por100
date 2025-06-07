import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  // Si el usuario ya está autenticado, redirigir al dashboard
  if (locals.user) {
    // Si venimos de un redirect, ir a la ruta original
    const redirectTo = url.searchParams.get('redirect');
    if (redirectTo) {
      throw redirect(302, redirectTo);
    }
    throw redirect(302, '/dashboard');
  }
  
  // Si no está autenticado, redirigir al login
  throw redirect(302, '/onboarding/login');
};
