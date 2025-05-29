import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import type { AuthUser, SafeUser } from '$lib/types/auth.types';

function toSafeUser(user: AuthUser | null): SafeUser | null {
  if (!user) return null;
  const { id, username, email, roleId } = user;
  return { id, username, email, roleId };
}

export const load: ServerLoad = async ({ locals }: { locals: App.Locals }) => {
  if (!locals.user) {
    throw redirect(302, '/onboarding/login');
  }

  const safeUser = toSafeUser(locals.user);

  return {
    user: safeUser
  };
};