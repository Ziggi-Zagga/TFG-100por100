import { fail } from '@sveltejs/kit';
import { ServiceError } from './ServiceError';

export const basicErrorHandler = (error: any) => {
	if (error instanceof ServiceError) {
		return fail(error.status, {
			message: error.message,
			type: error.type,
			details: error?.details
		});
	} else {
		return fail(500, {
			success: false,
			message: 'An unexpected error occurred'
		});
	}
};

export const serializedError = (error: any) => {
	console.error(error);
	if (error instanceof ServiceError) {
		return fail(error.status, {
			error: error.toJSON()
		});
	}
	return error;
};
