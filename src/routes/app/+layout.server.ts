// src/routes/dashboard/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// `locals.user` is populated by our server hook (see next section)
	if (!locals.user) {
		// If no user is found in the session, redirect to the login page.
		throw redirect(303, '/');
	}

	// If the user is authenticated, we can pass their data down to all
	// child pages and the layout itself.
	return {
		user: locals.user
	};
};
