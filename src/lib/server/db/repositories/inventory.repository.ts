import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, and, notExists } from 'drizzle-orm';


export const repoGetInventoryView = async () => {
    return await db
        .select({
            id: table.inventory.id,
            productId: table.products.id,
            name: table.products.name,
            code: table.products.code,
            price: table.products.price,
            unit: table.products.unit,
            quantity: table.inventory.quantity,
            lastCount: table.inventory.lastCount,
            location: table.storeGaps.name,
            supplier: table.suppliers.name,
            category: table.categories.name,
            manufacturer: table.manufacturers.name
        })
        .from(table.products)
        .innerJoin(table.inventory, eq(table.products.id, table.inventory.productId))
        .innerJoin(table.storeGaps, eq(table.inventory.storeGapId, table.storeGaps.id))
        .leftJoin(table.suppliers, eq(table.products.supplierId, table.suppliers.id))
        .leftJoin(table.categories, eq(table.products.categoryId, table.categories.id))
        .leftJoin(table.manufacturers, eq(table.products.manufacturerId, table.manufacturers.id))
        .where(eq(table.products.active, true));
}


export const repoGetAvailableProducts = async () => {
    const result = await db
        .select({
            id: table.products.id,
            name: table.products.name,
            code: table.products.code,
            category: table.categories.name,
            supplier: table.suppliers.name,
            manufacturer: table.manufacturers.name
        })
        .from(table.products)
        .leftJoin(table.categories, eq(table.products.categoryId, table.categories.id))
        .leftJoin(table.suppliers, eq(table.products.supplierId, table.suppliers.id))
        .leftJoin(table.manufacturers, eq(table.products.manufacturerId, table.manufacturers.id))
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
        supplier: p.supplier ?? undefined,
        manufacturer: p.manufacturer ?? undefined
    }));
}

export const repoInsertInventoryItem = async ({
    productId,
    storeGapId,
    stock,
    minQuantity,
    reorderQuantity,
    lastCount,
    createdAt,
    updatedAt
}: {
    productId: string;
    storeGapId: string;
    stock: number;
    minQuantity: number;
    reorderQuantity: number;
    lastCount?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}) => {
    return db.insert(table.inventory).values({
        id: crypto.randomUUID(),
        productId,
        storeGapId,
        quantity: stock,
        minQuantity: minQuantity ?? 0,
        reorderQuantity: reorderQuantity ?? 0,
        lastCount: lastCount ?? new Date(),
        createdAt: createdAt ?? new Date(),
        updatedAt: updatedAt ?? new Date(),
    });
}

export const repoUpdateInventoryItem = async ({
    id,
    stock,
    minQuantity,
    reorderQuantity,
    storeGapId,
    lastCount,
    updatedAt
}: {
    id: string;
    stock: number;
    minQuantity: number;
    reorderQuantity: number;
    storeGapId: string;
    lastCount?: Date;
    updatedAt?: Date;
}) => {
    return db.update(table.inventory).set({
        quantity: stock,
        minQuantity: minQuantity ?? 0,
        reorderQuantity: reorderQuantity ?? 0,
        storeGapId: storeGapId,
        lastCount: lastCount ?? new Date(),
        updatedAt: updatedAt ?? new Date(),
    }).where(eq(table.inventory.id, id));
}

export const repoDeleteInventoryItem = async (id: string) => {
    return db.delete(table.inventory).where(eq(table.inventory.id, id));
}

export const repoGetInventoryById = async (id: string) => {
    return db.select().from(table.inventory).where(eq(table.inventory.id, id));
}