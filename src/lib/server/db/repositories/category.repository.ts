import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getAllCategories = async () => {
    return await db.select().from(categories);
}

export const getIdNameCategory = async () => {
    return await db.select({ id: categories.id, name: categories.name }).from(categories);
}

export const getCategoriesById = async (id: string) => {
    return await db.select().from(categories).where(eq(categories.id, id));
}