import {
	getRowWithGaps,
	getSectionWithRows,
	createGap,
	deleteGapById,
	updateGap,
	getwarehouseWithSections
} from '$lib/server/services/warehouse.service';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { ERROR_TYPES, ServiceError } from '$lib/utils/errors/ServiceError';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const warehousesId = params.warehousesId;
        const sectionId = params.sectionId;
        const rowId = params.rowId;

        
        if (!warehousesId) return fail(400, { message: 'Missing warehouse ID' });
        if (!sectionId) return fail(400, { message: 'Missing section ID' });
        if (!rowId) return fail(400, { message: 'Missing row ID' });

        // Obtener datos de la sección con sus filas
		const warehouse = await getwarehouseWithSections(warehousesId);
        const data = await getSectionWithRows(sectionId);
        const row = await getRowWithGaps(rowId);
        if (!row.row) return fail(404, { message: 'Row not found' });

        // Devolver los datos en el formato esperado
        return {
            warehouse: warehouse.warehouse,
            sections: warehouse.sections,
            row: row.row,
            gaps: row.gaps,
            }
        }
    catch (error) {
        console.error('Error loading section data:', error);
        return fail(500, { 
            message: 'Error loading section data',
            warehouse: null,
            sections: null,
            row: null,
            gaps: null
        });
    }
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		try {
			const formData = await request.formData();
			const rowId = params.rowId;
			
			if (!rowId) {
				return fail(400, { 
					message: 'row ID is required', 
					field: 'rowId' 
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

			const newGap = await createGap({ 
				rowId,
				name, 
				capacity: Number(formData.get('capacity')) || undefined, 
				description: description || undefined 
			});
			
			return { 
				success: true,
				gap: newGap
			};
		} catch (error) {
			console.error('Error creating gap:', error);
			if (error instanceof ServiceError) {
				const status = error.type === ERROR_TYPES.VALIDATION ? 400 : 500;
				return fail(status, { 
					message: error.message, 
					field: error.field 
				});
			}
			return fail(500, { 
				message: 'Error creating gap. Please try again.' 
			});
		}
	},

	update: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id')?.toString()?.trim();
			const name = formData.get('name')?.toString()?.trim() || '';
			const capacity = Number(formData.get('capacity')) || undefined;
			const description = formData.get('description')?.toString()?.trim() || '';

			if (!id) {
				return fail(400, { message: 'Gap ID not provided' });
			}
 
			const updateData = {
				name,
				capacity,
				description
			};

			await updateGap(id, updateData);
			
			return { 
				success: true, 
			};
		} catch (error) {
			if (error instanceof ServiceError) {
				return fail(400, {
					message: error.message,
					field: error.field
				});
			}
			return fail(500, { message: 'Error updating gap' });
		}
	},

	delete: async ({ request }) => {
		try {
			const formData = await request.formData();
			const id = formData.get('id')?.toString();
			
			if (!id) {
				return fail(400, { message: 'Gap ID not provided' });
			}

			await deleteGapById(id);
			return { 
				success: true,
			};
		} catch (error) {
			if (error instanceof ServiceError) {
				const status = error.type === ERROR_TYPES.NOT_FOUND ? 404 : 400;
				return fail(status, {
					message: error.message,
				});
			}
			return fail(500, {
				message: 'Error deleting gap'
			});
		}
	}
};