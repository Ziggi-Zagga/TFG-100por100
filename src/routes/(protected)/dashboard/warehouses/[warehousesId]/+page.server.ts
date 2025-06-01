import {
	getwarehouseWithSections,
	createSection,
	deleteSectionById
} from '$lib/server/services/warehouse.service';
import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const warehousesId = params.warehousesId;
	if (!warehousesId) throw fail(400, { message: 'Missing warehouse ID' });

	const data = await getwarehouseWithSections(warehousesId);
	if (!data.warehouse) throw fail(404, { message: 'warehouse not found' });

	return {
		warehouse: data.warehouse,
		sections: data.sections
	};
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		const warehousesId = params.warehousesId;
		if (!warehousesId) return fail(400, { message: 'Missing warehouse ID' });

		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const description = formData.get('description')?.toString() ?? '';

		try {
			await createSection({ warehouseId: warehousesId, name, description });
			throw redirect(303, `/dashboard/warehouses/${warehousesId}`);
		} catch (error) {
			console.error('Create section failed:', error);
			return fail(500, { message: 'Failed to create section' });
		}
	},

	delete: async ({ request, params }) => {
		const warehousesId = params.warehousesId;
		if (!warehousesId) return fail(400, { message: 'Missing warehouse ID' });

		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) return fail(400, { message: 'Missing section ID' });

		try {
			await deleteSectionById(id);
			return { success: true };
		} catch (error) {
			console.error('Delete section failed:', error);
			return fail(500, { message: 'Failed to delete section' });
		}
	}
};
