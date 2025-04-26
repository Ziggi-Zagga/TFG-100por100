export type ErrorType =
	| 'VALIDATION'
	| 'NOT_FOUND'
	| 'CONFLICT'
	| 'DATABASE'
	| 'UNKNOWN'
	| 'AUTHENTICATION_ERROR'
	| 'FILE_UPLOAD'
	| 'FORBIDDEN'
	| 'FILE_SYSTEM';

export enum ERROR_TYPES {
	VALIDATION = 'VALIDATION',
	NOT_FOUND = 'NOT_FOUND',
	CONFLICT = 'CONFLICT',
	DATABASE = 'DATABASE',
	UNKNOWN = 'UNKNOWN',
	AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
	FILE_UPLOAD = 'FILE_UPLOAD',
	FORBIDDEN = 'FORBIDDEN',
	FILE_SYSTEM = 'FILE_SYSTEM'
}

export type ErrorOptions = {
	field?: string;
	step?: number;
	details?: Record<string, any>;
};

export class ServiceError extends Error {
	public readonly type: ErrorType;
	public readonly status: number;
	public readonly field?: string;
	public readonly details?: Record<string, any>;

	constructor(message: string, type: ErrorType, status: number, options?: ErrorOptions) {
		super(message);
		this.name = 'ServiceError';
		this.type = type;
		this.field = options?.field;
		this.details = options;
		this.status = status;
	}

	toJSON() {
		return {
			message: this.message,
			type: this.type,
			field: this.field,
			details: this.details
		};
	}
}
