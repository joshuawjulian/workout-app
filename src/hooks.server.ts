// check if auth token is good. If not, try to refresh with refresh token

import { getUserPayloadFromToken, resetUserTokens } from '$lib/server/auth';
import { getSessionByRefreshToken } from '$lib/server/db/queries/sessions';
import { getUserById } from '$lib/server/db/queries/users';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = event.cookies;
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		event.locals.user = null;
		return await resolve(event);
	}
	try {
		const payload = getUserPayloadFromToken(accessToken);
		event.locals.user = await getUserById(payload.id);
	} catch (error) {
		const refreshToken = cookies.get('refresh_token');
		if (!refreshToken) {
			event.locals.user = null;
		} else {
			const session = await getSessionByRefreshToken(refreshToken);
			if (session) {
				// Verify user still exists before resetting tokens
				const user = await getUserById(session.userId);
				if (user) {
					await resetUserTokens(session.userId, cookies);
					event.locals.user = user;
				} else {
					event.locals.user = null;
				}
			} else {
				event.locals.user = null;
			}
		}
	}

	return await resolve(event);
};
