import * as prod from '../db/repositories/products.repository';
import * as manufac from '../db/repositories/manufacturers.repository';
import * as supp from '../db/repositories/supplier.repository';
import crypto from 'crypto';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';

export const getAllProducts = async () => {
    return await prod.getAllProducts();
}

export const getFullProductsList = async () => {
    return await prod.getFullProductsList();
}

export const getAllManufacturers = async () => {
    return await manufac.getAllManufacturers();
}

export const getAllSuppliers = async () => {
    return await supp.getAllSuppliers();
}

export const createProduct = async ({
	code,
	name,
	description,
	supplier_id,
	manufacturer_id,
	category_id,
	price,
	unit,
	dimensions,
	material,
	specifications
}: {
	code: string;
	name: string;
	description?: string;
	supplier_id?: string;
	manufacturer_id?: string;
	category_id?: string;
	price?: number;
	unit?: string;
	dimensions?: string;
	material?: string;
	specifications?: string;
}) => {
	if (!code) {
		throw new ServiceError('Product code is required', ERROR_TYPES.VALIDATION, 400, { field: 'code' });
	}
	if (!name) {
		throw new ServiceError('Product name is required', ERROR_TYPES.VALIDATION, 400, { field: 'name' });
	}

	const id = crypto.randomUUID();

	await prod.insertProduct({
		id,
		code,
		name,
		description,
		supplier_id,
		manufacturer_id,
		category_id,
		price,
		unit,
		dimensions,
		material,
		specifications,
		active: false
	});

	return { id };
};