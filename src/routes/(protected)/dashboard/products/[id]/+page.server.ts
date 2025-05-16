import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id;

  const product = await db.query.products.findFirst({
    where: eq(products.id, id)
  });

  if (!product) {
    throw error(404, 'Product not found');
  }

  return {
    product
  };
};
