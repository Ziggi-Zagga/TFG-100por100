import * as repo from '../db/repositories/manufacturers.repository';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';

export const getAllManufacturers = async () => {
    return await repo.getAllManufacturers();
}

export const getManufacturerById = async (id: string) => {
    if (!id) {
        throw new ServiceError('Manufacturer ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
    }
    return await repo.getManufacturersById(id);
}

export const createManufacturer = async ({
    name,
    description
}: {
    name: string;
    description?: string;
}) => {
    if (!name) {
        throw new ServiceError('Manufacturer name is required', ERROR_TYPES.VALIDATION, 400, { field: 'name' });
    }

    return await repo.createManufacturer({
        name,
        description
    });
}

export const updateManufacturer = async (id: string, {
    name,
    description
}: {
    name?: string;
    description?: string;
}) => {
    if (!id) {
        throw new ServiceError('Manufacturer ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
    }

    const manufacturer = await repo.getManufacturersById(id);
    if (!manufacturer) {
        throw new ServiceError('Manufacturer not found', ERROR_TYPES.NOT_FOUND, 404, { field: 'id' });
    }

    return await repo.updateManufacturer(id, {
        name,
        description
    });
}

export const deleteManufacturer = async (id: string) => {
    if (!id) {
        throw new ServiceError('Manufacturer ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
    }

    const manufacturer = await repo.getManufacturersById(id);
    if (!manufacturer) {
        throw new ServiceError('Manufacturer not found', ERROR_TYPES.NOT_FOUND, 404, { field: 'id' });
    }

    return await repo.deleteManufacturer(id);
}
