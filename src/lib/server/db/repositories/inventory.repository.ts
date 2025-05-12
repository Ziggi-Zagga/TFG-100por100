import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, notExists } from 'drizzle-orm';


export async function repoGetInventoryView() {
	return db
		.select({
			id: table.products.id,
			name: table.products.name,
			code: table.products.code,
			price: table.products.price,
			unit: table.products.unit,
			quantity: table.inventory.quantity,
			last_count: table.inventory.last_count,
			location: table.storeGaps.name,
			supplier: table.suppliers.name,
			category: table.categories.name
		})
		.from(table.products)
		.innerJoin(table.inventory, eq(table.products.id, table.inventory.product_id))
		.innerJoin(table.storeGaps, eq(table.inventory.store_gap_id, table.storeGaps.id))
		.leftJoin(table.suppliers, eq(table.products.supplier_id, table.suppliers.id))
		.leftJoin(table.categories, eq(table.products.category_id, table.categories.id))
		.where(eq(table.products.active, true));
}


export async function repoGetAvailableProducts() {
	const result = await db
		.select({
			id: table.products.id,
			name: table.products.name,
			code: table.products.code,
			category: table.categories.name,
			supplier: table.suppliers.name
		})
		.from(table.products)
		.leftJoin(table.categories, eq(table.products.category_id, table.categories.id))
		.leftJoin(table.suppliers, eq(table.products.supplier_id, table.suppliers.id))
		.where(
			and(
				eq(table.products.active, true),
				notExists(
					db
						.select()
						.from(table.inventory)
						.where(eq(table.inventory.product_id, table.products.id))
				)
			)
		);

	return result.map((p) => ({
		...p,
		category: p.category ?? undefined,
		supplier: p.supplier ?? undefined
	}));
}


export async function repoGetStoreGaps() {
	return db
		.select({
			id: table.storeGaps.id,
			name: table.storeGaps.name
		})
		.from(table.storeGaps);
}

// Crear una entrada de inventario
export async function repoInsertInventoryItem({
	product_id,
	location_id,
	stock
}: {
	product_id: string;
	location_id: string;
	stock: number;
}) {
	return db.insert(table.inventory).values({
        id: crypto.randomUUID(),
		product_id,
		store_gap_id: location_id,
		quantity: stock,
		min_quantity: 0,
		reorder_quantity: 0,
		last_count: new Date().toISOString()
	});
}

export async function repoDeleteInventoryItem(id: string) {
	return db.delete(table.inventory).where(eq(table.inventory.id, id));
}
