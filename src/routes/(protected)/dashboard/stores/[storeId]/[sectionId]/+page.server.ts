import { getStoreWithSections, getSectionWithRows, createRow } from '$lib/server/services/stores.service';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const storeId = Number(params.storeId);
  const sectionId = Number(params.sectionId);

  // Para el breadcrumb necesitas el store
  const { store } = await getStoreWithSections(storeId);

  // Para el listado necesitas la section y sus rows
  const { section, rows } = await getSectionWithRows(sectionId);

  return { store, section, rows };
};

export const actions: Actions = {
  createRow: async ({ request, params }) => {
    const sectionId = Number(params.sectionId);
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim();

    if (!name) {
      return fail(400, { error: 'Name is required.' });
    }

    await createRow({ sectionId, name });
    return { success: true };
  }
};
