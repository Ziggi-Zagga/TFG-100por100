import { getAllOrders } from '$lib/server/db/repositories/orders.repository';
import { getAllSuppliers } from '$lib/server/db/repositories/supplier.repository';
import { getInventoryData } from '$lib/server/services/inventory.service';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';

export const getDashboardStats = async () => {
	try {
		const orders = await getAllOrders();

		const ordersByStatus = orders.reduce(
			(acc: Record<string, number>, order: any) => {
				const status = (order.status || 'PENDING').toUpperCase();
				acc[status] = (acc[status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const pendingOrdersCount = ordersByStatus['PENDING'] || 0;

		const recentOrders = orders
			.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
			.slice(0, 5);

		const { inventoryItems } = await getInventoryData();

		const totalStock = inventoryItems.reduce((total, item) => total + (item.quantity || 0), 0);
		const valueOfStock = inventoryItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
		const ProductsUnderStock = inventoryItems.filter(item => item.quantity < (item.minQuantity ?? 0));

		// Obtener todos los proveedores
		const allSuppliers = await getAllSuppliers();

		// Contar pedidos por proveedor
		const supplierOrderCounts = orders.reduce((acc, order) => {
			if (order.supplierId) {
				acc[order.supplierId] = (acc[order.supplierId] || 0) + 1;
			}
			return acc;
		}, {} as Record<string, number>);

		// Encontrar el proveedor con más pedidos
		let topSupplier = null;
		let maxOrders = 0;

		for (const supplier of allSuppliers) {
			const orderCount = supplierOrderCounts[supplier.id] || 0;
			if (orderCount > maxOrders) {
				maxOrders = orderCount;
				topSupplier = supplier;
			}
		}

		return {
			totalOrders: orders.length,
			pendingOrdersCount,
			ordersByStatus,
			recentOrders,
			totalStock,
			valueOfStock,
			ProductsUnderStock,
			suppliers: allSuppliers,
			topSupplier: topSupplier ? {
				id: topSupplier.id,
				name: topSupplier.name,
				orderCount: maxOrders
			} : null
		};
	} catch (error) {
		throw new ServiceError(
			'Dashboard statistics could not be loaded',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error instanceof Error ? error.message : error } }
		);
	}
};
