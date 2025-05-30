import { getAllOrders } from '$lib/server/db/repositories/orders.repository';

/**
 * Obtiene las estadísticas del dashboard
 */
export const getDashboardStats = async () => {
  try {
    // Obtener todas las órdenes con sus detalles
    const orders = await getAllOrders();
    
    // Contar las órdenes por estado
    const ordersByStatus = orders.reduce((acc: Record<string, number>, order: any) => {
      const status = order.status || 'PENDING';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Obtener las últimas órdenes para mostrar en el dashboard
    const recentOrders = orders
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 5);

    return {
      totalOrders: orders.length,
      ordersByStatus,
      recentOrders,
      // Puedes agregar más estadísticas según sea necesario
    };
  } catch (error) {
    console.error('Error al obtener las estadísticas del dashboard:', error);
    throw new Error('No se pudieron cargar las estadísticas del dashboard');
  }
};

/**
 * Obtiene el conteo total de órdenes
 */
export const getTotalOrdersCount = async (): Promise<number> => {
  try {
    const orders = await getOrdersWithDetails();
    return orders.length;
  } catch (error) {
    console.error('Error al obtener el conteo de órdenes:', error);
    throw new Error('No se pudo obtener el conteo de órdenes');
  }
};

/**
 * Obtiene las órdenes recientes
 * @param limit Número máximo de órdenes a devolver (por defecto: 5)
 */
export const getRecentOrders = async (limit = 5): Promise<OrderWithDetails[]> => {
  try {
    const orders = await getOrdersWithDetails();
    return orders
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error('Error al obtener las órdenes recientes:', error);
    throw new Error('No se pudieron cargar las órdenes recientes');
  }
};