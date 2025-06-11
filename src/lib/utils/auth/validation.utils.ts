import { AUTH_CONSTANTS, EMAIL_PATTERN, FULLNAME_PATTERN } from '$lib/constants/auth.constants';
import { ERROR_TYPES, ServiceError } from '$lib/utils/errors/ServiceError';

export class ValidationUtils {
	static validatePassword(password: string): void {
		if (
			password.length < AUTH_CONSTANTS.PASSWORD.MIN_LENGTH ||
			password.length > AUTH_CONSTANTS.PASSWORD.MAX_LENGTH
		) {
			throw new ServiceError(
				`Password must be between ${AUTH_CONSTANTS.PASSWORD.MIN_LENGTH} and ${AUTH_CONSTANTS.PASSWORD.MAX_LENGTH} characters`,
				ERROR_TYPES.VALIDATION,
				400,
				{ field: 'password' }
			);
		}
		/*if (!AUTH_CONSTANTS.PASSWORD.PATTERN.test(password)) {
      throw new ServiceError(
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        ERROR_TYPES.VALIDATION,
        400,
        { field: 'password' }
      );
    }*/
	}

	static validateUsername(username: string): void {
		if (
			username.length < AUTH_CONSTANTS.USERNAME.MIN_LENGTH ||
			username.length > AUTH_CONSTANTS.USERNAME.MAX_LENGTH
		) {
			throw new ServiceError(
				`Username must be between ${AUTH_CONSTANTS.USERNAME.MIN_LENGTH} and ${AUTH_CONSTANTS.USERNAME.MAX_LENGTH} characters`,
				ERROR_TYPES.VALIDATION,
				400,
				{ field: 'username' }
			);
		}
		if (!AUTH_CONSTANTS.USERNAME.PATTERN.test(username)) {
			throw new ServiceError(
				'Username can only contain letters, numbers, underscores and hyphens',
				ERROR_TYPES.VALIDATION,
				400,
				{ field: 'username' }
			);
		}
	}

	static validateEmail(email: string): void {
		if (!EMAIL_PATTERN.test(email)) {
			throw new ServiceError('Invalid email format', ERROR_TYPES.VALIDATION, 400, {
				field: 'email'
			});
		}
	}

	static validateFullName(fullName: string): void {
		if (!FULLNAME_PATTERN.test(fullName)) {
			throw new ServiceError('Invalid full name format', ERROR_TYPES.VALIDATION, 400, {
				field: 'fullName'
			});
		}
	}

	static validateRequiredFields(fields: Record<string, any>, fieldNames: string[]): void {
		for (const field of fieldNames) {
			if (!fields[field]) {
				throw new ServiceError(`${field} is required`, ERROR_TYPES.VALIDATION, 400, { field });
			}
		}
	}
}
