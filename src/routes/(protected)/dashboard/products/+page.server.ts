import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { getFullProductsList, createProduct } from '$lib/server/services/products.service';
import { fail, type Actions, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async () => {
  const allProducts = await getFullProductsList();

  return {
    products: allProducts,
    totalProducts: allProducts.length
  };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get('name')?.toString() ?? '';
    const code = formData.get('code')?.toString() ?? '';
    const description = formData.get('description')?.toString() ?? '';
    const supplier_id = formData.get('supplier_id')?.toString() ?? '';
    const manufacturer_id = formData.get('manufacturer_id')?.toString() ?? '';
    const category_id = formData.get('category_id')?.toString() ?? '';
    const price = formData.get('price')?.toString() ?? '';
    const unit = formData.get('unit')?.toString() ?? '';
    const dimensions = formData.get('dimensions')?.toString() ?? '';
    const material = formData.get('material')?.toString() ?? '';
    const specifications = formData.get('specifications')?.toString() ?? '';

    await createProduct({
      code,
      name,
      description,
      supplier_id,
      manufacturer_id,
      category_id,
      price: price ? parseFloat(price) : undefined,
      unit,
      dimensions,
      material,
      specifications
    });

    throw redirect(303, '/dashboard/products');
  },

  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id')?.toString();
    if (!id) return fail(400, { message: 'Missing product ID' });

    try {
      await db.delete(products).where(eq(products.id, id));
      return { success: true };
    } catch (error) {
      console.error(error);
      return fail(500, { message: 'Failed to delete product' });
    }
  }
};
