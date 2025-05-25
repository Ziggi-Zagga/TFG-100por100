import * as repo from '../db/repositories/supplier.repository';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';

export const getAllSuppliers = async () => {
    return await repo.getAllSuppliers();
}

export const getSupplierById = async (id: string) => {
    if (!id) {
        throw new ServiceError('Supplier ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
    }
    return await repo.getSuppliersById(id);
}

export const createSupplier = async ({
    name,
    contactPerson,
    email,
    phone,
    website,
    notes
}: {
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    website?: string;
    notes?: string;
}) => {
    if (!name) {
        throw new ServiceError('Supplier name is required', ERROR_TYPES.VALIDATION, 400, { field: 'name' });
    }

    return await repo.createSupplier({
        name,
        contactPerson,
        email,
        phone,
        website,
        notes
    });
}

export const updateSupplier = async (id: string, {
    name,
    contactPerson,
    email,
    phone,
    website,
    notes
}: {
    name?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    website?: string;
    notes?: string;
}) => {
    if (!id) {
        throw new ServiceError('Supplier ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
    }

    const supplier = await repo.getSuppliersById(id);
    if (!supplier) {
        throw new ServiceError('Supplier not found', ERROR_TYPES.NOT_FOUND, 404, { field: 'id' });
    }

    return await repo.updateSupplier(id, {
        name,
        contactPerson,
        email,
        phone,
        website,
        notes
    });
}

export const deleteSupplier = async (id: string) => {
    if (!id) {
        throw new ServiceError('Supplier ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
    }

    const supplier = await repo.getSuppliersById(id);
    if (!supplier) {
        throw new ServiceError('Supplier not found', ERROR_TYPES.NOT_FOUND, 404, { field: 'id' });
    }

    return await repo.deleteSupplier(id);
}