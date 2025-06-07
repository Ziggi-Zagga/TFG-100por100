import * as repo from '../db/repositories/inventoryHistory.repository';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';
import crypto from 'crypto';

// Get inventory history view
export const getInventoryHistory = async () => {
    return await repo.repoGetInventoryHistoryView();
};

// Get inventory history by inventory ID
export const getInventoryHistoryByInventoryId = async (inventoryId: string) => {
    if (!inventoryId) {
        throw new ServiceError('Inventory ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'inventoryId' });
    }
    return await repo.repoGetInventoryHistoryByInventoryId(inventoryId);
};

// Get inventory history by user ID
export const getInventoryHistoryByUserId = async (userId: string) => {
    if (!userId) {
        throw new ServiceError('User ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'userId' });
    }
    return await repo.repoGetInventoryHistoryByUserId(userId);
};

// Create inventory history record
export const createInventoryHistory = async ({
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
        throw new ServiceError('ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
    }
    if (!productId) {
        throw new ServiceError('Product ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'productId' });
    }
    if (!inventoryId) {
        throw new ServiceError('Inventory ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'inventoryId' });
    }
    if (typeof quantityChanged !== 'number' || isNaN(quantityChanged)) {
        throw new ServiceError('Quantity changed must be a valid number', ERROR_TYPES.VALIDATION, 400, { field: 'quantityChanged' });
    }

    return await repo.repoInsertInventoryHistory({
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