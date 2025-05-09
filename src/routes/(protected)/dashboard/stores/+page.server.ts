import { getStoresTree,createStore } from '$lib/server/services/stores.service';

import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
  const stores = await getStoresTree();
  return { stores };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim();
    const location = formData.get('location')?.toString().trim();
    const description = formData.get('description')?.toString().trim();

    if (!name || !location) {
      return fail(400, { error: 'Name and location are required.' });
    }

    await createStore({ name, location, description });
    return { success: true };
  }
};
