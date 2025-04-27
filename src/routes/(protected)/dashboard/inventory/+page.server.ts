import { db } from '$lib/server/db';
import { products, inventory, inventoryLocations, suppliers, categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function load() {
  const result = await db
    .select({
      id: products.id,
      name: products.name,
      code: products.code,
      price: products.price,
      unit: products.unit,
      quantity: inventory.quantity,
      last_count: inventory.last_count,
      location: inventoryLocations.name,
      supplier: suppliers.name,
      category: categories.name,
    })
    .from(products)
    .innerJoin(inventory, eq(products.id, inventory.product_id))
    .innerJoin(inventoryLocations, eq(inventory.location_id, inventoryLocations.id))
    .leftJoin(suppliers, eq(products.supplier_id, suppliers.id))
    .leftJoin(categories, eq(products.category_id, categories.id))
    .where(eq(products.active, true));

  return { items: result };
}
