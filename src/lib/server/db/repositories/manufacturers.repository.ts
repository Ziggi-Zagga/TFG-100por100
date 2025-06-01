import { db } from '$lib/server/db';
import { manufacturers } from '$lib/server/db/schema';
import type { Manufacturer } from '$lib/types/products.types';
import { eq } from 'drizzle-orm';

export const getAllManufacturers = async () => {
    return await db.select().from(manufacturers);
}

export const getIdNameManufacturer = async () => {
    return await db.select({ id: manufacturers.id, name: manufacturers.name }).from(manufacturers);
}

export const getManufacturersById = async (id: string) => {
    return await db.select().from(manufacturers).where(eq(manufacturers.id, id));
}

export const createManufacturer = async (manufacturer: Omit<Manufacturer, 'id'>) => {
    const result = await db.insert(manufacturers).values({
        id: crypto.randomUUID(),
        ...manufacturer
    }).returning();
    return result[0];
}

export const updateManufacturer = async (id: string, manufacturer: Partial<Manufacturer>) => {
    const result = await db.update(manufacturers)
        .set(manufacturer)
        .where(eq(manufacturers.id, id))
        .returning();
    return result[0];
}

export const deleteManufacturer = async (id: string) => {
    const result = await db.delete(manufacturers)
        .where(eq(manufacturers.id, id))
        .returning();
    return result[0];
}
