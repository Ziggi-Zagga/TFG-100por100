	import { db } from '$lib/server/db';
import { warehouse, sections, warehouseRows, warehouseGaps, orders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getFullwarehouseTree = async () => {
	return await db
		.select({
			warehouseId: warehouse.id,
			warehouseName: warehouse.name,
			warehouseLocation: warehouse.location,
			sectionId: sections.id,
			sectionName: sections.name,
			rowId: warehouseRows.id,
			rowName: warehouseRows.name,
			gapId: warehouseGaps.id,
			gapName: warehouseGaps.name
		})
		.from(warehouse)
		.leftJoin(sections, eq(sections.warehouseId, warehouse.id))
		.leftJoin(warehouseRows, eq(warehouseRows.sectionId, sections.id))
		.leftJoin(warehouseGaps, eq(warehouseGaps.rowId, warehouseRows.id));
};

export const getAllwarehouse = async () => {
	return await db.select().from(warehouse);
};

export const getwarehouseAndSections = async (warehouseId: string) => {
    try {
        // Usar la sintaxis correcta para la consulta con Drizzle
        const warehouseData = await db.query.warehouse.findFirst({
            where: (wh, { eq }) => eq(wh.id, warehouseId)
        });
        
        if (!warehouseData) {
            console.error('No se encontró el almacén con ID:', warehouseId);
            return { warehouse: null, sections: [] };
        }
        
        // Usar la sintaxis correcta para la consulta de secciones
        const sectionsList = await db.select()
            .from(sections)
            .where(eq(sections.warehouseId, warehouseId));
            
        return { 
            warehouse: warehouseData, 
            sections: sectionsList 
        };
    } catch (error) {
        console.error('Error en getwarehouseAndSections:', error);
        throw error;
    }
};

export const getSectionAndRows = async (sectionId: string) => {
	const section = await db.query.sections.findFirst({ where: eq(sections.id, sectionId) });
	const rowsList = await db.select().from(warehouseRows).where(eq(warehouseRows.sectionId, sectionId));
	return { section, rows: rowsList };
};

export const getRowAndGaps = async (rowId: string) => {
	const row = await db.query.warehouseRows.findFirst({ where: eq(warehouseRows.id, rowId) });
	const gapsList = await db.select().from(warehouseGaps).where(eq(warehouseGaps.rowId, rowId));
	return { row, gaps: gapsList };
};

export const getGap = async (gapId: string) => {
	return await db.query.warehouseGaps.findFirst({ where: eq(warehouseGaps.id, gapId) });
};

export const insertwarehouse = async ({
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
	await db.insert(warehouse).values({ id, name, location, description });
	return {
	id,
	name,
	location,
	description
};

};

export const insertSection = async ({
	id,
	warehouseId,
	name,
	location,
	description
}: {
	id: string;
	warehouseId: string;
	name: string;
	location?: string | null;
	description?: string | null;
}) => {
	await db.insert(sections).values({
		id,
		warehouseId,
		name,
		location: location || null,
		description: description || null
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
	await db.insert(warehouseRows).values({
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
	await db.insert(warehouseGaps).values({
		id,
		rowId,
		name,
		capacity,
		notes
	});
};

export const updatewarehouse = async (id: string, data: { 
   	warehouseId: string,
	updatedData: Partial<typeof warehouse.$inferInsert>
}) => {
    const [updatedwarehouse] = await db
        .update(warehouse)
        .set({
            name: data.updatedData.name,
            location: data.updatedData.location ?? null,
            description: data.updatedData.description ?? null,
        })
        .where(eq(warehouse.id, id))
        .returning();

    return updatedwarehouse;
};

export const removewarehouse = async (id: string) => {
	await db.delete(warehouse).where(eq(warehouse.id, id));
};

export const removeSection = async (id: string) => {
	await db.delete(sections).where(eq(sections.id, id));
};

export const removeRow = async (id: string) => {
	await db.delete(warehouseRows).where(eq(warehouseRows.id, id));
};

export const removeGap = async (id: string) => {
	await db.delete(warehouseGaps).where(eq(warehouseGaps.id, id));
};

export const repoGetTreeFromGapId = async (gapId: string) => {
	return await db
		.select({
			warehouseId: warehouse.id,
			warehouseName: warehouse.name,
			warehouseLocation: warehouse.location,
			sectionId: sections.id,
			sectionName: sections.name,
			rowId: warehouseRows.id,
			rowName: warehouseRows.name,
			gapId: warehouseGaps.id,
			gapName: warehouseGaps.name
		})
		.from(warehouse)
		.innerJoin(sections, eq(sections.warehouseId, warehouse.id))
		.innerJoin(warehouseRows, eq(warehouseRows.sectionId, sections.id))
		.innerJoin(warehouseGaps, eq(warehouseGaps.rowId, warehouseRows.id))
		.where(eq(warehouseGaps.id, gapId));
};