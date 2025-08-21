// src/routes/dashboard/+layout.server.ts
import { getWebsiteRoleByUserId } from '$lib/server/db/queries/roles';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		// If no user is found in the session, redirect to the login page.
		console.log('/app doesnt see user -> login');
		throw redirect(303, '/');
	}

	// user needs to be a website admin or editor to have access to these pages.
	const websiteRole = await getWebsiteRoleByUserId(locals.user.id);
	if (websiteRole === null || websiteRole.role === 'user')
		error(403, 'Not sufficient status for dictionary tables');
	return {
		user: locals.user
	};
};
