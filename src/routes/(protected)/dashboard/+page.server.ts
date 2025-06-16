import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getDashboardStats } from '$lib/server/services/dashboard.service';



export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/onboarding/login');
	}
	const userName = locals.user.username;
	
	const dashboardStats = await getDashboardStats();
	

	const metrics = [
		{
			title: 'Top Supplier',
			value: dashboardStats.topSupplier ? 
				`${dashboardStats.topSupplier.name}` : 
				'No supplier data',
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

	const productsUnderMinStock = dashboardStats.ProductsUnderStock
		.filter(item => (item.quantity || 0) < (item.reorderQuantity || 0))
		.map(item => ({
			name: item.name,
			sku: item.code,
			currentStock: item.quantity || 0,
			minStock: item.minQuantity || 0,
			reorderQuantity: item.reorderQuantity || 0,
			warehouse: item.location || 'N/A'
		}))
		.sort((a, b) => (a.currentStock || 0) - (b.currentStock || 0));

	const topProducts = dashboardStats.ProductsUnderStock.map(item => ({
		name: item.name,
		sku: item.code,
		currentStock: item.quantity || 0,
		minStock: item.minQuantity || 0,
		reorderQuantity: item.reorderQuantity || 0,
		warehouse: item.location || 'N/A'
	}));

	const stockChart = [
		{ month: 'Jan', stock: 300, incidents: 45 },
		{ month: 'Feb', stock: 280, incidents: 50 },
		{ month: 'Mar', stock: 310, incidents: 32 },
		{ month: 'Apr', stock: 290, incidents: 29 }
	];

	const financeByMonth = [
		{ month: 'Jan', revenue: 4500, expenses: 3900 },
		{ month: 'Feb', revenue: 2200, expenses: 3400 },
		{ month: 'Mar', revenue: 5500, expenses: 4800 },
		{ month: 'Apr', revenue: 2100, expenses: 1500 },
		{ month: 'May', revenue: 3200, expenses: 1700 }
	];


	return {
		userName,
		metrics,
		topProducts,
		financeByMonth,
		productsUnderMinStock,
	};
};
