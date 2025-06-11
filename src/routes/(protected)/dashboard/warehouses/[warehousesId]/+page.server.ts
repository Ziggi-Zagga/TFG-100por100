import {
	getwarehouseWithSections,
	createSection,
	deleteSectionById,
	updateSection
} from '$lib/server/services/warehouse.service';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { ERROR_TYPES, ServiceError } from '$lib/utils/errors/ServiceError';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const warehousesId = params.warehousesId;
		if (!warehousesId) return fail(400, { message: 'Missing warehouse ID' });

		const data = await getwarehouseWithSections(warehousesId);
		if (!data.warehouse) return fail(404, { message: 'Warehouse not found' });

		return {
			warehouse: data.warehouse,
			sections: data.sections || []
		};
	} catch (error) {
		return {
			warehouse: null,
			sections: []
		};
	}
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		try {
			const formData = await request.formData();
			const warehousesId = params.warehousesId;
			const name = formData.get('name')?.toString()?.trim() || '';
			const location = formData.get('location')?.toString()?.trim() || '';
			const description = formData.get('description')?.toString()?.trim() || '';

			await createSection({ warehouseId: warehousesId, name, location, description });

			return {
				success: true
			};
		} catch (error) {
			if (error instanceof ServiceError) {
				return fail(400, { message: error.message, field: error.field });
			}
			return fail(500, { message: 'Error creating section. Please try again.' });
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
				return fail(400, { message: 'Section ID not provided' });
			}

			const updateData = {
				name,
				location,
				description
			};

			await updateSection(id, updateData);

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
			return fail(500, { message: 'Error updating section' });
		}
	},

	delete: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id')?.toString();

			if (!id) {
				return fail(400, { message: 'Section ID not provided' });
			}

			await deleteSectionById(id);
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
				message: 'Error deleting section'
			});
		}
	}
};
