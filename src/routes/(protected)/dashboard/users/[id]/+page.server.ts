import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getOrdersByUser } from '$lib/server/services/orders.service';
import { getInventoryHistoryByUserId } from '$lib/server/services/inventoryHistory.service';

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;

  const user = await db.query.users.findFirst({
    where: eq(users.id, id)
  });
  if (!user) throw fail(404, { message: 'User not found' });

  const roles = await db.query.roles.findMany();
  const orders = await getOrdersByUser(id);
  const inventoryHistory = await getInventoryHistoryByUserId(id);

  return {
    user,
    roles,
    orders,
    inventoryHistory
  };
};

export const actions: Actions = {
  update: async ({ request }) => {
    const formData = await request.formData();
    
    const id = formData.get('id')?.toString() ?? '';
    const username = formData.get('username')?.toString() ?? '';
    const email = formData.get('email')?.toString() ?? '';
    const role = formData.get('role')?.toString() ?? '';

    await db.update(users)
      .set({
        username,
        email,
        roleId: role,
      })
      .where(eq(users.id, id));

    return { success: true };
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id')?.toString() ?? '';

    await db.delete(users)
      .where(eq(users.id, id));

    return { success: true };
  }
};