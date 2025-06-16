import { db } from '$lib/server/db';
import { users, roles, userSessions } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {
	return await db
		.select({
			id: users.id,
			username: users.username,
			email: users.email,
			lastLogin: users.lastLogin,
			role: roles.name
		})
		.from(users)
		.innerJoin(roles, eq(users.roleId, roles.id))
		.where(eq(users.active, true));
};

export const getUserById = async (id: string) => {
	return await db
		.select({
			id: users.id,
			username: users.username,
			email: users.email,
			active: users.active,
			createdAt: users.createdAt,
			lastLogin: users.lastLogin,
			roleId: users.roleId
		})
		.from(users)
		.where(eq(users.id, id))
		.limit(1);
};

export const getRoleById = async (id: string) => {
	return await db.select().from(roles).where(eq(roles.id, id)).limit(1);
};
export const insertUser = async ({
	id,
	username,
	passwordHash,
	email,
	active = true,
	createdAt,
	lastLogin = null,
	roleId
}: {
	id: string;
	username: string;
	email: string;
	passwordHash: string;
	active?: boolean;
	createdAt: number;
	lastLogin?: number | null;
	roleId: string;
}) => {
	await db.insert(users).values({
		id,
		username,
		passwordHash,
		email,
		active,
		createdAt: new Date(createdAt * 1000),
		lastLogin: lastLogin ? new Date(lastLogin * 1000) : null,
		roleId
	});
};

export const updateUser = async (
	id: string,
	data: Partial<{
		username: string;
		email: string;
		active: boolean;
		lastLogin: number;
		roleId: string;
	}>
) => {
	const updateData = {
		...data,
		lastLogin: data.lastLogin ? new Date(data.lastLogin * 1000) : undefined
	};

	await db.update(users).set(updateData).where(eq(users.id, id));
};

export const deleteUser = async (id: string) => {
	try {
		await db.delete(userSessions).where(eq(userSessions.userId, id));
		await db.delete(users).where(eq(users.id, id));
	} catch (error) {
		console.error('Error al eliminar usuario:', error);
		throw error;
	}
};

export const getAllRoles = async () => {
	return await db.select().from(roles);
};
export const insertRole = async ({
	id,
	name,
	description,
	permissions
}: {
	id: string;
	name: string;
	description?: string;
	permissions?: string;
}) => {
	await db.insert(roles).values({
		id,
		name,
		description,
		permissions
	});
};

export const updateRole = async (
	id: string,
	data: Partial<{
		name: string;
		description: string;
		permissions: string;
	}>
) => {
	await db.update(roles).set(data).where(eq(roles.id, id));
};

export const deleteRole = async (id: string) => {
	await db.delete(roles).where(eq(roles.id, id));
};
