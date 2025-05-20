import {
	repoGetInventoryView,
	repoGetAvailableProducts,
	repoGetStoreGaps,
	repoInsertInventoryItem,
	repoDeleteInventoryItem
} from '$lib/server/db/repositories/inventory.repository';

import { getCategoriesById } from '$lib/server/db/repositories/category.repository';
import { getSuppliersById } from '$lib/server/db/repositories/supplier.repository';
import { getManufacturersById } from '$lib/server/db/repositories/manufacturers.repository';

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
	productId,
	storeGapId,
	stock
}: {
	productId: string;
	storeGapId: string;
	stock: number;
}) {
	if (!productId) {
		throw new ServiceError('Product ID is required', ERROR_TYPES.VALIDATION, 400);
	}
	if (!storeGapId) {
		throw new ServiceError('Location ID is required', ERROR_TYPES.VALIDATION, 400);
	}
	if (isNaN(stock) || stock < 0) {
		throw new ServiceError('Stock must be a valid non-negative number', ERROR_TYPES.VALIDATION, 400);
	}

	await repoInsertInventoryItem({ productId, storeGapId, stock });
}

export async function deleteInventoryEntry(id: string) {
	if (!id || typeof id !== 'string') {
		throw new ServiceError('Invalid or missing inventory ID', ERROR_TYPES.VALIDATION, 400);
	}

	await repoDeleteInventoryItem(id);
}

export async function getCategories(id: string) {
	return await getCategoriesById(id);
}

export async function getSuppliers(id: string) {
	return await getSuppliersById(id);
}

export async function getManufacturers(id: string) {
	return await getManufacturersById(id);
}
