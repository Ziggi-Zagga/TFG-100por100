import * as prod from '../db/repositories/products.repository';
import * as manufac from '../db/repositories/manufacturers.repository';
import * as categories from '../db/repositories/category.repository';
import * as supp from '../db/repositories/supplier.repository';
import * as inv from '../db/repositories/inventory.repository';
import * as orders from '../db/repositories/orders.repository';
import crypto from 'crypto';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';

export const getAllProducts = async () => {
	return await prod.getAllProducts();
};

export const getFullProductsList = async () => {
	return await prod.getFullProductsList();
};

export const getProductFromInventoryById = async (id: string) => {
	return await inv.repoGetInventoryWithFullLocationByProductId(id);
};

export const getOrderItemsByProductId = async (productId: string) => {
	return await orders.getOrderItemsByProductId(productId);
};
export const getAllCategories = async () => {
	return await categories.getAllCategories();
};

export const getIdNameCategory = async () => {
	return await categories.getIdNameCategory();
};

export const getCategoriesById = async (id: string) => {
	return await categories.getCategoriesById(id);
};

export const getAllManufacturers = async () => {
	return await manufac.getAllManufacturers();
};

export const getIdNameManufacturer = async () => {
	return await manufac.getIdNameManufacturer();
};

export const getManufacturersById = async (id: string) => {
	return await manufac.getManufacturersById(id);
};

export const getAllSuppliers = async () => {
	return await supp.getAllSuppliers();
};

export const getIdNameSupplier = async () => {
	return await supp.getIdNameSupplier();
};

export const getSuppliersById = async (id: string) => {
	return await supp.getSuppliersById(id);
};

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
		throw new ServiceError('Product code is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'code'
		});
	}
	if (!name) {
		throw new ServiceError('Product name is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'name'
		});
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
		active: true,
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

export const updateProduct = async ({
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
	active,
	updatedAt = new Date()
}: {
	id: string;
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
	active?: boolean;
	updatedAt?: Date;
}) => {
	if (!id) {
		throw new ServiceError('Product ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}
	if (!code) {
		throw new ServiceError('Product code is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'code'
		});
	}
	if (!name) {
		throw new ServiceError('Product name is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'name'
		});
	}

	await prod.updateProduct({
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
		active: active ?? false,
		updatedAt
	});

	return { id };
};

export const deleteOrderItemFromProductId = async (productId: string) => {
	await orders.deleteOrderItemFromProductId(productId);
};

