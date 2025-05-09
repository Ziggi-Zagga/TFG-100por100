import { getStoreWithSections, createSection } from '$lib/server/services/stores.service';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const storeId = Number(params.storeId);
  const { store, sections } = await getStoreWithSections(storeId);
  return { store, sections };
};

export const actions: Actions = {
  createSection: async ({ request, params }) => {
    const storeId = Number(params.storeId);
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim();
    const description = formData.get('description')?.toString().trim();

    if (!name) {
      return fail(400, { error: 'Name is required.' });
    }

    await createSection({ storeId, name, description });
    return { success: true };
  }
};
