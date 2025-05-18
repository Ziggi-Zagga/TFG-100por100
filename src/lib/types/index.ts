import type { AuthUser, userSession } from '$lib/types/auth.types';

export interface Locals {
    user: AuthUser | null;
    session: userSession | null;
}
