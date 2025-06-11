import { AUTH_CONSTANTS } from '$lib/constants/auth.constants';
import type { userSession } from '$lib/types/auth.types';
import crypto from 'crypto';
import { encodeBase64url } from '@oslojs/encoding';

export class SessionManager {
	private static loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

	static generateToken(): string {
		const buffer = crypto.randomBytes(AUTH_CONSTANTS.SESSION.TOKEN_LENGTH / 2);
		return encodeBase64url(buffer);
	}

	static createSessionData(
		userId: string,
		token: string,
		ip?: string,
		userAgent?: string
	): userSession {
		return {
			sessionId: crypto.randomUUID(),
			userId,
			sessionHash: token,
			createdAt: new Date(),
			expiresAt: new Date(Date.now() + AUTH_CONSTANTS.SESSION.EXPIRY_DAYS * 24 * 60 * 60 * 1000),
			ipAddress: ip || null,
			userAgent: userAgent || null
		};
	}

	static checkLoginAttempts(ip: string): void {
		const attempts = this.loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
		const now = Date.now();

		if (now - attempts.lastAttempt > AUTH_CONSTANTS.SESSION.LOCKOUT_DURATION_MINUTES * 60 * 1000) {
			attempts.count = 0;
		}

		if (attempts.count >= AUTH_CONSTANTS.SESSION.MAX_LOGIN_ATTEMPTS) {
			const timeLeft = Math.ceil(
				(AUTH_CONSTANTS.SESSION.LOCKOUT_DURATION_MINUTES * 60 * 1000 -
					(now - attempts.lastAttempt)) /
					1000 /
					60
			);
			throw new Error(`Too many failed login attempts. Please try again in ${timeLeft} minutes`);
		}
	}

	static incrementLoginAttempts(ip: string): number {
		const attempts = this.loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
		attempts.count++;
		attempts.lastAttempt = Date.now();
		this.loginAttempts.set(ip, attempts);
		return AUTH_CONSTANTS.SESSION.MAX_LOGIN_ATTEMPTS - attempts.count;
	}

	static resetLoginAttempts(ip: string): void {
		this.loginAttempts.delete(ip);
	}

	static cleanupLoginAttempts(): void {
		const now = Date.now();
		for (const [ip, data] of this.loginAttempts.entries()) {
			if (now - data.lastAttempt > AUTH_CONSTANTS.SESSION.LOCKOUT_DURATION_MINUTES * 60 * 1000) {
				this.loginAttempts.delete(ip);
			}
		}
	}
}
