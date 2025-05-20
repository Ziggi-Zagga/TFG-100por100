import { getOrders, createOrderWithItems, deleteOrderById, getSuppliers, updateOrderWithItems } from '$lib/server/services/orders.service';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { getAllProducts } from '$lib/server/services/products.service';

export const load: PageServerLoad = async () => {
	const orders = await getOrders();
	const suppliers = await getSuppliers();
	const products = await getAllProducts();
	return { orders, suppliers, products };				
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const formData = await request.formData();
		const supplierId = formData.get('supplierId')?.toString() ?? '';
		const status = formData.get('status')?.toString() ?? '';
		const notes = formData.get('notes')?.toString() ?? '';
		const expectedArrival = formData.get('expectedArrival') ? parseInt(formData.get('expectedArrival')!.toString()) : undefined;
		const userId = locals.user?.id;

		const itemsJson = formData.get('items')?.toString() ?? '[]';
		let items: { productId: string; quantity: number; price: number; status?: string }[] = [];

		try {
			items = JSON.parse(itemsJson);
		} catch {
			return fail(400, { message: 'Invalid items format' });
		}

		try {
			await createOrderWithItems({
				supplierId,
				userId,
				orderDate: Date.now(),
				expectedArrival,
				status,
				notes,
				items
			});
			throw redirect(303, '/dashboard/orders');
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Failed to create order' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { message: 'Missing order ID' });

		try {
			await deleteOrderById(id);
			return { success: true };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Failed to delete order' });
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { message: 'Missing order ID' });

		try {
			await updateOrderWithItems({
				orderId: id,
				supplierId: formData.get('supplierId')?.toString() ?? '',
				userId: formData.get('userId')?.toString() ?? '',
				orderDate: formData.get('orderDate') ? parseInt(formData.get('orderDate')!.toString()) : undefined,
				expectedArrival: formData.get('expectedArrival') ? parseInt(formData.get('expectedArrival')!.toString()) : undefined,
				status: formData.get('status')?.toString() ?? '',
				notes: formData.get('notes')?.toString() ?? '',
					
			});
			return { success: true };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Failed to update order' });
		}
	}
};
