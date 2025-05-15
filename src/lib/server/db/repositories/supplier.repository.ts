import { db } from '$lib/server/db';
import { stores, sections, storeRows, storeGaps } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getAllStores = async () => {
    return await db.select().from(stores);
}