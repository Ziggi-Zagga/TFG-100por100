import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import * as prod from '$lib/server/services/products.service';
import { eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;
  if (!id) throw fail(400,  {message: 'Missing product ID' });

  const product = await db.query.products.findFirst({
    where: eq(products.id, id)
  });
  if (!product) throw fail(404, { message: 'Product not found' });

  const suppliers = await prod.getAllSuppliers();
  const manufacturers = await prod.getAllManufacturers();
  const categories = await prod.getAllCategories() ;
  const supplierName = await prod.getSuppliersById(product.supplierId ?? '');
  const manufacturerName = await prod.getManufacturersById(product.manufacturerId ?? '');
  const categoryName = await prod.getCategoriesById(product.categoryId ?? '');
  const inventory = await prod.getProductFromInventoryById(product.id ?? '');
  const orderItems = await prod.getOrderItemsByProductId(product.id ?? '');

  return {
    product,
    suppliers,
    manufacturers,
    categories,
    supplierName,
    manufacturerName,
    categoryName,
    inventory,
    orderItems
  };
};

export const actions: Actions = { 
  update: async ({ request }) => {
    const formData = await request.formData();
  
    const id = formData.get('id')?.toString() ?? '';
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
  
    await prod.updateProduct({
      id,
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
      active: true,
      updatedAt: new Date(),
    });
  
  }
};

