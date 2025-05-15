import { db } from '$lib/server/db';
import { manufacturers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getAllManufacturers = async () => {
    return await db.select().from(manufacturers);
}