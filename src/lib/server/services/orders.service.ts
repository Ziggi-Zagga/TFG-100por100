import * as orderRepo from '../db/repositories/orders.repository';
import * as supplierRepo from '../db/repositories/supplier.repository';
import * as productRepo from '../db/repositories/products.repository';
import crypto from 'crypto';
import type { orderItems } from '$lib/server/db/schema';

// Obtener todas las órdenes
export const getOrders = async () => {
    return await orderRepo.getAllOrders();
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
        throw new Error('Supplier ID is required');
    }
    
    if (!orderData.userId) {
        throw new Error('User ID is required');
    }
    
    if (!orderData.items || orderData.items.length === 0) {
        throw new Error('At least one item is required');
    }

    // Validar items
    for (const item of orderData.items) {
        if (!item.productId) {
            throw new Error('Product ID is required for each item');
        }
        if (item.quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }
        if (item.price <= 0) {
            throw new Error('Price must be greater than 0');
        }
    }

    // Generar número de orden
    const lastOrderNumber = await orderRepo.getLastOrderNumber();
    const nextOrderNumber = lastOrderNumber ? 
        Number(lastOrderNumber.replace('ORD-', '')) + 1 : 1;
    const orderNumber = `ORD-${nextOrderNumber.toString().padStart(6, '0')}`;

    // Crear la orden
    const orderId = crypto.randomUUID();
    const now = new Date();
    
    const order = {
        id: orderId,
        orderNumber,
        supplierId: orderData.supplierId,
        userId: orderData.userId,
        orderDate: orderData.orderDate ? new Date(orderData.orderDate) : now,
        expectedArrival: orderData.expectedArrival ? new Date(orderData.expectedArrival) : null,
        status: orderData.status || 'pending',
        notes: orderData.notes || '',
        createdAt: now,
        updatedAt: now
    };

    // Crear los ítems de la orden
    const orderItems = orderData.items.map(item => ({
        id: crypto.randomUUID(),
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
        status: 'pending',
        createdAt: now,
        updatedAt: now
    }));

    // Guardar en la base de datos
    await orderRepo.insertOrder(order);
    await orderRepo.insertOrderItems(orderItems);

    return { id: orderId, orderNumber };
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
    return await productRepo.getProductsBySupplier(supplierId);
};

export const getOrdersByUser = async (userId: string) => {
    if (!userId) {
        throw new Error('User ID is required');
    }
    return await orderRepo.getOrdersByUser(userId);
};

