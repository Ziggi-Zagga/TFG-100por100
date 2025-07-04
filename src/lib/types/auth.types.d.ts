export interface AuthUser {
	id: string;
	username: string;
	email: string;
	roleId: string;
}

export interface userSession {
	sessionId: string;
	userId: string;
	sessionHash: string;
	createdAt: Date;
	expiresAt: Date;
	ipAddress?: string | null;
	userAgent?: string | null;
}

export interface AuthResponse {
	user: AuthUser;
	session: userSession;
	token: string;
}

export interface ActionData {
	success?: boolean;
	error?: string;
}

type SafeUser = Pick<AuthUser, 'id' | 'username' | 'email' | 'roleId'>;
