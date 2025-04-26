import { findUserById, createUser as repoCreateUser, createSession as repoCreateSession, findSessionByToken, updateSessionExpiry, deleteSession, updateLastLogin } from '../db/repositories/login.repository';

import { encodeBase64url } from '@oslojs/encoding';
import { ERROR_TYPES, ServiceError } from '$lib/utils/errors/ServiceError';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

const HASH_CONFIG = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1
};

export async function validateSession(token: string): Promise<{ session: any | null; user: AuthUser | null }> {
  const session = await findSessionByToken(token);
  if (!session) {
    return { session: null, user: null };
  }
  const user = await findUserById(session.user_id);
  if (!user) {
    await deleteSession(token);
    return { session: null, user: null };
  }
  const sessionExpired = Date.now() >= new Date(session.expires_at).getTime();
  if (sessionExpired) {
    await deleteSession(token);
    return { session: null, user: null };
  }

  // Renew session if expires in less than 15 days
  const renewSession = Date.now() >= new Date(session.expires_at).getTime() - 15 * 24 * 60 * 60 * 1000;
  if (renewSession) {
    const newExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await updateSessionExpiry(token, newExpiry.toISOString());
    session.expires_at = newExpiry.toISOString();
  }
  return { session, user: { id: user.id, username: user.username, email: user.email } };
}


export async function createSession(token: string, userId: number, username: string): Promise<any> {
  const session = await repoCreateSession({
    user_id: userId,
    session_token: token,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    ip_address: null,
    user_agent: null
  });
  return session;
}


export async function login(email: string, password: string): Promise<{ user: AuthUser; session: any; token: string } | null> {
  if (!email) {
    throw new ServiceError('Email is required', ERROR_TYPES.VALIDATION, 400, { field: 'email' });
  }
  if (!password) {
    throw new ServiceError('Password is required', ERROR_TYPES.VALIDATION, 400, { field: 'password' });
  }
  // Find user by email
  const user = await findUserById(email);
  if (!user) {
    throw new ServiceError('Email does not exist', ERROR_TYPES.VALIDATION, 400, { field: 'email' });
  }
  const validPassword = await verify(user.password_hash, password, HASH_CONFIG);
  if (!validPassword) {
    throw new ServiceError('Invalid password', ERROR_TYPES.VALIDATION, 400, { field: 'password' });
  }
  const token = generateSessionToken();
  const session = await createSession(token, user.id, user.username);
  await updateLastLogin(user.id, new Date().toISOString());
  return {
    user: { id: user.id, username: user.username, email: user.email },
    session,
    token
  };
}

export async function signup(email: string, username: string, password: string, confirmPassword: string): Promise<{ user: AuthUser; session: any; token: string }> {
  if (!email) {
    throw new ServiceError('Email is required', ERROR_TYPES.VALIDATION, 400, { field: 'email' });
  }
  if (!username) {
    throw new ServiceError('Username is required', ERROR_TYPES.VALIDATION, 400, { field: 'username' });
  }
  if (!password) {
    throw new ServiceError('Password is required', ERROR_TYPES.VALIDATION, 400, { field: 'password' });
  }
  if (password !== confirmPassword) {
    throw new ServiceError('Passwords do not match', ERROR_TYPES.VALIDATION, 400, { field: 'confirmPassword' });
  }
  const salt = crypto.getRandomValues(new Uint8Array(16)).join('');
  const password_hash = await hash(password, { ...HASH_CONFIG, salt });
  const user = await repoCreateUser({
    username,
    password_hash,
    salt,
    email,
    full_name: username,
    created_at: new Date().toISOString(),
    active: true
  });
  const token = generateSessionToken();
  const session = await createSession(token, user.id, user.username);
  return {
    user: { id: user.id, username: user.username, email: user.email },
    session,
    token
  };
}

function generateSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18));
  return encodeBase64url(bytes);
}

// Helper to find user by email
async function findUserByEmail(email: string) {
  // You need to implement this in your repository!
  const users = await import('../db/schema');
  const db = await import('../db');
  const { eq } = await import('drizzle-orm');
  const result = await db.db.select().from(users.users).where(eq(users.users.email, email));
  return result[0];
}