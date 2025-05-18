import * as repo from '../db/repositories/orders.repository';
import { getAllSuppliers } from '../db/repositories/supplier.repository';
import crypto from 'crypto';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';
import type { orders, orderItems } from '$lib/server/db/schema';

// Obtener todos los pedidos
export const getOrders = async () => {
	return await repo.getAllOrders();
};

// Obtener un pedido con sus items
export const getOrderWithItems = async (orderId: string) => {
	if (!orderId) {
		throw new ServiceError('Order ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'orderId' });
	}
	return await repo.getOrderWithItems(orderId);
};

// Crear nuevo pedido + items
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
	if (!supplierId || !userId || !orderDate || !status || items.length === 0) {
		throw new ServiceError('Missing required order fields', ERROR_TYPES.VALIDATION, 400);
	}

	const orderId = crypto.randomUUID();
	const orderNumber = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;

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

// Eliminar pedido (con sus items)
export const deleteOrderById = async (orderId: string) => {
	if (!orderId) {
		throw new ServiceError('Order ID is required', ERROR_TYPES.VALIDATION, 400);
	}
	await repo.removeOrderItemsByOrderId(orderId);
	await repo.removeOrder(orderId);
};

export const getSuppliers = async () => {
	return await getAllSuppliers();
};
