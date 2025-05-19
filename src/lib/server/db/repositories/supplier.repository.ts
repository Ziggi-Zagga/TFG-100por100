import { db } from '$lib/server/db';
import { suppliers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getAllSuppliers = async () => {
    return await db.select().from(suppliers);
}