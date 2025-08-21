// See https://svelte.dev/docs/kit/types#app.d.ts
import type { UserSelectType } from '$lib/schema/auth.schema';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserSelectType | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
