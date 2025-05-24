import { getCategoriesData } from '$lib/server/services/categories.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createCategory, deleteCategory, updateCategory } from '$lib/server/services/categories.service';

export const load: PageServerLoad = async () => {
    const categories = await getCategoriesData();
    if (!categories) throw fail(404, { message: 'Categories not found' });

    return { 
        categories,
        totalCategories: categories.length
    };
};

export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name')?.toString() ?? '';
        const description = formData.get('description')?.toString() ?? '';
        const parentId = formData.get('parentId')?.toString() ?? '';

        try {
            await createCategory({ name, description, parentId });
            throw redirect(303, '/dashboard/categories');
        } catch (error) {
            console.error('Create category failed:', error);
            return fail(500, { message: 'Failed to create category' });
        }
    },
    
    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id')?.toString() ?? '';
        console.log(id);
        
        try {
            await deleteCategory(id);
            throw redirect(303, '/dashboard/categories');
        } catch (error) {
            console.error('Delete category failed:', error);
            return fail(500, { message: 'Failed to delete category' });
        }
    },

    update: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id')?.toString() ?? '';
        const name = formData.get('name')?.toString() ?? '';
        const description = formData.get('description')?.toString() ?? '';
        const parentId = formData.get('parentId')?.toString() ?? '';

        try {
            await updateCategory({ id, name, description, parentId });
            throw redirect(303, '/dashboard/categories');
        } catch (error) {
            console.error('Update category failed:', error);
            return fail(500, { message: 'Failed to update category' });
        }
    }
};