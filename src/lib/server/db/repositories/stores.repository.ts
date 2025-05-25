import { db } from '$lib/server/db';
import { stores, sections, storeRows, storeGaps } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getFullStoresTree = async () => {
	return await db
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
		.leftJoin(sections, eq(sections.storeId, stores.id))
		.leftJoin(storeRows, eq(storeRows.sectionId, sections.id))
		.leftJoin(storeGaps, eq(storeGaps.rowId, storeRows.id));
};

export const getAllStores = async () => {
	return await db.select().from(stores);
};

export const getStoreAndSections = async (storeId: string) => {
	const store = await db.query.stores.findFirst({ where: eq(stores.id, storeId) });
	const sectionsList = await db.select().from(sections).where(eq(sections.storeId, storeId));
	return { store, sections: sectionsList };
};

export const getSectionAndRows = async (sectionId: string) => {
	const section = await db.query.sections.findFirst({ where: eq(sections.id, sectionId) });
	const rowsList = await db.select().from(storeRows).where(eq(storeRows.sectionId, sectionId));
	return { section, rows: rowsList };
};

export const getRowAndGaps = async (rowId: string) => {
	const row = await db.query.storeRows.findFirst({ where: eq(storeRows.id, rowId) });
	const gapsList = await db.select().from(storeGaps).where(eq(storeGaps.rowId, rowId));
	return { row, gaps: gapsList };
};

export const getGap = async (gapId: string) => {
	return await db.query.storeGaps.findFirst({ where: eq(storeGaps.id, gapId) });
};

export const insertStore = async ({
	id,
	name,
	location,
	description
}: {
	id: string;
	name: string;
	location: string;
	description?: string;
}) => {
	await db.insert(stores).values({ id, name, location, description });
	return {
	id,
	name,
	location,
	description
};

};

export const insertSection = async ({
	id,
	storeId,
	name,
	description
}: {
	id: string;
	storeId: string;
	name: string;
	description?: string;
}) => {
	await db.insert(sections).values({
		id,
		storeId,
		name,
		description
	});
};

export const insertRow = async ({
	id,
	sectionId,
	name
}: {
	id: string;
	sectionId: string;
	name: string;
}) => {
	await db.insert(storeRows).values({
		id,
		sectionId,
		name
	});
};

export const insertGap = async ({
	id,
	rowId,
	name,
	capacity,
	notes
}: {
	id: string;
	rowId: string;
	name: string;
	capacity?: number;
	notes?: string;
}) => {
	await db.insert(storeGaps).values({
		id,
		rowId,
		name,
		capacity,
		notes
	});
};
export const removeStore = async (id: string) => {
	await db.delete(stores).where(eq(stores.id, id));
};
export const removeSection = async (id: string) => {
	await db.delete(sections).where(eq(sections.id, id));
};

export const removeRow = async (id: string) => {
	await db.delete(storeRows).where(eq(storeRows.id, id));
};

export const removeGap = async (id: string) => {
	await db.delete(storeGaps).where(eq(storeGaps.id, id));
};

export const repoGetTreeFromGapId = async (gapId: string) => {
	return await db
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
		.innerJoin(sections, eq(sections.storeId, stores.id))
		.innerJoin(storeRows, eq(storeRows.sectionId, sections.id))
		.innerJoin(storeGaps, eq(storeGaps.rowId, storeRows.id))
		.where(eq(storeGaps.id, gapId));
};