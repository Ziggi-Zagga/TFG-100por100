import type { PageServerLoad, Actions } from './$types';
import {
	getSectionWithRows,
	getwarehouseWithSections,
	createRow,
	deleteRowById
} from '$lib/server/services/warehouse.service';
import { error, redirect, fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const warehousesId = params.warehousesId;
	const sectionId = params.sectionId;

	if (!warehousesId || !sectionId) {
		throw error(400, 'Missing warehouse or section ID');
	}

	const { warehouse, sections } = await getwarehouseWithSections(warehousesId);
	const { rows } = await getSectionWithRows(sectionId);

	if (!warehouse || !sections) {
		throw error(404, 'warehouse or section not found');
	}

	const currentSection = sections.find(s => s.id === sectionId);

	if (!currentSection) {
		throw error(404, 'Section not found');
	}

	return {
		warehouse,
		sections,
		currentSection,
		rows
	};
};

export const actions: Actions = {
	create: async ({ request, params }) => {
		const warehousesId = params.warehousesId;
		const sectionId = params.sectionId;

		if (!warehousesId || !sectionId) {
			return fail(400, { message: 'Missing warehouse or section ID' });
		}

		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';

		try {
			await createRow({ sectionId, name });
			throw redirect(303, `/dashboard/warehouses/${warehousesId}/${sectionId}`);
		} catch (error) {
			console.error('Create row failed:', error);
			return fail(500, { message: 'Failed to create row' });
		}
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { error: 'Missing row ID' });

		try {
			await deleteRowById(id);
			return { success: true };
		} catch (err) {
			console.error('Delete row failed:', err);
			return fail(500, { error: 'Failed to delete row' });
		}
	}
};
