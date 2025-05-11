import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
  const allProducts = await db.select().from(products);

  return {
    products: allProducts,
  };
};