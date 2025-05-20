import { getUsers, createUser, deletePermanently, getRoles, createRole } from '$lib/server/services/users.service';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const users = await getUsers();
	const roles = await getRoles();
	return { users, roles };
};



export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const username = formData.get('username')?.toString() ?? '';
		const passwordHash = formData.get('password_hash')?.toString() ?? '';
		const email = formData.get('email')?.toString() ?? '';
		const roleId = formData.get('rol')?.toString() ?? '';

		await createUser({ username, passwordHash, email, roleId });
		throw redirect(303, '/dashboard/users');
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { message: 'Missing user ID' });

		try {
			await deletePermanently(id);
			return { success: true };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Failed to delete user' });
		}
	},

	createRole: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('role_name')?.toString() ?? '';
		const description = formData.get('role_description')?.toString() ?? '';
		const permission = formData.get('permissions')?.toString() ?? '';

		if (!name) {
			return fail(400, { message: 'Role name is required' });
		}

		try {
			await createRole({
				name,
				description,
				permissions: permission
			});
			throw redirect(303, '/dashboard/users');
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Failed to create role' });
		}
	}
};
