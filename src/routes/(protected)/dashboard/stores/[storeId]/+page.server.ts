import type { PageServerLoad, Actions } from './$types';
import { json, error } from '@sveltejs/kit';
import { getStoreWithSections, createSection } from '$lib/server/services/stores.service';
import { basicErrorHandler } from '$lib/utils/errors/errors';

export const load: PageServerLoad = async ({ params }) => {
	const storeId = params.id;

	if (!storeId) throw error(400, 'Missing store ID');

	const { store, sections } = await getStoreWithSections(storeId);

	if (!store) throw error(404, 'Store not found');

	return { store, sections };
};

export const actions: Actions = {
	create: async ({ request }) => {
		try {
			const formData = await request.formData();
			const storeId = formData.get('storeId')?.toString();
			const name = formData.get('name')?.toString();
			const description = formData.get('description')?.toString() ?? '';

			if (!storeId || !name) {
				return json({ success: false, message: 'Missing fields' }, { status: 400 });
			}

			const { id } = await createSection({ storeId, name, description });
			return json({ success: true, id, name, description });
		} catch (err) {
			return basicErrorHandler(err as Error);
		}
	}
};
