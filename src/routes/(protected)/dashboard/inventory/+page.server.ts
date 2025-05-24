import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getInventoryData, createInventoryEntry, deleteInventoryEntry } from '$lib/server/services/inventory.service';
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
			console.log('LLEGÓ A CREATE');
			const formData = await request.formData();
			const productId = formData.get('productId')?.toString() ?? "";
			const storeGapId = formData.get('storeGapId')?.toString() ?? "";
			const stock = Number(formData.get('stock'));
			const minQuantity = Number(formData.get('minQuantity'));
			const reorderQuantity = Number(formData.get('reorderQuantity'));

			console.log("productId: ", productId, "storeGapId: ", storeGapId, "stock: ", stock, "minQuantity: ", minQuantity, "reorderQuantity: ", reorderQuantity);

			await createInventoryEntry({ productId, storeGapId, stock, minQuantity, reorderQuantity });

			return redirect(303, '/dashboard/inventory');
		} catch (err) {
			console.error('Inventory create error:', err);
			return basicErrorHandler(err as Error);
		}
	},

	delete: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id')?.toString() ?? "";
			console.log('[DELETE] Recibido ID:', id);

			await deleteInventoryEntry(id);

			return redirect(303, '/dashboard/inventory');
		} catch (err) {
			console.error('Inventory delete error:', err);
			return basicErrorHandler(err as Error);
		}
	}
};
