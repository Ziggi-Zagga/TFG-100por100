import {
    getStoreWithSections,
    getSectionWithRows,
    getRowWithGaps,
    getGapById
  } from '$lib/server/services/stores.service';
  import type { PageServerLoad, Actions } from './$types';
  import { fail } from '@sveltejs/kit';
  
  export const load: PageServerLoad = async ({ params }) => {
    const storeId = Number(params.storeId);
    const sectionId = Number(params.sectionId);
    const rowId = Number(params.rowId);
    const gapId = Number(params.gapId);
  
    const { store } = await getStoreWithSections(storeId);
    const { section } = await getSectionWithRows(sectionId);
    const { row } = await getRowWithGaps(rowId);
    const gap = await getGapById(gapId);
  
    // ⚠ Aquí falta todavía la tabla de objetos en gaps.
    // Por ahora devolveremos un array vacío.
    const objects = []; // Cuando tengas la tabla, haces un query aquí.
  
    return { store, section, row, gap, objects };
  };
  
  export const actions: Actions = {
    createObject: async ({ request }) => {
      const formData = await request.formData();
      const name = formData.get('name')?.toString().trim();
      const type = formData.get('type')?.toString().trim();
      const quantity = formData.get('quantity') ? Number(formData.get('quantity')) : undefined;
  
      if (!name) {
        return fail(400, { error: 'Name is required.' });
      }
  
      // Aquí insertarías el objeto en la base de datos cuando tengas el schema preparado.
      console.log('Crear objeto:', { name, type, quantity });
  
      return { success: true };
    }
  };
  