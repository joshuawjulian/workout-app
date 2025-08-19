//simple test route to ensure db connection is up and running
import { invalidateAllRefreshTokens } from '$lib/server/db/queries/sessions';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, locals }) => {
	const user = locals.user;
	cookies.delete('access_token', { path: '/' });
	cookies.delete('refresh_token', { path: '/' });
	locals.user = null;
	if (user) {
		await invalidateAllRefreshTokens(user.id);
	}
	redirect(303, '/');
};
