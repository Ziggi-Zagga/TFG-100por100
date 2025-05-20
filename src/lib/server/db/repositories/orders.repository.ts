import { db } from '$lib/server/db';
import { orders, orderItems, products, suppliers, users } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';


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


export const getItemsByOrderId = async (orderId: string) => {
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


export const insertOrder = async (order: typeof orders.$inferInsert) => {
	await db.insert(orders).values(order);
};


export const insertOrderItems = async (items: typeof orderItems.$inferInsert[]) => {
	if (items.length === 0) return;
	await db.insert(orderItems).values(items);
};


export const removeOrder = async (orderId: string) => {
	await db.delete(orders).where(eq(orders.id, orderId));
};


export const removeOrderItemsByOrderId = async (orderId: string) => {
	await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
};


export const updateOrder = async (
	orderId: string,
	updatedData: Partial<typeof orders.$inferInsert>
) => {
	await db.update(orders).set(updatedData).where(eq(orders.id, orderId));
};

export const updateOrderItems = async (
	orderId: string,
	items: typeof orderItems.$inferInsert[]
) => {
	await removeOrderItemsByOrderId(orderId);
	if (items.length > 0) {
		await db.insert(orderItems).values(items);
	}
};

export const getLastOrderNumber = async () => {
	const result = await db
		.select({ orderNumber: orders.orderNumber })
		.from(orders)
		.orderBy(desc(orders.createdAt))
		.limit(1);
	
	return result[0]?.orderNumber;
};

