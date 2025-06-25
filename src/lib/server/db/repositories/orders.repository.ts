import { eq, desc, inArray, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { orders, orderItems, products, suppliers, users } from '$lib/server/db/schema';

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

export const getOrderWithItems = async (orderId: string) => {
	const order = await db.query.orders.findFirst({
		where: eq(orders.id, orderId)
	});

	if (!order) {
		throw new Error('Order not found');
	}

	const items = await db
		.select({
			id: orderItems.id,
			productId: orderItems.productId,
			quantity: orderItems.quantity,
			price: orderItems.price,
			discount: orderItems.discount,
			createdAt: orderItems.createdAt,
			updatedAt: orderItems.updatedAt,
			code: products.code,
			name: products.name,
			productPrice: products.price
		})
		.from(orderItems)
		.leftJoin(products, eq(orderItems.productId, products.id))
		.where(eq(orderItems.orderId, orderId));

	const formattedItems = items.map((item) => ({
		...item,
		code: item.code || 'N/A',
		name: item.name || 'Producto sin nombre',
		price: item.price,
		quantity: item.quantity,
		discount: item.discount || 0
	}));

	return {
		...order,
		items: formattedItems,
		products: formattedItems
	};
};

export const getItemsByOrderId = async (orderId: string) => {
	const result = await getOrderWithItems(orderId);
	return { order: { ...result, items: undefined }, items: result.items };
};

export const insertOrder = async (order: typeof orders.$inferInsert) => {
	await db.insert(orders).values(order);
};

export const insertOrderItems = async (items: (typeof orderItems.$inferInsert)[]) => {
	if (items.length === 0) return;
	await db.insert(orderItems).values(items);
};

export const deleteOrder = async (orderId: string) => {
	const [deletedOrder] = await db.delete(orders).where(eq(orders.id, orderId)).returning();
	return deletedOrder;
};

export const removeOrder = deleteOrder;

export const deleteOrderItems = async (orderId: string) => {
	await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
};

export const deleteOrderItemFromProductId = async (productId: string) => {
	await db.delete(orderItems).where(eq(orderItems.productId, productId));
};

export const removeOrderItemsByOrderId = deleteOrderItems;

export const updateOrder = async (
	orderId: string,
	updatedData: Partial<typeof orders.$inferInsert>
) => {
	await db.update(orders).set(updatedData).where(eq(orders.id, orderId));
};

export const updateOrderItems = async (
	orderId: string,
	items: (typeof orderItems.$inferInsert)[]
) => {
	await removeOrderItemsByOrderId(orderId);
};

export const getLastOrderNumber = async () => {
	const result = await db
		.select({
			orderNumber: orders.orderNumber,
			num: sql<number>`CAST(${orders.orderNumber} AS INTEGER)`
		})
		.from(orders)
		.orderBy(desc(sql<number>`CAST(${orders.orderNumber} AS INTEGER)`))
		.limit(1);
	return result[0]?.orderNumber ? result[0].orderNumber : null;
};

export const getOrdersWithDetails = async () => {
	return await db
		.select({
			id: orders.id,
			orderNumber: orders.orderNumber,
			status: orders.status,
			orderDate: orders.orderDate,
			expectedArrival: orders.expectedArrival,
			notes: orders.notes,
			supplierId: orders.supplierId,
			supplierName: suppliers.name,
			userId: orders.userId,
			userName: users.username,
			createdAt: orders.createdAt,
			updatedAt: orders.updatedAt
		})
		.from(orders)
		.leftJoin(suppliers, eq(orders.supplierId, suppliers.id))
		.leftJoin(users, eq(orders.userId, users.id))
		.orderBy(desc(orders.createdAt));
};

export const getOrdersByUser = async (userId: string) => {
	const ordersResult = await db
		.select({
			id: orders.id,
			orderNumber: orders.orderNumber,
			status: orders.status,
			orderDate: orders.orderDate,
			expectedArrival: orders.expectedArrival,
			notes: orders.notes,
			supplierId: orders.supplierId,
			supplierName: suppliers.name,
			createdAt: orders.createdAt,
			updatedAt: orders.updatedAt
		})
		.from(orders)
		.leftJoin(suppliers, eq(orders.supplierId, suppliers.id))
		.where(eq(orders.userId, userId))
		.orderBy(desc(orders.createdAt));

	const orderIds = ordersResult.map((order) => order.id);
	const itemsResult = await db
		.select({
			orderId: orderItems.orderId,
			id: orderItems.id,
			productId: orderItems.productId,
			quantity: orderItems.quantity,
			price: orderItems.price,
			productName: products.name,
			productDescription: products.description
		})
		.from(orderItems)
		.leftJoin(products, eq(orderItems.productId, products.id))
		.where(inArray(orderItems.orderId, orderIds));

	const itemsByOrderId = new Map<string, (typeof itemsResult)[number][]>();
	itemsResult.forEach((item) => {
		if (!itemsByOrderId.has(item.orderId)) {
			itemsByOrderId.set(item.orderId, []);
		}
		itemsByOrderId.get(item.orderId)?.push(item);
	});

	return ordersResult.map((order) => ({
		...order,
		items: itemsByOrderId.get(order.id) || []
	}));
};
export const getOrderItemsByProductId = async (productId: string) => {
	return await db
		.select({
			orderItemId: orderItems.id,
			orderId: orderItems.orderId,
			productId: orderItems.productId,
			quantity: orderItems.quantity,
			price: orderItems.price,
			discount: orderItems.discount,
			orderDate: orders.orderDate,
			orderNumber: orders.orderNumber,
			productName: products.name,
			productCode: products.code
		})
		.from(orderItems)
		.leftJoin(orders, eq(orderItems.orderId, orders.id))
		.leftJoin(products, eq(orderItems.productId, products.id))
		.where(eq(orderItems.productId, productId))
		.orderBy(desc(orders.orderDate));
};
