import { db } from '$lib/server/db';
import { orders, orderItems, products, suppliers, users } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';


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

    // Formatear los ítems para incluir la información del producto
    const formattedItems = items.map(item => ({
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
        products: formattedItems // Mantener compatibilidad con el código existente
    };
};

export const getItemsByOrderId = async (orderId: string) => {
    const result = await getOrderWithItems(orderId);
    return { order: { ...result, items: undefined }, items: result.items };
};


export const insertOrder = async (order: typeof orders.$inferInsert) => {
	await db.insert(orders).values(order);
};


export const insertOrderItems = async (items: typeof orderItems.$inferInsert[]) => {
	if (items.length === 0) return;
	await db.insert(orderItems).values(items);
};


export const deleteOrder = async (orderId: string) => {
    const [deletedOrder] = await db.delete(orders)
        .where(eq(orders.id, orderId))
        .returning();
    return deletedOrder;
};

export const removeOrder = deleteOrder; 


export const deleteOrderItems = async (orderId: string) => {
    await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
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
	items: typeof orderItems.$inferInsert[]
) => {
	await removeOrderItemsByOrderId(orderId);
};

export const getLastOrderNumber = async () => {
    const result = await db
        .select({ 
            orderNumber: orders.orderNumber,
            num: sql<number>`CAST(SUBSTR(${orders.orderNumber}, 5) AS INTEGER)`
        })
        .from(orders)
        .orderBy(desc(sql<number>`CAST(SUBSTR(${orders.orderNumber}, 5) AS INTEGER)`))
        .limit(1);
    
    console.log('Último número de orden encontrado:', result[0]?.orderNumber);
    return result[0]?.orderNumber;
};

// Obtener órdenes con información de proveedor y usuario
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

