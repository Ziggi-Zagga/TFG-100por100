import { getUsers, createUser, deleteUser, getRoles } from '$lib/server/services/users.service';
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
		const password_hash = formData.get('password_hash')?.toString() ?? '';
		const email = formData.get('email')?.toString() ?? '';
		const full_name = formData.get('full_name')?.toString() ?? '';
		const rol = formData.get('rol')?.toString() ?? '';

		await createUser({ username, password_hash, email, full_name, rol });
		throw redirect(303, '/dashboard/users');
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { message: 'Missing user ID' });

		try {
			await deleteUser(id);
			return { success: true };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Failed to delete user' });
		}
	}
};
