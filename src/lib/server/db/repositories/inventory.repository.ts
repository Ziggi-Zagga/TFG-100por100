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
            lastCount: table.inventory.lastCount,
            location: table.storeGaps.name,
            supplier: table.suppliers.name,
            category: table.categories.name
        })
        .from(table.products)
        .innerJoin(table.inventory, eq(table.products.id, table.inventory.productId))
        .innerJoin(table.storeGaps, eq(table.inventory.storeGapId, table.storeGaps.id))
        .leftJoin(table.suppliers, eq(table.products.supplierId, table.suppliers.id))
        .leftJoin(table.categories, eq(table.products.categoryId, table.categories.id))
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
        .leftJoin(table.categories, eq(table.products.categoryId, table.categories.id))
        .leftJoin(table.suppliers, eq(table.products.supplierId, table.suppliers.id))
        .where(
            and(
                eq(table.products.active, true),
                notExists(
                    db
                        .select()
                        .from(table.inventory)
                        .where(eq(table.inventory.productId, table.products.id))
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


export async function repoInsertInventoryItem({
    productId,
    storeGapId,
    stock
}: {
    productId: string;
    storeGapId: string;
    stock: number;
}) {
    return db.insert(table.inventory).values({
        id: crypto.randomUUID(),
        productId,
        storeGapId,
        quantity: stock,
        minQuantity: 0,
        reorderQuantity: 0,
        lastCount: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
    });
}

export async function repoDeleteInventoryItem(id: string) {
    return db.delete(table.inventory).where(eq(table.inventory.id, id));
}