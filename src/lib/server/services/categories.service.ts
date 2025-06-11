import {
	getAllCategories,
	insertCategory,
	repoDeleteCategory,
	repoUpdateCategory
} from '$lib/server/db/repositories/category.repository';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';

export const getCategoriesData = async () => {
	return await getAllCategories();
};

export const createCategory = async ({
	name,
	description,
	parentId
}: {
	name: string;
	description: string;
	parentId?: string | null;
}) => {
	if (!name) {
		throw new ServiceError('Category name is required', ERROR_TYPES.VALIDATION, 400, {
			field: 'name'
		});
	}
	const id = crypto.randomUUID();
	return await insertCategory({
		id,
		name,
		description,
		parentId
	});
};

export const deleteCategory = async (id: string) => {
	if (!id) {
		throw new ServiceError('Category ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}
	return await repoDeleteCategory(id);
};

export const updateCategory = async ({
	id,
	name,
	description,
	parentId
}: {
	id: string;
	name: string;
	description: string;
	parentId?: string | null;
}) => {
	if (!id) {
		throw new ServiceError('Category ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}
	return await repoUpdateCategory({
		id,
		name,
		description,
		parentId
	});
};
