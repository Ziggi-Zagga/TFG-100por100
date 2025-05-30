import { getAllSuppliers, createSupplier, deleteSupplier, updateSupplier } from '$lib/server/services/suppliers.service';
import { getAllManufacturers, createManufacturer, deleteManufacturer, updateManufacturer } from '$lib/server/services/manufacturers.service';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const suppliers = await getAllSuppliers();
    const manufacturers = await getAllManufacturers();
    return { suppliers, manufacturers };
};


export const actions: Actions = {
    create: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name')?.toString() ?? '';
        const contactPerson = formData.get('contactPerson')?.toString() ?? '';
        const email = formData.get('email')?.toString() ?? '';
        const phone = formData.get('phone')?.toString() ?? '';
        const website = formData.get('website')?.toString() ?? '';
        const notes = formData.get('notes')?.toString() ?? '';

        try {
            await createSupplier({
                name,
                contactPerson,
                email,
                phone,
                website,
                notes
            });
            throw redirect(303, '/dashboard/suppliers');
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Failed to create supplier' });
        }
    },

    createManufacturer: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name')?.toString() ?? '';
        const description = formData.get('description')?.toString() ?? '';

        try {
            await createManufacturer({
                name,
                description
            });
            throw redirect(303, '/dashboard/suppliers');
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Failed to create manufacturer' });
        }
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        if (!id) return fail(400, { message: 'Missing supplier ID' });

        try {
            await deleteSupplier(id);
            return { success: true };
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Failed to delete supplier' });
        }
    },

    deleteManufacturer: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        if (!id) return fail(400, { message: 'Missing manufacturer ID' });

        try {
            await deleteManufacturer(id);
            return { success: true };
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Failed to delete manufacturer' });
        }
    },

    update: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        const name = formData.get('name')?.toString() ?? '';
        const contactPerson = formData.get('contactPerson')?.toString() ?? '';
        const email = formData.get('email')?.toString() ?? '';
        const phone = formData.get('phone')?.toString() ?? '';
        const website = formData.get('website')?.toString() ?? '';
        const notes = formData.get('notes')?.toString() ?? '';

        if (!id) return fail(400, { message: 'Missing supplier ID' });

        try {
            await updateSupplier(id, {
                name,
                contactPerson,
                email,
                phone,
                website,
                notes
            });
            return { success: true };
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Failed to update supplier' });
        }
    },

    updateManufacturer: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        const name = formData.get('name')?.toString() ?? '';
        const description = formData.get('description')?.toString() ?? '';

        if (!id) return fail(400, { message: 'Missing manufacturer ID' });

        try {
            await updateManufacturer(id, {
                name,
                description
            });
            return { success: true };
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Failed to update manufacturer' });
        }
    }
};
