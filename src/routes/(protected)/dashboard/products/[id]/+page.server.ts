import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
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

  return {
    product
  };
};
