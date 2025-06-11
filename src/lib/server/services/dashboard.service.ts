import { getAllOrders } from '$lib/server/db/repositories/orders.repository';

/**
 * Obtiene las estadísticas del dashboard
 */
export const getDashboardStats = async () => {
	try {
		// Obtener todas las órdenes con sus detalles
		const orders = await getAllOrders();

		// Contar las órdenes por estado
		const ordersByStatus = orders.reduce(
			(acc: Record<string, number>, order: any) => {
				const status = (order.status || 'PENDING').toUpperCase();
				acc[status] = (acc[status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		// Obtener el conteo específico de órdenes pendientes
		const pendingOrdersCount = ordersByStatus['PENDING'] || 0;

		// Obtener las últimas órdenes para mostrar en el dashboard
		const recentOrders = orders
			.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
			.slice(0, 5);

		return {
			totalOrders: orders.length,
			pendingOrdersCount, // Añadimos el conteo específico de órdenes pendientes
			ordersByStatus,
			recentOrders
		}; // Puedes agregar más estadísticas según sea necesario
	} catch (error) {
		console.error('Error al obtener las estadísticas del dashboard:', error);
		throw new Error('No se pudieron cargar las estadísticas del dashboard');
	}
};
