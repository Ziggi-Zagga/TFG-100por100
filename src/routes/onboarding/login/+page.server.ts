import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { sha256 } from '$lib/utils/crypto/hash';
import { eq } from 'drizzle-orm';
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

    const user = await db.select().from(users).where(eq(users.email, email)).then(r => r[0]);

    if (!user || user.password !== hashedPassword) {
      return fail(401, { message: 'Invalid credentials' });
    }

    // TODO: Auth session/cookie
    throw redirect(303, '/dashboard');
  }
};
