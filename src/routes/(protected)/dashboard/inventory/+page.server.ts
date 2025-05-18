import { error, json } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	getInventoryData,
	createInventoryEntry,
	deleteInventoryEntry
} from '$lib/server/services/inventory.service';
import { basicErrorHandler } from '$lib/utils/errors/errors';

export const load: PageServerLoad = async () => {
	try {
		const data = await getInventoryData();
		return data;
	} catch (err) {
		console.error('Inventory load error:', err);
		throw error(500, 'Failed to load inventory');
	}
};

export const actions: Actions = {
	create: async ({ request }) => {
		try {
			const { productId, storeGapId, stock } = await request.json();

			await createInventoryEntry({ productId, storeGapId, stock });

			return json({ success: true });
		} catch (err) {
			console.error('Inventory create error:', err);
			return basicErrorHandler(err as Error);
		}
	},
	delete: async ({ request }) => {
		try {
			const { id } = await request.json();

			await deleteInventoryEntry(id);

			return json({ success: true });
		} catch (err) {
			console.error('Inventory delete error:', err);
			return basicErrorHandler(err as Error);
		}
	}
};
