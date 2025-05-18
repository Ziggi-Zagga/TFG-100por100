import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import * as prod from '$lib/server/services/products.service';
import { eq } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

  return {
    product,
    suppliers,
    manufacturers,
    categories,
    supplierName,
    manufacturerName,
    categoryName
  };
};
