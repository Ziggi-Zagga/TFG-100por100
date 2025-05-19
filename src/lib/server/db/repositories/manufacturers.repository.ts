import { db } from '$lib/server/db';
import { manufacturers } from '$lib/server/db/schema';
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
