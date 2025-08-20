// src/routes/dashboard/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		// If no user is found in the session, redirect to the login page.
		console.log('/app doesnt see user -> login');
		throw redirect(303, '/');
	}

	console.log('/app does see user -> continue');
	// If the user is authenticated, we can pass their data down to all
	// child pages and the layout itself.
	return {
		user: locals.user
	};
};
