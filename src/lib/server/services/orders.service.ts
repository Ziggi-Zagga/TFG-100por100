import * as orderRepo from '../db/repositories/orders.repository';
import * as supplierRepo from '../db/repositories/supplier.repository';
import * as productRepo from '../db/repositories/products.repository';
import crypto from 'crypto';
import { db } from '$lib/server/db';
import { orders, orderItems } from '$lib/server/db/schema';


export const getOrders = async () => {
    const orders = await orderRepo.getAllOrders();
    
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const { items } = await orderRepo.getItemsByOrderId(order.id);
        return {
            ...order,
            items,
            products: items
        };
    }));
    
    return ordersWithItems;
};

// Obtener una orden con sus ítems
export const getOrderWithItems = async (orderId: string) => {
    if (!orderId) {
        throw new Error('Order ID is required');
    }
    return await orderRepo.getOrderWithItems(orderId);
};

// Crear una nueva orden con ítems
export const createOrderWithItems = async (orderData: {
    supplierId: string;
    userId: string;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
        discount?: number;
    }>;
    orderDate?: Date | string | number;
    expectedArrival?: Date | string | number;
    status?: string;
    notes?: string;
}) => {
    
    // Validar datos básicos
    if (!orderData.supplierId) {
        const error = 'Supplier ID is required';
        throw new Error(error);
    }
    
    if (!orderData.userId) {
        const error = 'User ID is required';
        throw new Error(error);
    }
    
    if (!orderData.items || orderData.items.length === 0) {
        const error = 'At least one item is required';
        throw new Error(error);
    }

    // Verificar que el proveedor existe
    const supplier = await db.query.suppliers.findFirst({
        where: (suppliers, { eq }) => eq(suppliers.id, orderData.supplierId)
    });
    if (!supplier) {
        const error = `Supplier with ID ${orderData.supplierId} not found`;
        throw new Error(error);
    }

    // Verificar que el usuario existe
    const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, orderData.userId)
    });
    
    if (!user) {
        const error = `User with ID ${orderData.userId} not found`;
        throw new Error(error);
    } 

    // Verificar que los productos existen
    console.log('Verifying products exist...');
    for (const [index, item] of orderData.items.entries()) {
        console.log(`Checking product ${index + 1}/${orderData.items.length}: ${item.productId}`);
        const product = await db.query.products.findFirst({
            where: (products, { eq }) => eq(products.id, item.productId)
        });
        if (!product) {
            const error = `Product with ID ${item.productId} not found`;
            console.error('Product error:', error);
            throw new Error(error);
        } else {
            console.log(`Product ${item.productId} found:`, product.name);
        }
        if (item.quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        if (item.price <= 0) {
            throw new Error('Price must be greater than 0');
        }
    }

    // revisar el tema de ORD si quitarlo ya que no aporta mucho y solo puede dar problemas
    // revisar problema de concurrencias y arreglar para evitar eso crear directamente secuencial o autoincremento en la base de datos
    // buscar sobre la secuencialidad de sqLite y como se haria la migración a una base de datos sin esos problemas
    //
    //
    // Generar número de orden
    const lastOrderNumber = await orderRepo.getLastOrderNumber();
    const nextOrderNumber = lastOrderNumber ? 
        Number(lastOrderNumber.replace('ORD-', '')) + 1 : 1;
    const orderNumber = `ORD-${nextOrderNumber.toString().padStart(6, '0')}`;

    // Crear la orden
    const orderId = crypto.randomUUID();
    const orderToInsert = {
        id: orderId,
        orderNumber,
        supplierId: orderData.supplierId,
        userId: orderData.userId,
        status: orderData.status || 'pending',
        notes: orderData.notes || '',
        orderDate: orderData.orderDate ? new Date(orderData.orderDate) : new Date(),
        expectedArrival: orderData.expectedArrival ? new Date(orderData.expectedArrival) : null,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    
    console.log('Order data prepared:', JSON.stringify(orderToInsert, null, 2));
    console.log('Preparing order items...');
    
    const itemsToInsert = orderData.items.map(item => {
        const orderItem = {
            id: crypto.randomUUID(),
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount || 0,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        console.log('Order item prepared:', JSON.stringify(orderItem, null, 2));
        return orderItem;
    });

    // Insertar la orden y los ítems en una transacción
    console.log('Starting database transaction...');
    try {
        await db.transaction(async (tx: any) => {  // Using any for tx as a quick fix, but should be properly typed in production
            console.log('Inserting order...');
            await tx.insert(orders).values(orderToInsert);
            console.log('Order inserted successfully');
            
            if (itemsToInsert.length > 0) {
                console.log(`Inserting ${itemsToInsert.length} order items...`);
                await tx.insert(orderItems).values(itemsToInsert);
                console.log('Order items inserted successfully');
            } else {
                console.log('No items to insert');
            }
        });
        
        console.log('Transaction completed successfully');
    } catch (error: unknown) {
        console.error('Error in transaction:');
        
        if (error instanceof Error) {
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
        } else if (error && typeof error === 'object' && 'message' in error) {
            
            const err = error as { message: string, name?: string, code?: string, stack?: string };
            console.error('Error details:', {
                name: err.name || 'UnknownError',
                message: err.message,
                code: err.code,
                stack: err.stack
            });
        } else {
            console.error('Unknown error occurred:', error);
        }
        
        throw error; // Re-lanzar el error para manejarlo en el controlador
    }

    const result = { ...orderToInsert, items: orderData.items };
    console.log('Order creation completed successfully');
    console.log('Result:', JSON.stringify(result, null, 2));
    return result;
};

// Eliminar una orden por ID
export const deleteOrderById = async (orderId: string) => {
    if (!orderId) {
        throw new Error('Order ID is required');
    }
    
    // Primero eliminamos los ítems de la orden
    await orderRepo.deleteOrderItems(orderId);
    
    // Luego eliminamos la orden
    await orderRepo.deleteOrder(orderId);
    
    return { success: true };
};

// Actualizar una orden existente
export const updateOrderWithItems = async (orderId: string, updates: {
    supplierId?: string;
    userId?: string;
    orderDate?: Date | string | number;
    expectedArrival?: Date | string | number | null;
    status?: string;
    notes?: string;
    items?: Array<{
        id?: string;
        productId: string;
        quantity: number;
        price: number;
        discount?: number;
        status?: string;
    }>;
}) => {
    if (!orderId) {
        throw new Error('Order ID is required');
    }

    const now = new Date();
    const orderUpdates: any = {
        updatedAt: now
    };

    // Actualizar campos básicos de la orden
    if (updates.supplierId) orderUpdates.supplierId = updates.supplierId;
    if (updates.userId) orderUpdates.userId = updates.userId;
    if (updates.orderDate) orderUpdates.orderDate = new Date(updates.orderDate);
    if (updates.expectedArrival !== undefined) {
        orderUpdates.expectedArrival = updates.expectedArrival ? new Date(updates.expectedArrival) : null;
    }
    if (updates.status) orderUpdates.status = updates.status;
    if (updates.notes !== undefined) orderUpdates.notes = updates.notes;

    // Actualizar la orden
    await orderRepo.updateOrder(orderId, orderUpdates);

    // Si hay ítems para actualizar
    if (updates.items && updates.items.length > 0) {
        // Primero eliminamos los ítems existentes  
        await orderRepo.deleteOrderItems(orderId);
        
        const orderItems = updates.items.map(item => ({
            id: item.id || crypto.randomUUID(),
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount || 0,
            status: item.status || 'pending',
            createdAt: now,
            updatedAt: now
        }));

        await orderRepo.insertOrderItems(orderItems);
    }

    return { id: orderId };
};

export const getSuppliers = async () => {
    return await supplierRepo.getAllSuppliers();
};

export const getProductsBySupplierId = async (supplierId: string) => {
    if (!supplierId) {
        throw new Error('Supplier ID is required');
    }
    // Verificar que el proveedor existe
    console.log(`Checking if supplier exists: ${supplierId}`);
    const supplier = await db.query.suppliers.findFirst({
        where: (suppliers, { eq }) => eq(suppliers.id, supplierId)
    });
    if (!supplier) {
        const error = `Supplier with ID ${supplierId} not found`;
        console.error('Supplier error:', error);
        throw new Error(error);
    } else {
        console.log('Supplier found:', JSON.stringify(supplier, null, 2));
    }
    return await productRepo.getProductsBySupplier(supplierId);
};

export const getOrdersByUser = async (userId: string) => {
    if (!userId) {
        throw new Error('User ID is required');
    }
    return await orderRepo.getOrdersByUser(userId);
};

