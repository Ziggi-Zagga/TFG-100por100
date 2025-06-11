import { ERROR_TYPES, ServiceError } from '$lib/utils/errors/ServiceError';
import type { AuthUser } from '$lib/types/auth.types';
import { AUTH_CONSTANTS } from '$lib/constants/auth.constants';
import { findUserByEmail, findUserByUsername } from '$lib/server/db/repositories/auth.repository';

export class UserUtils {
	static async validateNewUser(email: string, username: string): Promise<void> {
		const existingEmail = await findUserByEmail(email);
		if (existingEmail) {
			throw new ServiceError('Email already exists', ERROR_TYPES.VALIDATION, 400, {
				field: 'email'
			});
		}

		const existingUsername = await findUserByUsername(username);
		if (existingUsername) {
			throw new ServiceError('Username already exists', ERROR_TYPES.VALIDATION, 400, {
				field: 'username'
			});
		}
	}

	static validateUserStatus(user: AuthUser & { active: boolean }): void {
		if (!user.active) {
			throw new ServiceError('Account is not active', ERROR_TYPES.VALIDATION, 403, {
				field: 'general'
			});
		}
	}

	static createUserData(
		id: string,
		username: string,
		email: string,
		fullName: string
	): Partial<AuthUser> & { full_name: string; active: boolean } {
		return {
			id,
			username,
			email,
			roleId: AUTH_CONSTANTS.ROLES.ADMIN,
			full_name: fullName,
			active: true
		};
	}
}
