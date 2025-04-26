import { db } from "..";
import { eq } from "drizzle-orm";
import { users, userSessions } from "../schema";

// Buscar usuario por id
export async function findUserById(id: number) {
  return db.select().from(users).where(eq(users.id, id)).then(r => r[0]);
}

// Buscar usuario por email
export async function findUserByEmail(email: string) {
  return db.select().from(users).where(eq(users.email, email)).then(r => r[0]);
}

// Crear usuario
export async function createUser({
  username,
  password_hash,
  salt,
  email,
  full_name,
  active = true,
  created_at,
  last_login = null
}: {
  username: string,
  password_hash: string,
  salt: string,
  email: string,
  full_name: string,
  active?: boolean,
  created_at: string,
  last_login?: string | null
}) {
  const [user] = await db.insert(users).values({
    username,
    password_hash,
    salt,
    email,
    full_name,
    active,
    created_at,
    last_login
  }).returning();
  return findUserById(user.id);
}


export async function updateLastLogin(userId: number, lastLogin: string) {
  await db.update(users).set({ last_login: lastLogin }).where(eq(users.id, userId));
}


export async function setActiveStatus(userId: number, active: boolean) {
  await db.update(users).set({ active }).where(eq(users.id, userId));
}

// --- SESIONES ---

export async function createSession({
  user_id,
  session_token,
  created_at,
  expires_at,
  ip_address = null,
  user_agent = null
}: {
  user_id: number,
  session_token: string,
  created_at: string,
  expires_at: string,
  ip_address?: string | null,
  user_agent?: string | null
}) {
  const [id] = await db.insert(userSessions).values({
    user_id,
    session_token,
    created_at,
    expires_at,
    ip_address,
    user_agent
  });
  return findSessionByToken(session_token);
}

export async function findSessionByToken(session_token: string) {
  return db.select().from(userSessions).where(eq(userSessions.session_token, session_token)).then(r => r[0]);
}

export async function deleteSession(session_token: string) {
  await db.delete(userSessions).where(eq(userSessions.session_token, session_token));
}

export async function updateSessionExpiry(session_token: string, expires_at: string) {
  await db.update(userSessions).set({ expires_at }).where(eq(userSessions.session_token, session_token));
}