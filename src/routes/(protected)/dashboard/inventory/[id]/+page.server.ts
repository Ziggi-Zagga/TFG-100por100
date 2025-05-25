import * as inv from '$lib/server/services/inventory.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getFullStoresTree } from '$lib/server/db/repositories/stores.repository';

export const load: PageServerLoad = async ({ params }) => {
    const id = params.id;
    if (!id) throw fail(400, { message: 'Missing inventory ID' });

    const inventory = await inv.getInventoryById(id);
    const product = await inv.getProductById(inventory[0].productId);
    const location = await inv.getTreeFromGapId(inventory[0].storeGapId);
    const fullStoreTree = await getFullStoresTree();

    return {
        inventory,
        product,
        location,
        fullStoreTree,
    };
};

export const actions: Actions = {
    update: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        const stock = Number(formData.get('quantity')?.toString() ?? 0);
        const minQuantity = Number(formData.get('minQuantity')?.toString() ?? 0);
        const reorderQuantity = Number(formData.get('reorderQuantity')?.toString() ?? 0);
        const storeGapId = formData.get('gapId')?.toString() ?? "";

        if (!id) return fail(400, { message: 'Missing inventory ID' });

        try {
            await inv.updateInventoryEntry({ id, stock, minQuantity, reorderQuantity, storeGapId, lastCount: new Date(), updatedAt: new Date() });
            //await inv.createInventoryMovement(id);
        
            return redirect(303, '/dashboard/inventory/' + id);
        } catch (error) {
            console.error(error);
            return fail(500, { message: 'Failed to update inventory' });
        }
    },
};