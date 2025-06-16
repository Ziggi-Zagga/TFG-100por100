import * as repo from '../db/repositories/supplier.repository';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';

export const getAllSuppliers = async () => {
	try {
		return await repo.getAllSuppliers();
	} catch (error) {
		throw new ServiceError('Failed to fetch suppliers', ERROR_TYPES.DATABASE, 500, {
			details: { originalError: error as Error }
		});
	}
};

export const getSupplierById = async (id: string) => {
	try {
		if (!id) {
			throw new ServiceError('Supplier ID is required', ERROR_TYPES.VALIDATION, 400, {
				field: 'id'
			});
		}

		const supplier = await repo.getSuppliersById(id);
		if (!supplier) {
			throw new ServiceError('Supplier not found', ERROR_TYPES.NOT_FOUND, 404, { field: 'id' });
		}

		return supplier;
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError('Failed to fetch supplier', ERROR_TYPES.DATABASE, 500, {
			details: { originalError: error as Error, supplierId: id }
		});
	}
};

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
	try {
		if (!name) {
			throw new ServiceError('Supplier name is required', ERROR_TYPES.VALIDATION, 400, {
				field: 'name'
			});
		}

		return await repo.createSupplier({
			name,
			contactPerson,
			email,
			phone,
			website,
			notes
		});
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError('Failed to create supplier', ERROR_TYPES.DATABASE, 500, {
			details: { originalError: error as Error, name, email }
		});
	}
};

export const updateSupplier = async (
	id: string,
	{
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
	}
) => {
	try {
		if (!id) {
			throw new ServiceError('Supplier ID is required', ERROR_TYPES.VALIDATION, 400, {
				field: 'id'
			});
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
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError('Failed to update supplier', ERROR_TYPES.DATABASE, 500, {
			details: { originalError: error as Error, supplierId: id }
		});
	}
};

export const deleteSupplier = async (id: string) => {
	try {
		if (!id) {
			throw new ServiceError('Supplier ID is required', ERROR_TYPES.VALIDATION, 400, {
				field: 'id'
			});
		}

		const supplier = await repo.getSuppliersById(id);
		if (!supplier) {
			throw new ServiceError('Supplier not found', ERROR_TYPES.NOT_FOUND, 404, { field: 'id' });
		}

		return await repo.deleteSupplier(id);
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError('Failed to delete supplier', ERROR_TYPES.DATABASE, 500, {
			details: { originalError: error as Error, supplierId: id }
		});
	}
};
