import { getStoreWithSections, getSectionWithRows, getRowWithGaps, createGap } from '$lib/server/services/stores.service';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const storeId = Number(params.storeId);
  const sectionId = Number(params.sectionId);
  const rowId = Number(params.rowId);

  const { store } = await getStoreWithSections(storeId);
  const { section } = await getSectionWithRows(sectionId);
  const { row, gaps } = await getRowWithGaps(rowId);

  return { store, section, row, gaps };
};

export const actions: Actions = {
  createGap: async ({ request, params }) => {
    const rowId = Number(params.rowId);
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim();
    const capacity = formData.get('capacity') ? Number(formData.get('capacity')) : undefined;
    const notes = formData.get('notes')?.toString().trim();

    if (!name) {
      return fail(400, { error: 'Name is required.' });
    }

    await createGap({ rowId, name, capacity, notes });
    return { success: true };
  }
};
