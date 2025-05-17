import { db } from '$lib/server/db';
import { users, roles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// Obtener todos los usuarios activos con su rol
export const getAllUsers = async () => {
  return await db
    .select({
      id: users.id,
      username: users.username,
      fullName: users.full_name,
      email: users.email,
      lastLogin: users.last_login,
      role: roles.name,
    })
    .from(users)
    .innerJoin(roles, eq(users.rol, roles.id))
    .where(eq(users.active, true));
};

// Obtener usuario por ID
export const getUserById = async (id: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
};

// Crear usuario
export const insertUser = async ({
  id,
  username,
  password_hash,
  email,
  full_name,
  active = true,
  created_at,
  last_login = null,
  rol
}: {
  id: string;
  username: string;
  password_hash: string;
  email: string;
  full_name: string;
  active?: boolean;
  created_at: string;
  last_login?: string | null;
  rol: string;
}) => {
  await db.insert(users).values({
    id,
    username,
    password_hash,
    email,
    full_name,
    active,
    created_at,
    last_login,
    rol
  });
};

// Actualizar usuario
export const updateUser = async (
  id: string,
  data: Partial<{
    username: string;
    password_hash: string;
    email: string;
    full_name: string;
    active: boolean;
    last_login: string;
    rol: string;
  }>
) => {
  await db.update(users).set(data).where(eq(users.id, id));
};

// Eliminar usuario (soft delete: poner active en false)
export const softDeleteUser = async (id: string) => {
  await db.update(users).set({ active: false }).where(eq(users.id, id));
};

// Eliminar usuario (hard delete)
export const deleteUser = async (id: string) => {
  await db.delete(users).where(eq(users.id, id));
};

// Obtener todos los roles
export const getAllRoles = async () => {
  return await db.select().from(roles);
};

