const errorMap = new Map<string, { message: string; field?: string; type?: string }>();

export function storeError( error: { message: string; field?: string; type?: string }) {
	errorMap.set('1', error);
	setTimeout(() => errorMap.delete('1'), 5000); 
}

export function getStoredError() {
	const error = errorMap.get('1');
	if (error) errorMap.delete('1'); 
	return error;
}
