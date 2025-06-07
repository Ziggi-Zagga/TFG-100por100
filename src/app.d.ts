// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import('$lib/types/auth.types').SafeUser | null;
			session: import('$lib/server/services/auth.service').userSession | null;
			loginError?: {
				message: string;
				field?: string;
				type?: string;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
