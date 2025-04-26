import { fail, redirect } from '@sveltejs/kit';
import { sha256 } from '$lib/utils/crypto/hash';
import { validateUser } from '$lib/server/service/login.service';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    if (!email || !password) {
      return fail(400, { message: 'Email and password required' });
    }

    const hashedPassword = await sha256(password);

    const user = await validateUser(email, hashedPassword);

    if (!user || user.password !== hashedPassword) {
      return fail(401, { message: 'Invalid credentials' });
    }

    // TODO: Auth session/cookie
    throw redirect(303, '/dashboard');
  }
};
