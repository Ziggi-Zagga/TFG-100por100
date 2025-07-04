import {
	repoGetInventoryView,
	repoInsertInventoryItem,
	repoDeleteInventoryItem,
	repoGetInventoryById,
	repoUpdateInventoryItem,
	repoGetProductsByGapId
} from '$lib/server/db/repositories/inventory.repository';
import {
	getFullwarehouseTree,
	repoGetTreeFromGapId
} from '$lib/server/db/repositories/warehouse.repository';
import { getCategoriesById } from '$lib/server/db/repositories/category.repository';
import { getSuppliersById } from '$lib/server/db/repositories/supplier.repository';
import { getManufacturersById } from '$lib/server/db/repositories/manufacturers.repository';
import type { Product } from '$lib/types/products.types';

import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';
import { getFullProductsList, repoGetProductById } from '../db/repositories/products.repository';
import {
	repoDeleteInventoryHistoryByInventoryId,
	repoGetInventoryHistoryByInventoryId,
	repoGetInventoryHistoryView,
	repoInsertInventoryHistory
} from '../db/repositories/inventoryHistory.repository';

export const getInventoryData = async () => {
	const items = await repoGetInventoryView();
	const safeAvailableProducts = await getFullProductsList();
	const fullwarehouseTree = await getFullwarehouseTree();

	return {
		inventoryItems: items,
		availableProducts: safeAvailableProducts,
		fullwarehouseTree: fullwarehouseTree,
		totalProducts: items.length
	};
};

export const createInventoryEntry = async ({
	productId,
	warehouseGapId,
	stock,
	minQuantity,
	reorderQuantity,
	lastCount,
	createdAt = new Date(),
	updatedAt = new Date()
}: {
	productId: string;
	warehouseGapId: string;
	stock: number;
	minQuantity: number;
	reorderQuantity: number;
	lastCount?: Date;
	createdAt?: Date;
	updatedAt?: Date;
}) => {
	if (!productId) {
		throw new ServiceError('Product ID is required', ERROR_TYPES.VALIDATION, 400);
	}
	if (!warehouseGapId) {
		throw new ServiceError('Location ID is required', ERROR_TYPES.VALIDATION, 400);
	}
	if (isNaN(stock) || stock < 0) {
		throw new ServiceError(
			'Stock must be a valid non-negative number',
			ERROR_TYPES.VALIDATION,
			400
		);
	}
	if (isNaN(minQuantity) || minQuantity < 0) {
		throw new ServiceError(
			'Minimum quantity must be a valid non-negative number',
			ERROR_TYPES.VALIDATION,
			400
		);
	}
	if (isNaN(reorderQuantity) || reorderQuantity < 0) {
		throw new ServiceError(
			'Reorder quantity must be a valid non-negative number',
			ERROR_TYPES.VALIDATION,
			400
		);
	}

	await repoInsertInventoryItem({
		productId,
		warehouseGapId,
		stock,
		minQuantity,
		reorderQuantity,
		lastCount,
		createdAt,
		updatedAt
	});
};

export const deleteInventoryEntry = async (id: string) => {
	if (!id) {
		throw new ServiceError('Invalid or missing inventory ID', ERROR_TYPES.VALIDATION, 400);
	}
	await repoDeleteInventoryItem(id);
};

export const updateInventoryEntry = async ({
	id,
	stock,
	minQuantity,
	reorderQuantity,
	warehouseGapId,
	lastCount,
	updatedAt
}: {
	id: string;
	stock: number;
	minQuantity: number;
	reorderQuantity: number;
	warehouseGapId: string;
	lastCount?: Date;
	updatedAt?: Date;
}) => {
	if (!id) {
		throw new ServiceError('Invalid or missing inventory ID', ERROR_TYPES.VALIDATION, 400);
	}
	await repoUpdateInventoryItem({
		id,
		stock,
		minQuantity,
		reorderQuantity,
		warehouseGapId,
		lastCount,
		updatedAt
	});
};

export const getCategorie = async (id: string) => {
	return await getCategoriesById(id);
};

export const getSupplier = async (id: string) => {
	return await getSuppliersById(id);
};

export const getManufacturer = async (id: string) => {
	return await getManufacturersById(id);
};

export const getInventoryById = async (id: string) => {
	return await repoGetInventoryById(id);
};

