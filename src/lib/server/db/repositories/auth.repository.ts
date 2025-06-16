import { db } from '..';
import { eq } from 'drizzle-orm/expressions';
import { users, userSessions, roles } from '../schema';
import * as argon2 from 'argon2';

export const { hash, verify } = argon2;

export async function findUserById(id: string) {
	return db
		.select()
		.from(users)
		.where(eq(users.id, id))
		.then((r) => r[0]);
}

export async function findUserByEmail(email: string) {
	return db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.then((r) => r[0]);
}

export async function findUserByUsername(username: string) {
	return db
		.select()
		.from(users)
		.where(eq(users.username, username))
		.then((r) => r[0]);
}

export async function findRoleByName(name: string) {
	return db
		.select()
		.from(roles)
		.where(eq(roles.name, name))
		.then((r) => r[0]);
}
export async function getSessionWithUser(token: string) {
	const session = await findSessionByToken(token);
	if (!session) return null;

	const result = await db
		.select({
			user: {
				id: users.id,
				username: users.username,
				email: users.email,
				roleId: users.roleId
			},
			session: userSessions
		})
		.from(userSessions)
		.innerJoin(users, eq(userSessions.userId, users.id))
		.where(eq(userSessions.sessionId, session.sessionId))
		.then((r) => r[0]);

	return result || null;
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
	const [user] = await db
		.insert(users)
		.values({
			id,
			username,
			passwordHash,
			email,
			roleId,
			active,
			createdAt,
			lastLogin
		})
		.returning();

	return findUserById(user.id);
}

export async function updateLastLogin(userId: string, lastLogin: Date) {
	await db.update(users).set({ lastLogin }).where(eq(users.id, userId));
}

export async function setActiveStatus(userId: string, active: boolean) {
	await db.update(users).set({ active }).where(eq(users.id, userId));
}

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
	const sessionHash = await hash(sessionToken);

	const [session] = await db
		.insert(userSessions)
		.values({
			sessionId,
			userId,
			sessionHash,
			createdAt,
			expiresAt,
			ipAddress,
			userAgent
		})
		.returning();

	return session;
}

export async function findSessionByToken(sessionToken: string) {
	const allSessions = await db.select().from(userSessions);

	for (const session of allSessions) {
		try {
			if (session.sessionHash.startsWith('$argon2')) {
				if (await verify(session.sessionHash, sessionToken)) {
					return session;
				}
			} else if (session.sessionHash === sessionToken) {
				const hashedToken = await hash(sessionToken);
				await db
					.update(userSessions)
					.set({ sessionHash: hashedToken })
					.where(eq(userSessions.sessionId, session.sessionId));
				return session;
			}
		} catch (error) {
			console.error('Error verifying session token:', error);
		}
	}

	return null;
}

export async function deleteSession(sessionToken: string) {
	const session = await findSessionByToken(sessionToken);
	if (!session) return false;

	await db.delete(userSessions).where(eq(userSessions.sessionId, session.sessionId));

	return true;
}

export async function updateSessionExpiry(sessionToken: string, expiresAt: Date) {
	const session = await findSessionByToken(sessionToken);
	if (!session) return false;

	await db
		.update(userSessions)
		.set({ expiresAt })
		.where(eq(userSessions.sessionId, session.sessionId));

	return true;
}
