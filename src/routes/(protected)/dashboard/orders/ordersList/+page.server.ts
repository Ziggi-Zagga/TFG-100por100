import { getOrders, createOrderWithItems, deleteOrderById, getSuppliers, updateOrderWithItems } from '$lib/server/services/orders.service';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAllProducts } from '$lib/server/services/products.service';

// Cargar datos para la página
export const load: PageServerLoad = async () => {
    try {
        const orders = await getOrders();
        const suppliers = await getSuppliers();
        const products = await getAllProducts();
        
        return { 
            orders: orders || [], 
            suppliers: suppliers || [], 
            products: products || [] 
        };
    } catch (error) {
        console.error('Error loading orders page:', error);
        return { 
            orders: [], 
            suppliers: [], 
            products: [],
            error: 'Error al cargar los datos de pedidos'
        };
    }
};

export const actions: Actions = {
    // Crear una nueva orden
    create: async ({ request, locals }) => {
        const formData = await request.formData();
        const supplierId = formData.get('supplierId')?.toString() ?? '';
        const notes = formData.get('notes')?.toString() ?? '';
        const userId = locals.user?.id;
        const itemsJson = formData.get('items')?.toString() ?? '[]';
       
        if (!userId) {
            return fail(401, { message: 'No autorizado' });
        }
        
        let items: { productId: string; quantity: number; price: number; discount?: number; status?: string }[] = [];
        
        try {
            items = JSON.parse(itemsJson);
        } catch (error) {
            console.error('Error parsing items:', error);
            return fail(400, { message: 'Formato de ítems inválido' });
        }

        try {
            const order = await createOrderWithItems({
                supplierId,
                userId,
                status: 'pending',
                notes,
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: Number(item.quantity),
                    price: Number(item.price),
                    discount: Number(item.discount) || 0,
                    status: 'pending'
                }))
            });
            
            return { success: true, order };
        } catch (error) {
            console.error('Error creating order:', error);
            return fail(500, { 
                message: error instanceof Error ? error.message : 'Error al crear el pedido' 
            });
        }
    },

    // Eliminar una orden
    delete: async ({ request }) => {
        const formData = await request.formData();
        const orderId = formData.get('id')?.toString();

        if (!orderId) {
            return fail(400, { message: 'Se requiere el ID del pedido' });
        }

        try {
            await deleteOrderById(orderId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting order:', error);
            return fail(500, { 
                message: error instanceof Error ? error.message : 'Error al eliminar el pedido' 
            });
        }
    },

    // Actualizar una orden
    update: async ({ request }) => {
        const formData = await request.formData();
        const orderId = formData.get('id')?.toString();
        const status = formData.get('status')?.toString();
        const expectedArrival = formData.get('expectedArrival')?.toString();

        if (!orderId) {
            return fail(400, { message: 'Se requiere el ID del pedido' });
        }

        try {
            const updates: Record<string, any> = {};
            
            if (status) updates.status = status;
            if (expectedArrival) {
                updates.expectedArrival = new Date(expectedArrival);
            }

            await updateOrderWithItems(orderId, updates);
            return { success: true };
        } catch (error) {
            console.error('Error updating order:', error);
            return fail(500, { 
                message: error instanceof Error ? error.message : 'Error al actualizar el pedido' 
            });
        }
    }
};
