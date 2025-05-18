import * as prod from '../db/repositories/products.repository';
import * as manufac from '../db/repositories/manufacturers.repository';
import * as categories from '../db/repositories/category.repository';
import * as supp from '../db/repositories/supplier.repository';
import crypto from 'crypto';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';
import type { create } from 'domain';

export const getAllProducts = async () => {
    return await prod.getAllProducts();
}

export const getFullProductsList = async () => {
    return await prod.getFullProductsList();
}

export const getAllCategories = async () => {
	return await categories.getAllCategories();
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
	supplierId,
	manufacturerId,
	categoryId,
	price,
	unit,
	dimensions,
	material,
	specifications,
	createdAt = new Date(),
	updatedAt = new Date()
}: {
	code: string;
	name: string;
	description?: string;
	supplierId?: string;
	manufacturerId?: string;
	categoryId?: string;
	price?: number;
	unit?: string;
	dimensions?: string;
	material?: string;
	specifications?: string;
	createdAt?: Date;
	updatedAt?: Date;
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
		supplierId,
		manufacturerId,
		categoryId,
		price,
		unit,
		dimensions,
		material,
		specifications,
		active: false,
		createdAt,
		updatedAt
	});

	return { id };
};

export const deleteProductById = async (id: string) => {
	if (!id) {
		throw new ServiceError('Missing product ID', ERROR_TYPES.VALIDATION, 400);
	}
	await prod.removeProduct(id);
};