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

export const insertCategory = async ({
    id,
    name,
    description,
    parentId
}: {
    id: string;
    name: string;
    description: string;
    parentId: string;
}) => {
    await db.insert(categories).values({
        id,
        name,
        description,
        parentId
    });
};

export const repoDeleteCategory = async (id: string) => {
    await db.delete(categories).where(eq(categories.id, id));
};

export const repoUpdateCategory = async ({
    id,
    name,
    description,
    parentId
}: {
    id: string;
    name: string;
    description: string;
    parentId: string;
}) => {
    await db.update(categories).set({
        name,
        description,
        parentId
    }).where(eq(categories.id, id));
};

