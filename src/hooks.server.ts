// check if auth token is good. If not, try to refresh with refresh token

import { resetUserTokens, UserPayloadSchema } from '$lib/server/auth';
import { getSessionByRefreshToken } from '$lib/server/db/queries/sessions';
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = event.cookies;
	const accessToken = cookies.get('access_token');
	if (!accessToken) {
		event.locals.user = null;
		return await resolve(event);
	}
	try {
		const results = UserPayloadSchema.safeParse(
			jwt.verify(accessToken, process.env.ACCESS_TOKEN_SIGN || '')
		);
		if (results.success) event.locals.user = results.data;
	} catch (error) {
		console.error('JWT verification failed:', error);

		const refreshToken = cookies.get('refresh_token');
		if (!refreshToken) {
			event.locals.user = null;
		} else {
			const session = await getSessionByRefreshToken(refreshToken);
			if (session) {
				const { userId } = session;
				await resetUserTokens(userId, cookies);
				const newAccessToken = cookies.get('access_token');
				if (!newAccessToken) {
					event.locals.user = null;
				} else {
					// Verify the new access token
					event.locals.user = UserPayloadSchema.safeParse(
						jwt.verify(newAccessToken, process.env.ACCESS_TOKEN_SIGN || '')
					).data;
				}
			}
		}
	}

	return await resolve(event);
};
