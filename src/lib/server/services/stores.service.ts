import * as repo from '../db/repositories/stores.repository';
import { db } from '$lib/server/db';
import { stores, sections, storeRows, storeGaps } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export const getStoresTree = async () => {
  const rows = await repo.getFullStoresTree();

  const storeMap = new Map<string, any>();

  for (const row of rows) {
    if (!row.storeId) continue;

    let store = storeMap.get(row.storeId);
    if (!store) {
      store = {
        id: row.storeId,
        name: row.storeName,
        location: row.storeLocation,
        sections: []
      };
      storeMap.set(row.storeId, store);
    }

    if (row.sectionId) {
      let section = store.sections.find((s: any) => s.id === row.sectionId);
      if (!section) {
        section = {
          id: row.sectionId,
          name: row.sectionName,
          rows: []
        };
        store.sections.push(section);
      }

      if (row.rowId) {
        let rowObj = section.rows.find((r: any) => r.id === row.rowId);
        if (!rowObj) {
          rowObj = {
            id: row.rowId,
            name: row.rowName,
            gaps: []
          };
          section.rows.push(rowObj);
        }

        if (row.gapId) {
          const gapExists = rowObj.gaps.find((g: any) => g.id === row.gapId);
          if (!gapExists) {
            rowObj.gaps.push({
              id: row.gapId,
              name: row.gapName
            });
          }
        }
      }
    }
  }

  return Array.from(storeMap.values());
};

export const getStores = async () => {
  return await repo.getAllStores();
};

export const getStoreWithSections = async (storeId: string) => {
  return await repo.getStoreAndSections(storeId);
};

export const getSectionWithRows = async (sectionId: string) => {
  return await repo.getSectionAndRows(sectionId);
};

export const getRowWithGaps = async (rowId: string) => {
  return await repo.getRowAndGaps(rowId);
};

export const getGapById = async (gapId: string) => {
  return await repo.getGap(gapId);
};

export const createStore = async ({ name, location, description }: { name: string, location: string, description?: string }) => {
  const id = crypto.randomUUID();
  await db.insert(stores).values({
    id,
    name,
    location,
    description
  });
};

export const createSection = async ({ storeId, name, description }: { storeId: string, name: string, description?: string }) => {
  const id = crypto.randomUUID();
  await db.insert(sections).values({
    id,
    store_id: storeId,
    name,
    description
  });
};

export const createRow = async ({ sectionId, name }: { sectionId: string, name: string }) => {
  const id = crypto.randomUUID();
  await db.insert(storeRows).values({
    id,
    section_id: sectionId,
    name
  });
};

export const createGap = async ({ rowId, name, capacity, notes }: { rowId: string, name: string, capacity?: number, notes?: string }) => {
  const id = crypto.randomUUID();
  await db.insert(storeGaps).values({
    id,
    row_id: rowId,
    name,
    capacity,
    notes
  });
};
