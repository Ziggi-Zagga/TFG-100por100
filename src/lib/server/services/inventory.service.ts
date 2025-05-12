import {
	repoGetInventoryView,
	repoGetAvailableProducts,
	repoGetStoreGaps,
	repoInsertInventoryItem,
	repoDeleteInventoryItem
} from '$lib/server/db/repositories/inventory.repository';

import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';

export async function getInventoryData() {
	const items = await repoGetInventoryView();
	const safeAvailableProducts = await repoGetAvailableProducts();
	const locations = await repoGetStoreGaps();

	return {
		items,
		safeAvailableProducts,
		locations,
		totalProducts: items.length
	};
}

export async function createInventoryEntry({
	product_id,
	location_id,
	stock
}: {
	product_id: string;
	location_id: string;
	stock: number;
}) {
	if (!product_id) {
		throw new ServiceError('Product ID is required', ERROR_TYPES.VALIDATION, 400);
	}
	if (!location_id) {
		throw new ServiceError('Location ID is required', ERROR_TYPES.VALIDATION, 400);
	}
	if (isNaN(stock) || stock < 0) {
		throw new ServiceError('Stock must be a valid non-negative number', ERROR_TYPES.VALIDATION, 400);
	}

	await repoInsertInventoryItem({ product_id, location_id, stock });
}

export async function deleteInventoryEntry(id: string) {
	if (!id || typeof id !== 'string') {
		throw new ServiceError('Invalid or missing inventory ID', ERROR_TYPES.VALIDATION, 400);
	}

	await repoDeleteInventoryItem(id);
}
