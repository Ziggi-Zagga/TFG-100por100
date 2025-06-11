import * as repo from '../db/repositories/warehouse.repository';
import crypto from 'crypto';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';

export const getwarehouseTree = async () => {
	return await repo.getFullwarehouseTree();
};

export const getwarehouse = async () => {
	return await repo.getAllwarehouse();
};

export const getwarehouseWithSections = async (warehouseId: string) => {
	if (!warehouseId) {
		throw new ServiceError('warehouse ID is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'warehouseId'
		});
	}
	return await repo.getwarehouseAndSections(warehouseId);
};

export const getSectionWithRows = async (sectionId: string) => {
	if (!sectionId) {
		throw new ServiceError('Section ID is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'sectionId'
		});
	}
	return await repo.getSectionAndRows(sectionId);
};

export const getRowWithGaps = async (rowId: string) => {
	if (!rowId) {
		throw new ServiceError('Row ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'rowId' });
	}
	return await repo.getRowAndGaps(rowId);
};

export const getGapById = async (gapId: string) => {
	if (!gapId) {
		throw new ServiceError('Gap ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'gapId' });
	}
	return await repo.getGap(gapId);
};

export const createwarehouse = async ({
	name,
	location,
	description
}: {
	name: string;
	location: string;
	description?: string;
}) => {
	if (!name) {
		throw new ServiceError('warehouse name is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'name'
		});
	}
	if (!location) {
		throw new ServiceError('Location is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'location'
		});
	}

	const id = crypto.randomUUID();
	await repo.insertwarehouse({ id, name, location, description });
	return { id };
};

export const createSection = async ({
	warehouseId,
	name,
	location,
	description
}: {
	warehouseId: string;
	name: string;
	location: string;
	description?: string;
}) => {
	if (!warehouseId) {
		throw new ServiceError('warehouse ID is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'warehouseId'
		});
	}
	if (!name) {
		throw new ServiceError('Section name is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'name'
		});
	}

	const id = crypto.randomUUID();
	await repo.insertSection({ id, warehouseId, location, name, description });
	return { id };
};

export const createRow = async ({
	sectionId,
	name,
	location,
	description
}: {
	sectionId: string;
	name: string;
	location?: string;
	description?: string;
}) => {
	if (!sectionId) {
		throw new ServiceError('Section ID is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'sectionId'
		});
	}
	if (!name) {
		throw new ServiceError('Row name is required', ERROR_TYPES.VALIDATION, 400, { field: 'name' });
	}

	const id = crypto.randomUUID();
	await repo.insertRow({ id, sectionId, name, location, description });
	return { id };
};

export const createGap = async ({
	rowId,
	name,
	capacity,
	description
}: {
	rowId: string;
	name: string;
	capacity?: number;
	description?: string;
}) => {
	if (!rowId) {
		throw new ServiceError('Row ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'rowId' });
	}
	if (!name) {
		throw new ServiceError('Gap name is required', ERROR_TYPES.VALIDATION, 400, { field: 'name' });
	}

	const id = crypto.randomUUID();
	await repo.insertGap({ id, rowId, name, capacity, description });
	return { id };
};

export const updatewarehouse = async (
	id: string,
	data: { name: string; location?: string | null; description?: string | null }
) => {
	if (!id) {
		throw new ServiceError('warehouse ID is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'id'
		});
	}
	if (!data.name) {
		throw new ServiceError('warehouse name is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'name'
		});
	}

	return await repo.updatewarehouse(id, {
		warehouseId: id,
		updatedData: {
			name: data.name,
			location: data.location,
			description: data.description
		}
	});
};

export const deletewarehouseById = async (id: string) => {
	try {
		const sections = await repo.getSectionsByWarehouseId(id);
		if (sections.length > 0) {
			throw new ServiceError(
				'Cannot delete warehouse with existing sections',
				ERROR_TYPES.VALIDATION,
				400
			);
		}

		await repo.removewarehouse(id);
		return { success: true };
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError('Failed to delete warehouse', ERROR_TYPES.DATABASE, 500, {
			details: { message: (error as Error).message }
		});
	}
};

export const deleteSectionById = async (id: string) => {
	if (!id) {
		throw new ServiceError('Missing section ID', ERROR_TYPES.VALIDATION, 400);
	}
	await repo.removeSection(id);
};

export const deleteRowById = async (id: string) => {
	if (!id) {
		throw new ServiceError('Missing row ID', ERROR_TYPES.VALIDATION, 400);
	}
	await repo.removeRow(id);
};

export const deleteGapById = async (id: string) => {
	if (!id) {
		throw new ServiceError('Missing gap ID', ERROR_TYPES.VALIDATION, 400);
	}
	await repo.removeGap(id);
};

export const updateSection = async (
	id: string,
	data: { name: string; location?: string | null; description?: string | null }
) => {
	if (!id) {
		throw new ServiceError('Section ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}
	if (!data.name) {
		throw new ServiceError('Section name is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'name'
		});
	}

	try {
		const result = await repo.updateSection(id, {
			name: data.name,
			location: data.location ?? null,
			description: data.description ?? null
		});
		return result;
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw error;
	}
};

export const updateRow = async (
	id: string,
	data: { name: string; location?: string | null; description?: string | null }
) => {
	if (!id) {
		throw new ServiceError('Row ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}
	if (!data.name) {
		throw new ServiceError('Row name is required', ERROR_TYPES.VALIDATION, 400, { field: 'name' });
	}

	const updatedRow = await repo.updateRow(id, {
		name: data.name,
		location: data.location ?? null,
		description: data.description ?? null
	});

	if (!updatedRow) {
		throw new ServiceError('Row not found', ERROR_TYPES.NOT_FOUND, 404);
	}

	return updatedRow;
};

export const updateGap = async (
	id: string,
	data: { name: string; capacity?: number | null; description?: string | null }
) => {
	if (!id) {
		throw new ServiceError('Gap ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}
	if (!data.name) {
		throw new ServiceError('Gap name is required', ERROR_TYPES.VALIDATION, 400, { field: 'name' });
	}

	const updatedGap = await repo.updateGap(id, {
		name: data.name,
		capacity: data.capacity ?? null,
		description: data.description ?? null
	});

	if (!updatedGap) {
		throw new ServiceError('Gap not found', ERROR_TYPES.NOT_FOUND, 404);
	}

	return updatedGap;
};
