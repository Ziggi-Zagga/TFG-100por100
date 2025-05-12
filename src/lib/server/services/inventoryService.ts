import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function updateProduct(id: number, data: Partial<typeof products.$inferInsert>) {
  return db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  return db.delete(products).where(eq(products.id, id));
}

export async function getProduct(id: number) {
  return db.select().from(products).where(eq(products.id, id));
}