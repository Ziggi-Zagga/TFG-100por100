import { db } from '$lib/server/db';
import { stores, sections, storeRows, storeGaps } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';


export const getFullStoresTree = async () => {
  const results = await db
    .select({
      storeId: stores.id,
      storeName: stores.name,
      storeLocation: stores.location,
      sectionId: sections.id,
      sectionName: sections.name,
      rowId: storeRows.id,
      rowName: storeRows.name,
      gapId: storeGaps.id,
      gapName: storeGaps.name
    })
    .from(stores)
    .leftJoin(sections, eq(sections.store_id, stores.id))
    .leftJoin(storeRows, eq(storeRows.section_id, sections.id))
    .leftJoin(storeGaps, eq(storeGaps.row_id, storeRows.id));

  return results;
};


export const getAllStores = async () => {
  return await db.select().from(stores);
};


export const getStoreAndSections = async (storeId: number) => {
  const store = await db.query.stores.findFirst({
    where: eq(stores.id, storeId)
  });

  const sectionsList = await db
    .select()
    .from(sections)
    .where(eq(sections.store_id, storeId));

  return { store, sections: sectionsList };
};


export const getSectionAndRows = async (sectionId: number) => {
  const section = await db.query.sections.findFirst({
    where: eq(sections.id, sectionId)
  });

  const rowsList = await db
    .select()
    .from(storeRows)
    .where(eq(storeRows.section_id, sectionId));

  return { section, rows: rowsList };
};

export const getRowAndGaps = async (rowId: number) => {
  const row = await db.query.storeRows.findFirst({
    where: eq(storeRows.id, rowId)
  });

  const gapsList = await db
    .select()
    .from(storeGaps)
    .where(eq(storeGaps.row_id, rowId));

  return { row, gaps: gapsList };
};


export const getGap = async (gapId: number) => {
  const gap = await db.query.storeGaps.findFirst({
    where: eq(storeGaps.id, gapId)
  });

  return gap;
};
