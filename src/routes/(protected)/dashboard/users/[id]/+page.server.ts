import type { PageServerLoad, Actions } from './$types';
import { getOrdersByUser } from '$lib/server/services/orders.service';
import { getInventoryHistoryByUserId } from '$lib/server/services/inventoryHistory.service';
import {
	deletePermanently,
	getRoles,
	getUserById,
	updateUser
} from '$lib/server/services/users.service';

export const load: PageServerLoad = async ({ params }) => {
	const { id } = params;

	const user = await getUserById(id);
	const roles = await getRoles();
	const orders = await getOrdersByUser(id);
	const inventoryHistory = await getInventoryHistoryByUserId(id);

	return {
		user,
		roles,
		orders,
		inventoryHistory
	};
};

export const actions: Actions = {
	update: async ({ request, params }) => {
		const formData = await request.formData();
		const { id } = params;

		const data = {
			id: formData.get('id')?.toString() ?? '',
			username: formData.get('username')?.toString() ?? '',
			email: formData.get('email')?.toString() ?? '',
			roleId: formData.get('role')?.toString() ?? ''
		};

		await updateUser(id, data);
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString() ?? '';

		await deletePermanently(id);

		return { success: true };
	}
};
