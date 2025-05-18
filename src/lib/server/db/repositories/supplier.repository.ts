import { db } from '$lib/server/db';
import { suppliers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getAllSuppliers = async () => {
    return await db.select().from(suppliers);
}

export const getIdNameSupplier = async () => {
    return await db.select({ id: suppliers.id, name: suppliers.name }).from(suppliers);
}

export const getSuppliersById = async (id: string) => {
    return await db.select().from(suppliers).where(eq(suppliers.id, id));
}
