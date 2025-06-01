import { getwarehouse, createwarehouse, updatewarehouse, deletewarehouseById } from '$lib/server/services/warehouse.service';
import { ServiceError } from '$lib/utils/errors/ServiceError';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const warehouse = await getwarehouse();
	return { warehouse };
};

export const actions: Actions = {
	create: async ({ request }) => {
		try {
			const formData = await request.formData();
			const name = formData.get('name')?.toString() ?? '';
			const location = formData.get('location')?.toString() ?? '';
			const description = formData.get('description')?.toString() ?? '';
			
			if (!name || !location) {
				return fail(400, { message: 'Name and location are required' });
			}

			const newwarehouse = await createwarehouse({ name, location, description });
			return { warehouse: newwarehouse, success: true };
		} catch (error) {
			return fail(500, { message: 'Failed to create warehouse' });
		}
	},

	update: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id')?.toString();
			const name = formData.get('name')?.toString().trim() || '';
			const location = formData.get('location')?.toString().trim() || '';
			const description = formData.get('description')?.toString().trim() || '';
			if (!id) {
				return fail(400, { message: 'ID is required' });
			}

			const updateData: { id: string; name: string; location: string; description?: string } = { 
				id: id, 
				name, 
				location,
			};
			
			if (description) {
				updateData.description = description;
			}

			const updatedwarehouse = await updatewarehouse(id, updateData);
			return { success: true, warehouse: updatedwarehouse };
		} catch (error) {
			return fail(500, { 
				message: error instanceof Error ? error.message : 'Update failed',
			});
		}
	},

	delete: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id')?.toString();
	
			if (!id) {
				return fail(400, { message: 'Warehouse ID is required' });
			}
	
			await deletewarehouseById(id);
			return { success: true };
		} catch (error) {
			console.error('Error deleting warehouse:', error);
			return fail(500, { 
				message: error instanceof Error ? error.message : 'Failed to delete warehouse' 
			});
		}
	},

	list: async () => {
		try {
			console.log('Fetching warehouse list...');
			const warehouse = await getwarehouse();
			console.log('warehouse found:', warehouse?.length || 0);
			return { 
				warehouse: warehouse.map(warehouse => ({
					id: warehouse.id,
					name: warehouse.name,
					location: warehouse.location,
					description: warehouse.description || null
				}))
			};
		} catch (error) {
			console.error('Error listing warehouse:', error);
			return { warehouse: [] };
		}
	}
};
