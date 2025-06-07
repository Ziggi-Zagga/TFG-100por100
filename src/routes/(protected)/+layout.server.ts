import type { ServerLoad } from '@sveltejs/kit';
import type { AuthUser, SafeUser } from '$lib/types/auth.types';

function toSafeUser(user: AuthUser): SafeUser {
  const { id, username, email, roleId } = user;
  return { id, username, email, roleId };
}

export const load: ServerLoad = async ({ locals }) => {
  return {
    user: toSafeUser(locals.user!)
  };
};