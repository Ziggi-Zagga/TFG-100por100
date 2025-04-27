// src/routes/(protected)/dashboard/inventory/[id]/+page.server.ts
import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function load({ params }) {
  const id = Number(params.id);

  const product = await db.query.products.findFirst({
    where: eq(products.id, id)
  });

  if (!product) {
    return {
      status: 404,
      error: new Error('Product not found')
    };
  }

  return {
    product
  };
}
