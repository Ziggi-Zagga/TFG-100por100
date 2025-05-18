import { db } from '$lib/server/db';
import { orders, orderItems, products, suppliers, users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// Obtener todos los pedidos (sin items)
export const getAllOrders = async () => {
	return await db
		.select({
			id: orders.id,
			orderNumber: orders.orderNumber,
			status: orders.status,
			orderDate: orders.orderDate,
			expectedArrival: orders.expectedArrival,
			supplierId: orders.supplierId,
			userId: orders.userId,
			notes: orders.notes,
			createdAt: orders.createdAt,
			updatedAt: orders.updatedAt
		})
		.from(orders);
};

// Obtener pedido con sus items
export const getOrderWithItems = async (orderId: string) => {
	const order = await db.query.orders.findFirst({
		where: eq(orders.id, orderId)
	});

	const items = await db
		.select({
			id: orderItems.id,
			productId: orderItems.productId,
			quantity: orderItems.quantity,
			price: orderItems.price,
			status: orderItems.status,
			createdAt: orderItems.createdAt,
			updatedAt: orderItems.updatedAt,
			productName: products.name
		})
		.from(orderItems)
		.leftJoin(products, eq(orderItems.productId, products.id))
		.where(eq(orderItems.orderId, orderId));

	return { order, items };
};

// Insertar pedido
export const insertOrder = async (order: typeof orders.$inferInsert) => {
	await db.insert(orders).values(order);
};

// Insertar múltiples items
export const insertOrderItems = async (items: typeof orderItems.$inferInsert[]) => {
	if (items.length === 0) return;
	await db.insert(orderItems).values(items);
};

// Eliminar pedido
export const removeOrder = async (orderId: string) => {
	await db.delete(orders).where(eq(orders.id, orderId));
};

// Eliminar todos los items de un pedido
export const removeOrderItemsByOrderId = async (orderId: string) => {
	await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
};

// Actualizar pedido
export const updateOrder = async (
	orderId: string,
	updatedData: Partial<typeof orders.$inferInsert>
) => {
	await db.update(orders).set(updatedData).where(eq(orders.id, orderId));
};
