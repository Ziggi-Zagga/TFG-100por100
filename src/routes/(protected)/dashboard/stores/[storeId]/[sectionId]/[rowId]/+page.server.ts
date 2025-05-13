import type { PageServerLoad, Actions } from './$types';
import {
  getRowWithGaps,
  getSectionWithRows,
  getStoreWithSections,
  createGap,
  deleteGapById
} from '$lib/server/services/stores.service';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const rowId = params.rowId as string;
  const sectionId = params.sectionId as string;
  const storeId = params.storeId as string;

  if (!rowId || !sectionId || !storeId) throw error(400, 'Missing required IDs');

  const { row, gaps } = await getRowWithGaps(rowId);
  if (!row) throw error(404, 'Row not found');

  const { section } = await getSectionWithRows(sectionId);
  if (!section) throw error(404, 'Section not found');

  const { store } = await getStoreWithSections(storeId);
  if (!store) throw error(404, 'Store not found');

  return {
    store,
    section,
    row,
    gaps
  };
};

export const actions: Actions = {
  create: async ({ request, params }) => {
    const rowId = params.rowId;
    const sectionId = params.sectionId;
    const storeId = params.storeId;

    if (!rowId || !sectionId || !storeId) return fail(400, { error: 'Missing IDs' });

    const formData = await request.formData();
    const name = formData.get('name')?.toString() ?? '';
    const notes = formData.get('notes')?.toString() ?? '';
    const capacity = Number(formData.get('capacity')) || 0;

    try {
      await createGap({ rowId, name, notes, capacity });
      throw redirect(303, `/dashboard/stores/${storeId}/${sectionId}/${rowId}`);
    } catch (err) {
      console.error('Create gap failed:', err);
      return fail(500, { error: 'Failed to create gap' });
    }
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    if (!id) return fail(400, { error: 'Missing gap ID' });

    try {
      await deleteGapById(id);
      return { success: true };
    } catch (err) {
      console.error('Delete gap failed:', err);
      return fail(500, { error: 'Failed to delete gap' });
    }
  }
};
