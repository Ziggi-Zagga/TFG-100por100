import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { roles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function load() {
  const result = await db
    .select({
      id: users.id,
      username: users.username,
      fullName: users.full_name,
      email: users.email,
      lastLogin: users.last_login,
      role: roles.name,
    })
    .from(users)
    .innerJoin(roles, eq(users.rol, roles.id))
    .where(eq(users.active, true));

  return { users: result };
}