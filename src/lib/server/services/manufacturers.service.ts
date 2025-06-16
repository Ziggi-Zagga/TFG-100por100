import * as repo from '../db/repositories/manufacturers.repository';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';

export const getAllManufacturers = async () => {
	try {
		return await repo.getAllManufacturers();
	} catch (error) {
		throw new ServiceError(
			'Failed to fetch manufacturers',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error } }
		);
	}
};

export const getManufacturerById = async (id: string) => {
	try {
		if (!id) {
			throw new ServiceError('Manufacturer ID is required', ERROR_TYPES.VALIDATION, 400, {
				field: 'id'
			});
		}

		const manufacturer = await repo.getManufacturersById(id);
		if (!manufacturer) {
			throw new ServiceError('Manufacturer not found', ERROR_TYPES.NOT_FOUND, 404, { field: 'id' });
		}

		return manufacturer;
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError(
			'Failed to fetch manufacturer',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error, manufacturerId: id } }
		);
	}
};

export const createManufacturer = async ({
	name,
	description
}: {
	name: string;
	description?: string;
}) => {
	try {
		if (!name) {
			throw new ServiceError('Manufacturer name is required', ERROR_TYPES.VALIDATION, 400, {
				field: 'name'
			});
		}

		return await repo.createManufacturer({
			name,
			description
		});
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError(
			'Failed to create manufacturer',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error, name } }
		);
	}
};

export const updateManufacturer = async (
	id: string,
	{
		name,
		description
	}: {
		name?: string;
		description?: string;
	}
) => {
	try {
		if (!id) {
			throw new ServiceError('Manufacturer ID is required', ERROR_TYPES.VALIDATION, 400, {
				field: 'id'
			});
		}

		const manufacturer = await repo.getManufacturersById(id);
		if (!manufacturer) {
			throw new ServiceError('Manufacturer not found', ERROR_TYPES.NOT_FOUND, 404, { field: 'id' });
		}

		return await repo.updateManufacturer(id, {
			name,
			description
		});
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError(
			'Failed to update manufacturer',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error, manufacturerId: id } }
		);
	}
};

export const deleteManufacturer = async (id: string) => {
	try {
		if (!id) {
			throw new ServiceError('Manufacturer ID is required', ERROR_TYPES.VALIDATION, 400, {
				field: 'id'
			});
		}

		const manufacturer = await repo.getManufacturersById(id);
		if (!manufacturer) {
			throw new ServiceError('Manufacturer not found', ERROR_TYPES.NOT_FOUND, 404, { field: 'id' });
		}

		return await repo.deleteManufacturer(id);
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError(
			'Failed to delete manufacturer',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error, manufacturerId: id } }
		);
	}
};
