import type { PageServerLoad, Actions } from './$types';
import {
	getSectionWithRows,
	getStoreWithSections,
	createRow,
	deleteRowById
} from '$lib/server/services/stores.service';
import { error, redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const sectionId = params.sectionId;
	const storeId = params.storeId;

	if (!sectionId || !storeId) throw error(400, 'Missing store or section ID');

	const { section, rows } = await getSectionWithRows(sectionId);
	if (!section) throw error(404, 'Section not found');

	const { store } = await getStoreWithSections(storeId);
	if (!store) throw error(404, 'Store not found');

	return {
		store,
		section,
		rows
	};
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		const sectionId = params.sectionId;
		const storeId = params.storeId;

		if (!sectionId || !storeId) return fail(400, { error: 'Missing store or section ID' });

		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';

		try {
			await createRow({ sectionId, name });
			throw redirect(303, `/dashboard/stores/${storeId}/${sectionId}`);
		} catch (err) {
			console.error('Create row failed:', err);
			return fail(500, { error: 'Failed to create row' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'Missing row ID' });

		try {
			await deleteRowById(id);
			return { success: true };
		} catch (err) {
			console.error('Delete row failed:', err);
			return fail(500, { error: 'Failed to delete row' });
		}
	}
};
