import * as repo from '../db/repositories/users.repository';
import crypto from 'crypto';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';

// Obtener todos los usuarios activos
export const getUsers = async () => {
	try {
		return await repo.getAllUsers();
	} catch (error) {
		throw new ServiceError(
			'Failed to fetch users',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error } }
		);
	}
};

// Obtener usuario por ID
export const getUserById = async (id: string) => {
	try {
		if (!id) {
			throw new ServiceError('User ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
		}
		const user = await repo.getUserById(id);
		if (!user || user.length === 0) {
			throw new ServiceError('User not found', ERROR_TYPES.NOT_FOUND, 404);
		}
		return user[0];
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError(
			'Failed to fetch user',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error, userId: id } }
		);
	}
};

// Crear usuario
export const createUser = async ({
	username,
	passwordHash,
	email,
	roleId
}: {
	username: string;
	passwordHash: string;
	email: string;
	roleId: string;
}) => {
	try {
		if (!username) {
			throw new ServiceError('Username is required', ERROR_TYPES.VALIDATION, 400, {
				field: 'username'
			});
		}
		if (!passwordHash) {
			throw new ServiceError('Password is required', ERROR_TYPES.VALIDATION, 400, {
				field: 'password'
			});
		}
		if (!email) {
			throw new ServiceError('Email is required', ERROR_TYPES.VALIDATION, 400, { field: 'email' });
		}
		if (!roleId) {
			throw new ServiceError('Role ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'roleId' });
		}

		const id = crypto.randomUUID();
		const createdAt = Math.floor(Date.now() / 1000);

		await repo.insertUser({
			id,
			username,
			passwordHash,
			email,
			roleId,
			createdAt
		});

		return {
			id,
			username,
			email,
			roleId,
			createdAt
		};
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError(
			'Failed to create user',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error, username, email } }
		);
	}
};

// Actualizar usuario
export const updateUser = async (
	id: string,
	data: Partial<{
		username: string;
		passwordHash: string;
		email: string;
		roleId: string;
		active: boolean;
		lastLogin: number;
	}>
) => {
	try {
		if (!id) {
			throw new ServiceError('User ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
		}

		await repo.updateUser(id, data);
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError(
			'Failed to update user',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error, userId: id, updateData: data } }
		);
	}
};

// Eliminar usuario permanentemente (hard delete)
export const deletePermanently = async (id: string) => {
	try {
		if (!id) {
			throw new ServiceError('User ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
		}

		await repo.deleteUser(id);
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError(
			'Failed to delete user',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error, userId: id } }
		);
	}
};

// Obtener todos los roles
export const getRoles = async () => {
	try {
		return await repo.getAllRoles();
	} catch (error) {
		throw new ServiceError(
			'Failed to fetch roles',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error } }
		);
	}
};

// Obtener rol por ID
export const getRoleById = async (id: string) => {
	try {
		if (!id) {
			throw new ServiceError('Role ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
		}

		const role = await repo.getRoleById(id);
		if (!role || role.length === 0) {
			throw new ServiceError('Role not found', ERROR_TYPES.NOT_FOUND, 404);
		}
		return role[0];
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError(
			'Failed to fetch role',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error, roleId: id } }
		);
	}
};

// Crear rol
export const createRole = async ({
	name,
	description,
	permissions
}: {
	name: string;
	description?: string;
	permissions?: string;
}) => {
	try {
		if (!name) {
			throw new ServiceError('Role name is required', ERROR_TYPES.VALIDATION, 400, { field: 'name' });
		}

		const id = crypto.randomUUID();

		await repo.insertRole({
			id,
			name,
			description,
			permissions
		});

		return {
			id,
			name,
			description,
			permissions
		};
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError(
			'Failed to create role',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error, roleName: name } }
		);
	}
};

// Actualizar rol
export const updateRole = async (
	id: string,
	data: Partial<{
		name: string;
		description: string;
		permissions: string;
	}>
) => {
	try {
		if (!id) {
			throw new ServiceError('Role ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
		}

		await repo.updateRole(id, data);
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError(
			'Failed to update role',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error, roleId: id, updateData: data } }
		);
	}
};

// Eliminar rol
export const deleteRole = async (id: string) => {
	try {
		if (!id) {
			throw new ServiceError('Role ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
		}

		await repo.deleteRole(id);
	} catch (error) {
		if (error instanceof ServiceError) throw error;
		throw new ServiceError(
			'Failed to delete role',
			ERROR_TYPES.DATABASE,
			500,
			{ details: { originalError: error as Error, roleId: id } }
		);
	}
};