export const getProductById = async (id: string) => {
	return await repoGetProductById(id);
};

export const getTreeFromGapId = async (gapId: string) => {
	return await repoGetTreeFromGapId(gapId);
};

export const getInventoryHistory = async () => {
	return await repoGetInventoryHistoryView();
};

export const getInventoryHistoryByInventoryId = async (inventoryId: string) => {
	return await repoGetInventoryHistoryByInventoryId(inventoryId);
};

interface InventoryOperationResult {
	success: boolean;
	message?: string;
	error?: string;
}

export const updateInventoryQuantity = async (
	inventoryId: string,
	quantityChange: number
): Promise<InventoryOperationResult> => {
	try {
		const inventoryItem = await repoGetInventoryById(inventoryId);
		if (!inventoryItem) {
			return {
				success: false,
				error: 'No se encontró el producto en el inventario'
			};
		}

		const currentQuantity = inventoryItem.quantity || 0;
		const newQuantity = currentQuantity + quantityChange;

		if (newQuantity < 0) {
			return {
				success: false,
				error: `Stock insuficiente. Stock actual: ${currentQuantity}`
			};
		}

		try {
			await repoUpdateInventoryItem({
				id: inventoryId,
				stock: newQuantity,
				minQuantity: inventoryItem.minQuantity || 0,
				reorderQuantity: inventoryItem.reorderQuantity || 0,
				warehouseGapId: inventoryItem.warehouseGapId,
				lastCount: new Date(),
				updatedAt: new Date()
			});

			await createInventoryHistoryEntry({
				id: crypto.randomUUID(),
				productId: inventoryItem.productId,
				inventoryId: inventoryId,
				fromGapId: inventoryItem.warehouseGapId,
				previousQuantity: currentQuantity,
				newQuantity: newQuantity,
				quantityChanged: quantityChange,
				notes: 'Ajuste de inventario',
				createdAt: new Date()
			});

			const action = quantityChange < 0 ? 'quitado' : 'añadido';
			return {
				success: true,
				message: `Se han ${action} ${Math.abs(quantityChange)} unidades correctamente`
			};
		} catch (error) {
			console.error('Error al actualizar el inventario:', error);
			return {
				success: false,
				error: 'Error al actualizar el inventario. Por favor, inténtalo de nuevo.'
			};
		}
	} catch (error) {
		console.error('Error updating inventory quantity:', error);
		throw error;
	}
};

export interface ProductWithGapName {
	product: Product;
	gapName: string;
}

export const getProductsByGapId = async (gapId: string): Promise<ProductWithGapName[]> => {
	if (!gapId) {
		throw new ServiceError('Gap ID is required', ERROR_TYPES.VALIDATION, 400);
	}
	return await repoGetProductsByGapId(gapId);
};

export const createInventoryHistoryEntry = async ({
	id,
	productId,
	inventoryId,
	fromGapId,
	toGapId,
	previousQuantity,
	newQuantity,
	quantityChanged,
	userId,
	notes,
	createdAt = new Date()
}: {
	id: string;
	productId: string;
	inventoryId: string;
	fromGapId?: string;
	toGapId?: string;
	previousQuantity?: number;
	newQuantity?: number;
	quantityChanged: number;
	userId?: string;
	notes?: string;
	createdAt?: Date;
}) => {
	if (!id) {
		throw new ServiceError('ID is required', ERROR_TYPES.VALIDATION, 400);
	}
	if (!productId) {
		throw new ServiceError('Product ID is required', ERROR_TYPES.VALIDATION, 400);
	}
	if (!inventoryId) {
		throw new ServiceError('Inventory ID is required', ERROR_TYPES.VALIDATION, 400);
	}
	if (isNaN(quantityChanged)) {
		throw new ServiceError('Quantity changed must be a valid number', ERROR_TYPES.VALIDATION, 400);
	}

	await repoInsertInventoryHistory({
		id,
		productId,
		inventoryId,
		fromGapId,
		toGapId,
		previousQuantity,
		newQuantity,
		quantityChanged,
		userId,
		notes,
		createdAt
	});
};

export const deleteInventoryHistoryEntryByInventoryId = async (inventoryId: string) => {
	await repoDeleteInventoryHistoryByInventoryId(inventoryId);
};

