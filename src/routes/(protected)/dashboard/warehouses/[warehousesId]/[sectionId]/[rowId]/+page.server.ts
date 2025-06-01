import type { PageServerLoad, Actions } from './$types';
import {
  getRowWithGaps,
  getSectionWithRows,
  getwarehouseWithSections,
  createGap,
  deleteGapById
} from '$lib/server/services/warehouse.service';
import { error, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const warehousesId = params.warehousesId;
  const sectionId = params.sectionId;
  const rowId = params.rowId;

  if (!warehousesId || !sectionId || !rowId) {
    throw error(400, 'Missing warehouse, section, or row ID');
  }

  const { row, gaps } = await getRowWithGaps(rowId);
  if (!row) throw error(404, 'Row not found');

  const { section } = await getSectionWithRows(sectionId);
  if (!section) throw error(404, 'Section not found');

  const { warehouse } = await getwarehouseWithSections(warehousesId);
  if (!warehouse) throw error(404, 'warehouse not found');

  return {
    warehouse,
    section,
    row,
    gaps
  };
};

export const actions: Actions = {
  create: async ({ request, params }) => {
    const warehousesId = params.warehousesId;
    const sectionId = params.sectionId;
    const rowId = params.rowId;

    if (!warehousesId || !sectionId || !rowId) {
      return fail(400, { error: 'Missing warehouse, section, or row ID' });
    }

    const formData = await request.formData();
    const name = formData.get('name')?.toString() ?? '';
    const notes = formData.get('notes')?.toString() ?? '';
    const capacity = Number(formData.get('capacity')) || 0;

    try {
      await createGap({ rowId, name, notes, capacity });
      throw redirect(303, `/dashboard/warehouses/${warehousesId}/${sectionId}/${rowId}`);
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
