	import { db } from '$lib/server/db';
import { warehouses, sections, warehouseRows, warehouseGaps } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getFullwarehouseTree = async () => {
	return await db
		.select({
			warehouseId: warehouses.id,
			warehouseName: warehouses.name,
			warehouseLocation: warehouses.location,
			sectionId: sections.id,
			sectionName: sections.name,
			rowId: warehouseRows.id,
			rowName: warehouseRows.name,
			gapId: warehouseGaps.id,
			gapName: warehouseGaps.name
		})
		.from(warehouses)
		.leftJoin(sections, eq(sections.warehouseId, warehouses.id))
		.leftJoin(warehouseRows, eq(warehouseRows.sectionId, sections.id))
		.leftJoin(warehouseGaps, eq(warehouseGaps.rowId, warehouseRows.id));
};

export const getAllwarehouse = async () => {
	return await db.select().from(warehouses);
};

export const getSectionsByWarehouseId = async (warehouseId: string) => {
    return await db
        .select()
        .from(sections)
        .where(eq(sections.warehouseId, warehouseId));
};

export const getwarehouseAndSections = async (warehouseId: string) => {
    try {
        const warehouseData = await db.query.warehouses.findFirst({
            where: (wh, { eq }) => eq(wh.id, warehouseId)
        });
        
        if (!warehouseData) {
            return { warehouse: null, sections: [] };
        }
        
        const sectionsList = await db.select()
            .from(sections)
            .where(eq(sections.warehouseId, warehouseId));
            
        return { 
            warehouse: warehouseData, 
            sections: sectionsList 
        };
    } catch (error) {
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
	await db.insert(warehouses).values({ id, name, location, description });
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
	location,
	name,
	description
}: {
	id: string;
	warehouseId: string;
	location: string;
	name: string;
	description?: string;
}) => {
	await db.insert(sections).values({
		id,
		warehouseId,
		location,
		name,
		description
	});
};

export const insertRow = ({
	id,
	sectionId,
	name,
	location,
	description
}: {
	id: string;
	sectionId: string;
	name: string;
	location?: string | null;
	description?: string;
}) => {
	return db.transaction(async (tx) => {
		const [newRow] = await tx
			.insert(warehouseRows)
			.values({
				id,
				sectionId,
				name,
				location: location ?? null,
				description: description ?? null
			})
			.returning();

		return newRow;
	});
};

export const insertGap = async ({
	id,
	rowId,
	name,
	capacity,
	description
}: {
	id: string;
	rowId: string;
	name: string;
	capacity?: number;
	description?: string;
}) => {
	await db.insert(warehouseGaps).values({
		id,
		rowId,
		name,
		capacity,
		description
	});
};

export const updatewarehouse = async (id: string, data: { 
   	warehouseId: string,
	updatedData: Partial<typeof warehouses.$inferInsert>
}) => {
    const [updatedwarehouse] = await db
        .update(warehouses)
        .set({
            name: data.updatedData.name,
            location: data.updatedData.location ?? null,
            description: data.updatedData.description ?? null,
        })
        .where(eq(warehouses.id, id))
        .returning();

    return updatedwarehouse;
};

export const removewarehouse = async (id: string) => {
	await db.delete(warehouses).where(eq(warehouses.id, id));
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

export const updateSection = async (id: string, data: Partial<typeof sections.$inferInsert>) => {
    try {
        const [updatedSection] = await db
            .update(sections)
            .set({
                name: data.name,
                location: data.location ?? null,
                description: data.description ?? null,
            })
            .where(eq(sections.id, id))
            .returning();

        return updatedSection;
    } catch (error) {
        throw error;
    }
};

export const updateRow = async (id: string, data: Partial<typeof warehouseRows.$inferInsert>) => {
	const updateData: Record<string, any> = {
		...data,
		updatedAt: new Date()
	};

	// Asegurarse de que los campos opcionales se manejen correctamente
	if ('location' in data) {
		updateData.location = data.location ?? null;
	}
	if ('description' in data) {
		updateData.description = data.description ?? null;
	}

	const [updatedRow] = await db
		.update(warehouseRows)
		.set(updateData)
		.where(eq(warehouseRows.id, id))
		.returning();

	return updatedRow;
};

export const updateGap = async (id: string, data: Partial<typeof warehouseGaps.$inferInsert>) => {
    const [updatedGap] = await db
        .update(warehouseGaps)
        .set({
            name: data.name,
            capacity: data.capacity ?? null,
            description: data.description ?? null,
        })
        .where(eq(warehouseGaps.id, id))
        .returning();

    return updatedGap;
};

export const repoGetTreeFromGapId = async (gapId: string) => {
	return await db
		.select({
			warehouseId: warehouses.id,
			warehouseName: warehouses.name,
			warehouseLocation: warehouses.location,
			sectionId: sections.id,
			sectionName: sections.name,
			rowId: warehouseRows.id,
			rowName: warehouseRows.name,
			gapId: warehouseGaps.id,
			gapName: warehouseGaps.name
		})
		.from(warehouses)
		.innerJoin(sections, eq(sections.warehouseId, warehouses.id))
		.innerJoin(warehouseRows, eq(warehouseRows.sectionId, sections.id))
		.innerJoin(warehouseGaps, eq(warehouseGaps.rowId, warehouseRows.id))
		.where(eq(warehouseGaps.id, gapId));
};