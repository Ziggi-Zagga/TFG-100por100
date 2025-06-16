import { db } from '$lib/server/db';
import {
	getFullProductsList,
	createProduct,
	deleteProductById
} from '$lib/server/services/products.service';
import {
	getProductsByGapId,
	type ProductWithGapName
} from '$lib/server/services/inventory.service';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const gapId = url.searchParams.get('gapId');

	let productsWithGap: ProductWithGapName[] = [];
	let gapName = null;

	if (gapId) {
		productsWithGap = await getProductsByGapId(gapId);
		gapName = productsWithGap[0]?.gapName || null;
	}

	const products = gapId
		? productsWithGap.map((item) => item.product)
		: await getFullProductsList();

	if (!products) throw fail(404, { message: 'Products not found' });

	const suppliers = await db.query.suppliers.findMany();
	const manufacturers = await db.query.manufacturers.findMany();
	const categories = await db.query.categories.findMany();

	return {
		products,
		totalProducts: products.length,
		suppliers,
		manufacturers,
		categories,
		gapId: gapId || null,
		gapName: gapName
	};
};

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const code = formData.get('code')?.toString() ?? '';
		const description = formData.get('description')?.toString() ?? '';
		const supplierId = formData.get('supplierId')?.toString() ?? '';
		const manufacturerId = formData.get('manufacturerId')?.toString() ?? '';
		const categoryId = formData.get('categoryId')?.toString() ?? '';
		const price = formData.get('price')?.toString() ?? '';
		const unit = formData.get('unit')?.toString() ?? '';
		const dimensions = formData.get('dimensions')?.toString() ?? '';
		const material = formData.get('material')?.toString() ?? '';
		const specifications = formData.get('specifications')?.toString() ?? '';

		await createProduct({
			code,
			name,
			description,
			supplierId,
			manufacturerId,
			categoryId,
			price: price ? parseFloat(price) : undefined,
			unit,
			dimensions,
			material,
			specifications,
			createdAt: new Date(),
			updatedAt: new Date()
		});

		throw redirect(303, '/dashboard/products');
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		if (!id) return fail(400, { message: 'Missing product ID' });

		try {
			await deleteProductById(id);
			return { success: true };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Failed to delete product' });
		}
	}
};
