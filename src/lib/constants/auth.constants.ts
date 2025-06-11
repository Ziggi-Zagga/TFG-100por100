// Patrones de validación
export const PASSWORD_PATTERN =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;
export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const FULLNAME_PATTERN = /^[\p{L}\s'-]+$/u;

export const AUTH_CONSTANTS = {
	ROLES: {
		ADMIN: '1',
		WORKER: '2'
	},
	PASSWORD: {
		MIN_LENGTH: 8,
		MAX_LENGTH: 100
		//PATTERN: PASSWORD_PATTERN
	},
	USERNAME: {
		MIN_LENGTH: 3,
		MAX_LENGTH: 50,
		PATTERN: USERNAME_PATTERN
	},
	SESSION: {
		TOKEN_LENGTH: 64,
		EXPIRY_DAYS: 30,
		RENEWAL_BEFORE_DAYS: 15,
		MAX_LOGIN_ATTEMPTS: 20,
		LOCKOUT_DURATION_MINUTES: 15
	}
} as const;
