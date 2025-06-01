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
            location: table.warehouseGaps.name,
            supplier: table.suppliers.name,
            category: table.categories.name,
            manufacturer: table.manufacturers.name
        })
        .from(table.products)
        .innerJoin(table.inventory, eq(table.products.id, table.inventory.productId))
        .innerJoin(table.warehouseGaps, eq(table.inventory.warehouseGapId, table.warehouseGaps.id))
        .leftJoin(table.suppliers, eq(table.products.supplierId, table.suppliers.id))
        .leftJoin(table.categories, eq(table.products.categoryId, table.categories.id))
        .leftJoin(table.manufacturers, eq(table.products.manufacturerId, table.manufacturers.id))
        .where(eq(table.products.active, true));
}

export const repoInsertInventoryItem = async ({
    productId,
    warehouseGapId,
    stock,
    minQuantity,
    reorderQuantity,
    lastCount,
    createdAt,
    updatedAt
}: {
    productId: string;
    warehouseGapId: string;
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
        warehouseGapId,
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
    warehouseGapId,
    lastCount,
    updatedAt
}: {
    id: string;
    stock: number;
    minQuantity: number;
    reorderQuantity: number;
    warehouseGapId: string;
    lastCount?: Date;
    updatedAt?: Date;
}) => {
    return db.update(table.inventory).set({
        quantity: stock,
        minQuantity: minQuantity ?? 0,
        reorderQuantity: reorderQuantity ?? 0,
        warehouseGapId: warehouseGapId,
        lastCount: lastCount ?? new Date(),
        updatedAt: updatedAt ?? new Date(),
    }).where(eq(table.inventory.id, id));
}

export const repoGetInventoryByProductId = async (productId: string) => {
    return db.select().from(table.inventory).where(eq(table.inventory.productId, productId));
}

export const repoGetInventoryWithFullLocationByProductId = async (productId: string) => {
    return await db
      .select({
        id: table.inventory.id,
        productId: table.inventory.productId,
        Stock: table.inventory.quantity,
        Date: table.inventory.createdAt,
        Gap: table.warehouseGaps.name,
        Row: table.warehouseRows.name,
        Section: table.sections.name,
        warehouse: table.warehouse.name
      })
      .from(table.inventory)
      .innerJoin(table.warehouseGaps, eq(table.inventory.warehouseGapId, table.warehouseGaps.id))
      .innerJoin(table.warehouseRows, eq(table.warehouseGaps.rowId, table.warehouseRows.id))
      .innerJoin(table.sections, eq(table.warehouseRows.sectionId, table.sections.id))
      .innerJoin(table.warehouse, eq(table.sections.warehouseId, table.warehouse.id))
      .where(eq(table.inventory.productId, productId));
  };
  

export const repoDeleteInventoryItem = async (id: string) => {
    return db.delete(table.inventory).where(eq(table.inventory.id, id));
}

export const repoGetInventoryById = async (id: string) => {
    return db.select().from(table.inventory).where(eq(table.inventory.id, id));
}