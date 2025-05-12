import type { PageServerLoad, Actions } from './$types';
import { json } from '@sveltejs/kit';
import { getStores, createStore } from '$lib/server/services/stores.service';
import { basicErrorHandler } from '$lib/utils/errors/errors';

export const load: PageServerLoad = async () => {
	const stores = await getStores();
	return { stores };
};

export const actions: Actions = {
	create: async ({ request }) => {
		try {
			const formData = await request.formData();
			const name = formData.get('name')?.toString();
			const location = formData.get('location')?.toString();
			const description = formData.get('description')?.toString() ?? '';

			if (!name || !location) {
				return json({ success: false, message: 'Missing fields' }, { status: 400 });
			}

			const { id } = await createStore({ name, location, description });
			return json({ success: true, id });
		} catch (error) {
			return basicErrorHandler(error as Error);
		}
	}
};
