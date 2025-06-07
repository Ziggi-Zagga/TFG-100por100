import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm/expressions';
import { alias } from 'drizzle-orm/pg-core';

export const repoGetInventoryHistoryView = async () => {

  const fromGap = alias(table.warehouseGaps, 'from_gap');
  const toGap = alias(table.warehouseGaps, 'to_gap');

  return await db
      .select({
          id: table.inventoryHistory.id,
          productId: table.products.id,
          productName: table.products.name,
          inventoryId: table.inventory.id,
          fromLocation: fromGap.name,
          toLocation: toGap.name,
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
      .leftJoin(fromGap, eq(table.inventoryHistory.fromGapId, fromGap.id))
      .leftJoin(toGap, eq(table.inventoryHistory.toGapId, toGap.id))
      .leftJoin(table.users, eq(table.inventoryHistory.userId, table.users.id));
};



export const repoGetInventoryHistoryByInventoryId = async (inventoryId: string) => {
	const fromGap = alias(table.warehouseGaps, 'from_gap');
	const toGap = alias(table.warehouseGaps, 'to_gap');

	return await db
		.select({
			id: table.inventoryHistory.id,
			productId: table.products.id,
			productName: table.products.name,
			inventoryId: table.inventory.id,
			fromLocation: fromGap.name,
			toLocation: toGap.name,
			previousQuantity: table.inventoryHistory.previousQuantity,
			newQuantity: table.inventoryHistory.newQuantity,
			quantityChanged: table.inventoryHistory.quantityChanged,
			userId: table.users.id,
			userName: table.users.username,
			notes: table.inventoryHistory.notes,
			createdAt: table.inventoryHistory.createdAt
		})
		.from(table.inventoryHistory)
		.innerJoin(table.products, eq(table.inventoryHistory.productId, table.products.id))
		.innerJoin(table.inventory, eq(table.inventoryHistory.inventoryId, table.inventory.id))
		.leftJoin(fromGap, eq(table.inventoryHistory.fromGapId, fromGap.id))
		.leftJoin(toGap, eq(table.inventoryHistory.toGapId, toGap.id))
		.leftJoin(table.users, eq(table.inventoryHistory.userId, table.users.id))
		.where(eq(table.inventoryHistory.inventoryId, inventoryId));
};


export const repoGetInventoryHistoryByUserId = async (userId: string) => {
    const fromGap = alias(table.warehouseGaps, 'from_gap');
    const toGap = alias(table.warehouseGaps, 'to_gap');
    
    return await db
        .select({
            id: table.inventoryHistory.id,
            productId: table.products.id,
            productName: table.products.name,
            inventoryId: table.inventory.id,
            fromLocation: fromGap.name,
            toLocation: toGap.name,
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
        .leftJoin(fromGap, eq(table.inventoryHistory.fromGapId, fromGap.id))
        .leftJoin(toGap, eq(table.inventoryHistory.toGapId, toGap.id))
        .leftJoin(table.users, eq(table.inventoryHistory.userId, table.users.id))
        .where(eq(table.inventoryHistory.userId, userId))
        .orderBy(desc(table.inventoryHistory.createdAt));
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
  
