import * as repo from '../db/repositories/orders.repository';
import { getAllSuppliers } from '../db/repositories/supplier.repository';
import { getProductsBySupplier } from '../db/repositories/products.repository';
import crypto from 'crypto';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';
import type { orders, orderItems } from '$lib/server/db/schema';

export const getOrders = async () => {
	return await repo.getAllOrders();
};

export const getOrderWithItems = async (orderId: string) => {
	if (!orderId) {
		throw new ServiceError('Order ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'orderId' });
	}
	return await repo.getItemsByOrderId(orderId);
};

export const createOrderWithItems = async ({
	supplierId,
	userId,
	orderDate,
	expectedArrival,
	status,
	notes,
	items
}: {
	supplierId: string;
	userId: string;
	orderDate: number;
	expectedArrival?: number;
	status: string;
	notes?: string;
	items: { productId: string; quantity: number; price: number; status?: string }[];
}) => {
		
	if (!supplierId) {
		throw new ServiceError('Supplier ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'supplierId' });
	}
	if (!userId) {
		throw new ServiceError('User ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'userId' });
	}
	if (!orderDate) {
		throw new ServiceError('Order date is required', ERROR_TYPES.VALIDATION, 400, { field: 'orderDate' });
	}
	if (!status) {
		throw new ServiceError('Status is required', ERROR_TYPES.VALIDATION, 400, { field: 'status' });
	}
	if (!items || items.length === 0) {
		throw new ServiceError('At least one item is required', ERROR_TYPES.VALIDATION, 400, { field: 'items' });
	}

	const now = Date.now();
	if (orderDate > now) {
		throw new ServiceError('Order date cannot be in the future', ERROR_TYPES.VALIDATION, 400, { field: 'orderDate' });
	}
	if (expectedArrival && expectedArrival < orderDate) {
		throw new ServiceError('Expected arrival must be after order date', ERROR_TYPES.VALIDATION, 400, { field: 'expectedArrival' });
	}

	// Validar items
	for (const item of items) {
		if (!item.productId) {
			throw new ServiceError('Product ID is required for each item', ERROR_TYPES.VALIDATION, 400, { field: 'productId' });
		}
		if (item.quantity <= 0) {
			throw new ServiceError('Quantity must be greater than 0', ERROR_TYPES.VALIDATION, 400, { field: 'quantity' });
		}
		if (item.price <= 0) {
			throw new ServiceError('Price must be greater than 0', ERROR_TYPES.VALIDATION, 400, { field: 'price' });
		}
	}

	const lastOrderNumber = await repo.getLastOrderNumber();
	const nextOrderNumber = lastOrderNumber ? 
		Number(lastOrderNumber.replace('ORD-', '')) + 1 :
		1;
	
	const orderNumber = `ORD-${nextOrderNumber.toString().padStart(6, '0')}`;
	
	const orderId = crypto.randomUUID();

	await repo.insertOrder({
		id: orderId,
		orderNumber,
		supplierId,
		userId,
		orderDate: new Date(orderDate),
		expectedArrival: expectedArrival ? new Date(expectedArrival) : null,
		status,
		notes,
		createdAt: new Date(),
		updatedAt: new Date()
	});

	const itemsWithIds: typeof orderItems.$inferInsert[] = items.map((item) => ({
		id: crypto.randomUUID(),
		orderId,
		productId: item.productId,
		quantity: item.quantity,
		price: item.price,
		status: item.status ?? 'pending',
		createdAt: new Date(),
		updatedAt: new Date()
	}));

	await repo.insertOrderItems(itemsWithIds);

	return { id: orderId };
};

export const deleteOrderById = async (orderId: string) => {
	if (!orderId) {
		throw new ServiceError('Order ID is required', ERROR_TYPES.VALIDATION, 400);
	}
	await repo.removeOrderItemsByOrderId(orderId);
	await repo.removeOrder(orderId);
};

export const updateOrderWithItems = async ({
	orderId,
	supplierId,
	userId,
	orderDate,
	expectedArrival,
	status,
	notes,

}: {
	orderId: string;
	supplierId?: string;
	userId?: string;
	orderDate?: number;
	expectedArrival?: number;
	status?: string;
	notes?: string;
}) => {
	if (!orderId) {
		throw new ServiceError('Order ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'orderId' });
	}

	if (supplierId && !userId) {
		throw new ServiceError('User ID is required when updating supplier', ERROR_TYPES.VALIDATION, 400, { field: 'userId' });
	}
	if (orderDate) {
		const now = Date.now();
		if (orderDate > now) {
			throw new ServiceError('Order date cannot be in the future', ERROR_TYPES.VALIDATION, 400, { field: 'orderDate' });
		}
	}
	if (expectedArrival && orderDate && expectedArrival < orderDate) {
		throw new ServiceError('Expected arrival must be after order date', ERROR_TYPES.VALIDATION, 400, { field: 'expectedArrival' });
	}

	// Validar productos
	if (!supplierId) {
		throw new ServiceError('Supplier ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'supplierId' });
	}
	const products = await getProductsBySupplier(supplierId);
	
	await repo.updateOrder(orderId, {
		
	});
};

export const getSuppliers = async () => {
	return await getAllSuppliers();
};

