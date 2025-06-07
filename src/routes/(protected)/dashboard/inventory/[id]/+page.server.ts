import * as inv from '$lib/server/services/inventory.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getwarehouseTree } from '$lib/server/services/warehouse.service';
import type { InventoryItem } from '$lib/types/inventory.types';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.id;
	if (!id) throw fail(400, { message: 'Missing inventory ID' });

	const inventory = await inv.getInventoryById(id);
	if (!inventory) throw fail(404, { message: 'Inventory not found' });

	const product = await inv.getProductById(inventory.productId);
	const location = await inv.getTreeFromGapId(inventory.warehouseGapId);
	const fullwarehouseTree = await getwarehouseTree();
	const history = await inv.getInventoryHistoryByInventoryId(id);

	return {
		inventory,
		product,
		location,
		fullwarehouseTree,
		history
	};
};

export const actions: Actions = {
	update: async ({ request, locals }) => {
		const formData = await request.formData();

		const id = formData.get('id')?.toString();
		const stock = Number(formData.get('quantity') ?? 0);
		const minQuantity = Number(formData.get('minQuantity') ?? 0);
		const reorderQuantity = Number(formData.get('reorderQuantity') ?? 0);
		const warehouseGapId = formData.get('gapId')?.toString() ?? '';
		const lastStock = Number(formData.get('lastStock') ?? 0);
		const notes = formData.get('notes')?.toString() ?? '';
		const lastwarehouseGapId = formData.get('lastwarehouseGapId')?.toString() ?? '';
		const productId = formData.get('productId')?.toString() ?? '';

		if (!id) return fail(400, { message: 'Missing inventory ID' });

		try {
			await inv.updateInventoryEntry({
				id,
				stock,
				minQuantity,
				reorderQuantity,
				warehouseGapId,
				lastCount: new Date(),
				updatedAt: new Date()
			});

			await inv.createInventoryHistoryEntry({
				id: crypto.randomUUID(),
				productId,
				inventoryId: id,
				fromGapId: lastwarehouseGapId,
				toGapId: warehouseGapId,
				previousQuantity: lastStock,
				newQuantity: stock,
				quantityChanged: stock - lastStock,
				userId: locals.user?.id,
				notes,
				createdAt: new Date()
			});

			return redirect(303, `/dashboard/inventory/${id}`);
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Failed to update inventory' });
		}
	}
};
