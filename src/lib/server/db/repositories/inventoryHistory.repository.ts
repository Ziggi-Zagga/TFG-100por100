import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';

const warehouseGapsFrom = alias(table.warehouseGaps, 'warehouseGapsFrom');
const warehouseGapsTo = alias(table.warehouseGaps, 'warehouseGapsTo');

export const repoGetInventoryHistoryView = async () => {
  return await db
      .select({
          id: table.inventoryHistory.id,
          productId: table.products.id,
          productName: table.products.name,
          inventoryId: table.inventory.id,
          fromLocation: warehouseGapsFrom.name,
          toLocation: warehouseGapsTo.name,
          previousQuantity: table.inventoryHistory.previousQuantity,
          newQuantity: table.inventoryHistory.newQuantity,
          quantityChanged: table.inventoryHistory.quantityChanged,
          userId: table.users.id,
          userName: table.users.username,
          notes: table.inventoryHistory.notes,
          createdAt: table.inventoryHistory.createdAt,
      })
      .from(table.inventoryHistory)
      .innerJoin(table.products, eq(table.inventoryHistory.productId, table.products.id))
      .innerJoin(table.inventory, eq(table.inventoryHistory.inventoryId, table.inventory.id))
      .leftJoin(warehouseGapsFrom, eq(table.inventoryHistory.fromGapId, warehouseGapsFrom.id))
      .leftJoin(warehouseGapsTo, eq(table.inventoryHistory.toGapId, warehouseGapsTo.id))
      .leftJoin(table.users, eq(table.inventoryHistory.userId, table.users.id));
};



export const repoGetInventoryHistoryByInventoryId = async (inventoryId: string) => {
    return await db
        .select({
            id: table.inventoryHistory.id,
            productId: table.products.id,
            productName: table.products.name,
            inventoryId: table.inventory.id,
            fromLocation: warehouseGapsFrom.name,
            toLocation: warehouseGapsTo.name,
            previousQuantity: table.inventoryHistory.previousQuantity,
            newQuantity: table.inventoryHistory.newQuantity,
            quantityChanged: table.inventoryHistory.quantityChanged,
            userId: table.users.id,
            userName: table.users.username,
            notes: table.inventoryHistory.notes,
            createdAt: table.inventoryHistory.createdAt,
        })
        .from(table.inventoryHistory)
        .innerJoin(table.products, eq(table.inventoryHistory.productId, table.products.id))
        .innerJoin(table.inventory, eq(table.inventoryHistory.inventoryId, table.inventory.id))
        .leftJoin(warehouseGapsFrom, eq(table.inventoryHistory.fromGapId, warehouseGapsFrom.id))
        .leftJoin(warehouseGapsTo, eq(table.inventoryHistory.toGapId, warehouseGapsTo.id))
        .leftJoin(table.users, eq(table.inventoryHistory.userId, table.users.id))
        .where(eq(table.inventoryHistory.inventoryId, inventoryId));
};

export const repoInsertInventoryHistory = async ({
    id,
    productId,
    inventoryId,
    fromGapId,
    toGapId,
    previousQuantity,
    newQuantity,
    quantityChanged,
    userId,
    notes,
    createdAt,
  }: {
    id: string;
    productId: string;
    inventoryId: string;
    fromGapId?: string;
    toGapId?: string;
    previousQuantity?: number;
    newQuantity?: number;
    quantityChanged: number;
    userId?: string;
    notes?: string;
    createdAt?: Date;
  }) => {
    await db.insert(table.inventoryHistory).values({
      id,
      productId,
      inventoryId,
      fromGapId: fromGapId ?? null,
      toGapId: toGapId ?? null,
      previousQuantity: previousQuantity ?? null,
      newQuantity: newQuantity ?? null,
      quantityChanged,
      userId: userId ?? null,
      notes: notes ?? null,
      createdAt: createdAt ?? new Date(),
    });
  
    return {
      id,
      productId,
      inventoryId,
      fromGapId,
      toGapId,
      previousQuantity,
      newQuantity,
      quantityChanged,
      userId,
      notes,
      createdAt: createdAt ?? new Date(),
    };
  };
  
