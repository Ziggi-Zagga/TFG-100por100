import {
	getStoreWithSections,
	createSection,
	deleteSectionById
} from '$lib/server/services/stores.service';
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const storeId = params.storeId;
	if (!storeId) throw fail(400, { message: 'Missing store ID' });

	const data = await getStoreWithSections(storeId);
	if (!data.store) throw fail(404, { message: 'Store not found' });

	return {
		store: data.store,
		sections: data.sections
	};
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		const storeId = params.storeId;
		if (!storeId) return fail(400, { message: 'Missing store ID' });

		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const description = formData.get('description')?.toString() ?? '';

		try {
			await createSection({ storeId, name, description });
			throw redirect(303, `/dashboard/stores/${storeId}`);
		} catch (error) {
			console.error('Create section failed:', error);
			return fail(500, { message: 'Failed to create section' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) return fail(400, { message: 'Missing section ID' });

		try {
			await deleteSectionById(id);
			return { success: true };
		} catch (error) {
			console.error('Delete section failed:', error);
			return fail(500, { message: 'Failed to delete section' });
		}
	}
};
