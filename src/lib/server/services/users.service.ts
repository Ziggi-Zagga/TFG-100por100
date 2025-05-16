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
	password_hash,
	email,
	full_name,
	rol
}: {
	username: string;
	password_hash: string;
	email: string;
	full_name: string;
	rol: string;
}) => {
	if (!username) {
		throw new ServiceError('Username is required', ERROR_TYPES.VALIDATION, 400, { field: 'username' });
	}
	if (!password_hash) {
		throw new ServiceError('Password is required', ERROR_TYPES.VALIDATION, 400, { field: 'password' });
	}
	if (!email) {
		throw new ServiceError('Email is required', ERROR_TYPES.VALIDATION, 400, { field: 'email' });
	}
	if (!full_name) {
		throw new ServiceError('Full name is required', ERROR_TYPES.VALIDATION, 400, { field: 'full_name' });
	}
	if (!rol) {
		throw new ServiceError('Role is required', ERROR_TYPES.VALIDATION, 400, { field: 'rol' });
	}

	const id = crypto.randomUUID();
	const created_at = new Date().toISOString();
	await repo.insertUser({
		id,
		username,
		password_hash,
		email,
		full_name,
		active: true,
		created_at,
		last_login: null,
		rol
	});
	return { id };
};

// Actualizar usuario
export const updateUser = async (
	id: string,
	data: Partial<{
		username: string;
		password_hash: string;
		email: string;
		full_name: string;
		active: boolean;
		last_login: string;
		rol: string;
	}>
) => {
	if (!id) {
		throw new ServiceError('User ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}
	await repo.updateUser(id, data);
};

// Eliminar usuario (soft delete)
export const softDeleteUser = async (id: string) => {
	if (!id) {
		throw new ServiceError('User ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}
	await repo.softDeleteUser(id);
};

// Eliminar usuario (hard delete)
export const deleteUser = async (id: string) => {
	if (!id) {
		throw new ServiceError('User ID is required', ERROR_TYPES.VALIDATION, 400, { field: 'id' });
	}
	await repo.deleteUser(id);
};
