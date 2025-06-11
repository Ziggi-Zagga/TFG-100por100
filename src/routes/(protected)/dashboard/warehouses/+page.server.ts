import {
	getwarehouse,
	createwarehouse,
	updatewarehouse,
	deletewarehouseById
} from '$lib/server/services/warehouse.service';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const warehouse = await getwarehouse();
		return { warehouse };
	} catch (error) {
		console.error('Error loading warehouses:', error);
		return { warehouse: [] };
	}
};

export const actions: Actions = {
	create: async ({ request }) => {
		try {
			const formData = await request.formData();
			const name = formData.get('name')?.toString()?.trim() || '';
			const location = formData.get('location')?.toString()?.trim() || '';
			const description = formData.get('description')?.toString()?.trim() || '';

			await createwarehouse({ name, location, description });

			return {
				success: true
			};
		} catch (error) {
			if (error instanceof ServiceError) {
				return fail(400, { message: error.message, field: error.field });
			}
			return fail(500, { message: 'Error creating warehouse. Please try again.' });
		}
	},

	update: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id')?.toString()?.trim();
			const name = formData.get('name')?.toString()?.trim() || '';
			const location = formData.get('location')?.toString()?.trim() || '';
			const description = formData.get('description')?.toString()?.trim() || '';

			if (!id) {
				return fail(400, { message: 'Warehouse ID not provided' });
			}

			const updateData = {
				name,
				location,
				description: description || null
			};

			await updatewarehouse(id, updateData);

			return {
				success: true
			};
		} catch (error) {
			if (error instanceof ServiceError) {
				return fail(400, {
					message: error.message,
					field: error.field
				});
			}
			return fail(500, { message: 'Error updating warehouse' });
		}
	},

	delete: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id')?.toString();

			if (!id) {
				return fail(400, { message: 'Warehouse ID not provided' });
			}

			await deletewarehouseById(id);
			return {
				success: true
			};
		} catch (error) {
			if (error instanceof ServiceError) {
				const status = error.type === ERROR_TYPES.NOT_FOUND ? 404 : 400;
				return fail(status, {
					message: error.message
				});
			}
			return fail(500, {
				message: 'Error deleting warehouse'
			});
		}
	}
};
