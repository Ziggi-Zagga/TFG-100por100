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
		throw new ServiceError('warehouse ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'warehouseId' });
	}
	return await repo.getwarehouseAndSections(warehouseId);
};

export const getSectionWithRows = async (sectionId: string) => {
	if (!sectionId) {
		throw new ServiceError('Section ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'sectionId' });
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
		throw new ServiceError('warehouse name is required', ERROR_TYPES.VALIDATION, 400, { field: 'name' });
	}
	if (!location) {
		throw new ServiceError('Location is required', ERROR_TYPES.VALIDATION, 400, { field: 'location' });
	}

	const id = crypto.randomUUID();
	await repo.insertwarehouse({ id, name, location, description });
	return { id };
};

export const createSection = async ({
	warehouseId,
	name,
	description
}: {
	warehouseId: string;
	name: string;
	description?: string;
}) => {
	if (!warehouseId) {
		throw new ServiceError('warehouse ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'warehouseId' });
	}
	if (!name) {
		throw new ServiceError('Section name is required', ERROR_TYPES.VALIDATION, 400, { field: 'name' });
	}

	const id = crypto.randomUUID();
	await repo.insertSection({ id, warehouseId, name, description });
	return { id };
};

export const createRow = async ({
	sectionId,
	name
}: {
	sectionId: string;
	name: string;
}) => {
	if (!sectionId) {
		throw new ServiceError('Section ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'sectionId' });
	}
	if (!name) {
		throw new ServiceError('Row name is required', ERROR_TYPES.VALIDATION, 400, { field: 'name' });
	}

	const id = crypto.randomUUID();
	await repo.insertRow({ id, sectionId, name });
	return { id };
};

export const createGap = async ({
	rowId,
	name,
	capacity,
	notes
}: {
	rowId: string;
	name: string;
	capacity?: number;
	notes?: string;
}) => {
	if (!rowId) {
		throw new ServiceError('Row ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'rowId' });
	}
	if (!name) {
		throw new ServiceError('Gap name is required', ERROR_TYPES.VALIDATION, 400, { field: 'name' });
	}

	const id = crypto.randomUUID();
	await repo.insertGap({ id, rowId, name, capacity, notes });
	return { id };
};

export const updatewarehouse = async (id: string, data: 
	{ name: string; location?: string | null; description?: string | null }) => {
	if (!id) {
		throw new ServiceError('warehouse ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}
	if (!data.name) {
		throw new ServiceError('warehouse name is required', ERROR_TYPES.VALIDATION, 400, { field: 'name' });
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
	if (!id) {
		throw new ServiceError('warehouse ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}
	await repo.removewarehouse(id);
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
