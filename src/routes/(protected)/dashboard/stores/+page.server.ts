import { getStores, createStore, deleteStoreById } from '$lib/server/services/stores.service';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const stores = await getStores();
	return { stores };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const location = formData.get('location')?.toString() ?? '';
		const description = formData.get('description')?.toString() ?? '';
		await createStore({ name, location, description });
		throw redirect(303, '/dashboard/stores');
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { message: 'Missing store ID' });

		try {
			await deleteStoreById(id);
			return { success: true };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Failed to delete store' });
		}
	}
};

