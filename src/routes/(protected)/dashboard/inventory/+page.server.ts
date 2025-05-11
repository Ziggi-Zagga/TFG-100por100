import { db } from '$lib/server/db';
import {
  products,
  inventory,
  inventoryLocations,
  suppliers,
  categories
} from '$lib/server/db/schema';
import { and, eq, notExists } from 'drizzle-orm';

export async function load() {
  // Productos que ya están en inventory
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
      category: categories.name
    })
    .from(products)
    .innerJoin(inventory, eq(products.id, inventory.product_id))
    .innerJoin(inventoryLocations, eq(inventory.location_id, inventoryLocations.id))
    .leftJoin(suppliers, eq(products.supplier_id, suppliers.id))
    .leftJoin(categories, eq(products.category_id, categories.id))
    .where(eq(products.active, true));

  // Productos activos que NO están en inventory
  const availableProducts = await db
    .select({
      id: products.id,
      name: products.name,
      code: products.code,
      category: categories.name,
      supplier: suppliers.name
    })
    .from(products)
    .leftJoin(categories, eq(products.category_id, categories.id))
    .leftJoin(suppliers, eq(products.supplier_id, suppliers.id))
    .where(
      and(
        eq(products.active, true),
        notExists(
          db
            .select()
            .from(inventory)
            .where(eq(inventory.product_id, products.id))
        )
      )
    );

  // Todas las ubicaciones disponibles
  const locations = await db
    .select({
      id: inventoryLocations.id,
      name: inventoryLocations.name
    })
    .from(inventoryLocations);

  // Que no hayan nulls, que si no da un error de ts
  const safeAvailableProducts = availableProducts.map((p) => ({
      ...p,
      category: p.category ?? undefined,
      supplier: p.supplier ?? undefined
    }));
    

  return {
    items: result,
    safeAvailableProducts,
    locations
  };
}
