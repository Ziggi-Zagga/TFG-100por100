import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getDashboardStats, getProductsFormated } from '$lib/server/services/dashboard.service';
import { updateInventoryQuantity } from '$lib/server/services/inventory.service';
import { error, fail } from '@sveltejs/kit';

export const actions: Actions = {
	updateInventory: async ({ request, locals }) => {
		if (!locals.user) {
			throw error(401, 'Unauthorized');
		}

		const data = await request.formData();
		const inventoryId = data.get('inventoryId');
		const quantity = Number(data.get('quantity'));

		if (!inventoryId || isNaN(quantity)) {
			return fail(400, {
				success: false,
				error: 'Datos de entrada inválidos'
			});
		}

		const result = await updateInventoryQuantity(inventoryId.toString(), quantity);

		if (!result.success) {
			return fail(400, {
				success: false,
				error: result.error || 'Error al actualizar el inventario',
				message: result.error
			});
		}

		return {
			success: true,
			message: result.message || 'Operación completada correctamente'
		};
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/onboarding/login');
	}
	const userName = locals.user.username;

	const dashboardStats = await getDashboardStats();

	const metrics = [
		{
			title: 'Top Supplier',
			value: dashboardStats.topSupplier ? `${dashboardStats.topSupplier.name}` : 'No supplier data',
			icon: 'truck',
			color: 'bg-blue-200',
			route: '/dashboard/suppliers'
		},
		{
			title: 'Total Value of Stock',
			value: dashboardStats.valueOfStock,
			color: 'bg-indigo-200',
			route: 'dashboard/products'
		},
		{
			title: 'Products in Stock',
			value: dashboardStats.totalStock,
			color: 'bg-violet-200',
			route: 'dashboard/inventory'
		},
		{
			title: 'Pending Orders',
			value: dashboardStats.pendingOrdersCount,
			color: 'bg-purple-200',
			route: 'dashboard/orders/ordersList'
		}
	];

	const productsUnderMinStock = (dashboardStats.ProductsUnderStock || [])
		.filter((item: any) => (item.quantity || 0) < (item.reorderQuantity || 0))
		.map(
			(item: any) =>
				({
					productName: item.name || 'Unknown Product',
					inventoryId: item.id || '',
					productId: item.productId || '',
					location: item.location || 'N/A',
					quantity: item.quantity || 0,
					currentStock: item.quantity || 0,
					minStock: item.minQuantity || 0,
					reorderQuantity: item.reorderQuantity || 0,
					warehouse: item.location || 'N/A',
					sku: item.code || '',
					name: item.name || 'Unknown Product'
				}) as const
		)
		.sort((a, b) => (a.quantity || 0) - (b.quantity || 0));

	const topProducts = dashboardStats.ProductsUnderStock.map((item) => ({
		productName: item.name,
		inventoryId: item.id || '',
		productId: item.productId || '',
		location: item.location || 'N/A',
		quantity: item.quantity || 0,
		minStock: item.minQuantity || 0,
		reorderQuantity: item.reorderQuantity || 0,
		warehouse: item.location || 'N/A',
		currentStock: item.quantity || 0
	}));

	const products = await getProductsFormated();

	return {
		user: locals.user,
		userName,
		metrics,
		topProducts,
		productsUnderMinStock,
		products
	};
};
