import * as repo from '../db/repositories/users.repository';
import crypto from 'crypto';
import { ServiceError, ERROR_TYPES } from '$lib/utils/errors/ServiceError';

// Obtener todos los usuarios activos
export const getUsers = async () => {
	return await repo.getAllUsers();
};

// Obtener usuario por ID
export const getUserById = async (id: string) => {
	if (!id) {
		throw new ServiceError('User ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}
	const user = await repo.getUserById(id);
	if (!user || user.length === 0) {
		throw new ServiceError('User not found', ERROR_TYPES.NOT_FOUND, 404);
	}
	return user[0];
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
	if (!id) {
		throw new ServiceError('User ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}

	await repo.updateUser(id, data);
};

// Eliminar usuario permanentemente (hard delete)
export const deletePermanently = async (id: string) => {
	if (!id) {
		throw new ServiceError('User ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}

	await repo.deleteUser(id);
};

// Obtener todos los roles
export const getRoles = async () => {
	return await repo.getAllRoles();
};

// Obtener rol por ID
export const getRoleById = async (id: string) => {
	if (!id) {
		throw new ServiceError('Role ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}

	const role = await repo.getRoleById(id);
	if (!role || role.length === 0) {
		throw new ServiceError('Role not found', ERROR_TYPES.NOT_FOUND, 404);
	}
	return role[0];
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
	if (!id) {
		throw new ServiceError('Role ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}

	await repo.updateRole(id, data);
};

// Eliminar rol
export const deleteRole = async (id: string) => {
	if (!id) {
		throw new ServiceError('Role ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}

	await repo.deleteRole(id);
};
