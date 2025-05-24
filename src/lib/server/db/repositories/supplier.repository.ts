import { db } from '$lib/server/db';
import { suppliers } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export interface Supplier {
    id?: string;
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    website?: string;
    notes?: string;
}

export const getAllSuppliers = async () => {
    return await db.select().from(suppliers);
}

export const getIdNameSupplier = async () => {
    return await db.select({ id: suppliers.id, name: suppliers.name }).from(suppliers);
}

export const getSuppliersById = async (id: string) => {
    return await db.select().from(suppliers).where(eq(suppliers.id, id));
}

export const getSupplierByName = async (name: string) => {
    return await db.select().from(suppliers).where(eq(suppliers.name, name));
}

export const createSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    const result = await db.insert(suppliers).values({
        id: crypto.randomUUID(),
        ...supplier
    }).returning();
    return result[0];
}

export const updateSupplier = async (id: string, supplier: Partial<Supplier>) => {
    const result = await db.update(suppliers)
        .set(supplier)
        .where(eq(suppliers.id, id))
        .returning();
    return result[0];
}

export const deleteSupplier = async (id: string) => {
    const result = await db.delete(suppliers)
        .where(eq(suppliers.id, id))
        .returning();
    return result[0];
}
