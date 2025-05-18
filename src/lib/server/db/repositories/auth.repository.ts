import { db } from "..";
import { eq } from "drizzle-orm";
import { users, userSessions, roles } from "../schema";

// --- USUARIOS ---

export async function findUserById(id: string) {
  return db.select().from(users).where(eq(users.id, id)).then(r => r[0]);
}

export async function findUserByEmail(email: string) {
  return db.select().from(users).where(eq(users.email, email)).then(r => r[0]);
}

export async function findUserByUsername(username: string) {
  return db.select().from(users).where(eq(users.username, username)).then(r => r[0]);
}

export async function findRoleByName(name: string) {
  return db.select().from(roles).where(eq(roles.name, name)).then(r => r[0]);
}
export async function getSessionWithUser(token: string) {
	const [result] = await db
		.select({
			user: {
				id: users.id,
				username: users.username,
				email: users.email
			},
			session: userSessions
		})
		.from(userSessions)
		.innerJoin(users, eq(userSessions.userId, users.id))
		.where(eq(userSessions.sessionToken, token));
	return result;
}

export async function createUser({
  id,
  username,
  passwordHash,
  email,
  roleId,
  active = true,
  createdAt,
  lastLogin = null
}: {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
  roleId: string;
  active?: boolean;
  createdAt: Date;
  lastLogin?: Date | null;
}) {
  const [user] = await db.insert(users).values({
    id,
    username,
    passwordHash,
    email,
    roleId,
    active,
    createdAt,
    lastLogin
  }).returning();

  return findUserById(user.id);
}

export async function updateLastLogin(userId: string, lastLogin: Date) {
  await db.update(users).set({ lastLogin }).where(eq(users.id, userId));
}

export async function setActiveStatus(userId: string, active: boolean) {
  await db.update(users).set({ active }).where(eq(users.id, userId));
}

// --- SESIONES ---

export async function createSession({
  sessionId,
  userId,
  sessionToken,
  createdAt,
  expiresAt,
  ipAddress = null,
  userAgent = null
}: {
  sessionId: string;
  userId: string;
  sessionToken: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  await db.insert(userSessions).values({
    sessionId,
    userId,
    sessionToken,
    createdAt,
    expiresAt,
    ipAddress,
    userAgent
  });

  return findSessionByToken(sessionToken);
}

export async function findSessionByToken(sessionToken: string) {
  return db.select().from(userSessions).where(eq(userSessions.sessionToken, sessionToken)).then(r => r[0]);
}

export async function deleteSession(sessionToken: string) {
  await db.delete(userSessions).where(eq(userSessions.sessionToken, sessionToken));
}

export async function updateSessionExpiry(sessionToken: string, expiresAt: Date) {
  await db.update(userSessions).set({ expiresAt }).where(eq(userSessions.sessionToken, sessionToken));
}
