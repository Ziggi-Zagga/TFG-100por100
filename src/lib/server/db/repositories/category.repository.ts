import { db } from '$lib/server/db';
import { categories } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const getAllCategories = async () => {
    return await db.select().from(categories);
}