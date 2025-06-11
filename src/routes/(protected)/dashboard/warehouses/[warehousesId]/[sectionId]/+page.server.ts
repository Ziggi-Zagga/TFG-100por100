import {
	getSectionWithRows,
	createRow,
	deleteRowById,
	updateRow,
	getwarehouseWithSections
} from '$lib/server/services/warehouse.service';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { ERROR_TYPES, ServiceError } from '$lib/utils/errors/ServiceError';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const warehousesId = params.warehousesId;
		const sectionId = params.sectionId;

		if (!warehousesId) return fail(400, { message: 'Missing warehouse ID' });
		if (!sectionId) return fail(400, { message: 'Missing section ID' });

		// Obtener datos de la sección con sus filas
		const warehouse = await getwarehouseWithSections(warehousesId);
		const data = await getSectionWithRows(sectionId);
		if (!data.section) return fail(404, { message: 'Section not found' });

		// Devolver los datos en el formato esperado
		return {
			warehouse: warehouse.warehouse,
			sections: warehouse.sections,
			currentSection: {
				...data.section,
				rows: data.rows || []
			}
		};
	} catch (error) {
		console.error('Error loading section data:', error);
		return fail(500, {
			message: 'Error loading section data',
			warehouse: null,
			currentSection: null
		});
	}
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		try {
			const formData = await request.formData();
			const sectionId = params.sectionId;

			if (!sectionId) {
				return fail(400, {
					message: 'Section ID is required',
					field: 'sectionId'
				});
			}

			const name = formData.get('name')?.toString()?.trim() || '';
			const location = formData.get('location')?.toString()?.trim() || '';
			const description = formData.get('description')?.toString()?.trim() || '';

			if (!name) {
				return fail(400, {
					message: 'Row name is required',
					field: 'name'
				});
			}

			const newRow = await createRow({
				sectionId,
				name,
				location: location || undefined,
				description: description || undefined
			});

			return {
				success: true,
				row: newRow
			};
		} catch (error) {
			console.error('Error creating row:', error);
			if (error instanceof ServiceError) {
				const status = error.type === ERROR_TYPES.VALIDATION ? 400 : 500;
				return fail(status, {
					message: error.message,
					field: error.field
				});
			}
			return fail(500, {
				message: 'Error creating row. Please try again.'
			});
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
				return fail(400, { message: 'Row ID not provided' });
			}

			const updateData = {
				name,
				location,
				description
			};

			await updateRow(id, updateData);

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
			return fail(500, { message: 'Error updating row' });
		}
	},

	delete: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id')?.toString();

			if (!id) {
				return fail(400, { message: 'Row ID not provided' });
			}

			await deleteRowById(id);
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
				message: 'Error deleting row'
			});
		}
	}
};
