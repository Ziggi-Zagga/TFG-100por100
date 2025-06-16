import * as authRepository from '../db/repositories/auth.repository';
import { ERROR_TYPES, ServiceError } from '$lib/utils/errors/ServiceError';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { AUTH_CONSTANTS } from '$lib/constants/auth.constants';
import { SessionManager } from '$lib/utils/auth/session.utils';
import { ValidationUtils } from '$lib/utils/auth/validation.utils';
import { UserUtils } from '$lib/utils/auth/user.utils';
import type { AuthUser, userSession } from '$lib/types/auth.types';
import crypto from 'crypto';
import argon2 from 'argon2';

setInterval(
	() => {
		SessionManager.cleanupLoginAttempts();
	},
	60 * 60 * 1000
);

export const updateSessionExpiry = async (token: string, expiryDate: Date): Promise<boolean> => {
	return (await authRepository.updateSessionExpiry(token, expiryDate)) ?? false;
};
export async function validateSession(token: string) {
	const result = await authRepository.getSessionWithUser(token);
	if (!result) return { session: null, user: null };

	const { session, user } = result;
	const now = Date.now();

	if (!session) {
		console.error('Session not found');
		return { session: null, user: null };
	}

	if (now >= session.expiresAt.getTime()) {
		await authRepository.deleteSession(session.sessionId);
		return { session: null, user: null };
	}

	const shouldRenew = now >= session.expiresAt.getTime() - 15 * 24 * 60 * 60 * 1000; // 15 días antes de expirar
	if (shouldRenew) {
		const newExpiry = new Date(now + 30 * 24 * 60 * 60 * 1000);
		const updated = await updateSessionExpiry(session.sessionId, newExpiry);
		if (updated) {
			session.expiresAt = newExpiry;
		} else {
			console.error('Failed to update session expiry');
		}
	}

	return { session, user };
}

export async function createSession(
	token: string,
	userId: string,
	ip?: string,
	userAgent?: string
): Promise<userSession | null> {
	const now = Date.now();
	const expiresAt = new Date(now + 30 * 24 * 60 * 60 * 1000);

	const session = await authRepository.createSession({
		sessionId: crypto.randomUUID(),
		userId,
		sessionToken: token,
		createdAt: new Date(now),
		expiresAt,
		ipAddress: ip || null,
		userAgent: userAgent || null
	});

	if (!session) {
		console.error('Failed to create session');
		return null;
	}

	return session;
}

export async function login(
	identifier: string,
	password: string,
	ip: string = 'unknown',
	userAgent?: string
): Promise<{ user: AuthUser; session: userSession; token: string } | null> {
	try {
		SessionManager.checkLoginAttempts(ip);
		ValidationUtils.validateRequiredFields({ identifier, password }, ['identifier', 'password']);

		const user =
			(await authRepository.findUserByEmail(identifier)) ||
			(await authRepository.findUserByUsername(identifier));

		if (!user) {
			throw new ServiceError('Invalid credentials', ERROR_TYPES.VALIDATION, 400, {
				field: 'identifier'
			});
		}

		UserUtils.validateUserStatus(user);

		const validPassword = await verify(password, user.passwordHash);
		if (!validPassword) {
			const attemptsLeft = SessionManager.incrementLoginAttempts(ip);
			throw new ServiceError(
				`Invalid password. ${attemptsLeft} attempts remaining`,
				ERROR_TYPES.VALIDATION,
				400,
				{
					field: 'password'
				}
			);
		}

		SessionManager.resetLoginAttempts(ip);
		const token = SessionManager.generateToken();
		const session = await createSession(token, user.id, ip, userAgent);

		if (!session) {
			console.error('Failed to create session');
			return null;
		}

		if (typeof session.expiresAt === 'number') {
			session.expiresAt = new Date(session.expiresAt);
		}
		if (typeof session.createdAt === 'number') {
			session.createdAt = new Date(session.createdAt);
		}

		await authRepository.updateLastLogin(user.id, new Date());
		return {
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				roleId: user.roleId ?? '2'
			},
			session,
			token
		};
	} catch (error) {
		console.error('[authService.login][ERROR]', error);
		return null;
	}
}

export async function signup(
	email: string,
	username: string,
	password: string,
	confirmPassword: string,
	ip: string,
	userAgent?: string,
	event?: RequestEvent
): Promise<{ user: AuthUser; session: userSession; token: string } | null> {
	try {
		ValidationUtils.validateRequiredFields(
			{ email, username, password, confirmPassword, ip, userAgent },
			['email', 'username', 'password', 'confirmPassword', 'ip', 'userAgent']
		);
		ValidationUtils.validateEmail(email);
		ValidationUtils.validateUsername(username);
		ValidationUtils.validatePassword(password);

		if (password !== confirmPassword) {
			throw new ServiceError('Passwords do not match', ERROR_TYPES.VALIDATION, 400, {
				field: 'confirmPassword'
			});
		}

		await UserUtils.validateNewUser(email, username);
		const passwordHash = await hash(password);
		const id = crypto.randomUUID();

		const user = await authRepository.createUser({
			id,
			username,
			email,
			passwordHash,
			roleId: AUTH_CONSTANTS.ROLES.WORKER,
			active: true,
			createdAt: new Date()
		});

		const token = SessionManager.generateToken();
		const session = await createSession(token, user.id, ip, userAgent);

		if (!session) {
			console.error('Failed to create session');
			return null;
		}

		if (event) {
			event.cookies.set('auth-session', token, {
				path: '/',
				expires: session.expiresAt,
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax'
			});

			event.locals.user = user;
			event.locals.session = session;
			throw redirect(302, '/dashboard');
		}

		return {
			user: { id: user.id, username: user.username, email: user.email, roleId: user.roleId ?? '2' },
			session,
			token
		};
	} catch (error) {
		console.error('Signup error:', error);
		return null;
	}
}

export async function hash(password: string): Promise<string> {
	return await argon2.hash(password, {
		type: argon2.argon2id,
		memoryCost: 2 ** 16,
		timeCost: 3,
		parallelism: 1
	});
}

export async function verify(password: string, hash: string): Promise<boolean> {
	return await argon2.verify(hash, password);
}
