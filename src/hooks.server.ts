// check if auth token is good. If not, try to refresh with refresh token

import { getUserPayloadFromToken, isTokenExpired, refreshTokens } from '$lib/server/auth';
import { getUserById } from '$lib/server/db/queries/users';
import type { UserSelectType } from '$lib/server/db/schema/auth.schema';
import type { Handle } from '@sveltejs/kit';

/**
 * A Map to store user-specific token refresh promises.
 * The key is the user's refresh token, and the value is the Promise
 * handling the refresh operation.
 */
const activeRefreshPromises = new Map<string, Promise<UserSelectType>>();

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = event.cookies;
	const accessToken = cookies.get('access_token');
	const refreshToken = cookies.get('refresh_token');

	if (accessToken === undefined && refreshToken === undefined) {
		console.log('hooks.server.ts - accessToken and refreshToken are undefined');
		event.locals.user = null;
		return await resolve(event);
	}
	console.log('hooks.server.ts - accessToken is defined');

	if (accessToken !== undefined && !isTokenExpired(accessToken)) {
		console.log('hooks.server.ts - accessToken is not expired');
		const payload = getUserPayloadFromToken(accessToken);

		//!TODO: Localized this to stop hitting the database so much
		event.locals.user = await getUserById(payload.id);
		return await resolve(event);
	}
	console.log('hooks.server.ts - accessToken is expired');

	if (refreshToken === undefined) {
		console.log('hooks.server.ts - refreshToken === undefined');
		event.locals.user = null;
		return await resolve(event);
	}
	console.log('hooks.server.ts - refreshToken is defined');

	// Check if a refresh for this specific user is already in progress.
	let refreshPromise = activeRefreshPromises.get(refreshToken);

	if (!refreshPromise) {
		// No refresh in progress for this user, so this request will start it.
		console.log(`Starting new token refresh for user with token: ...${refreshToken.slice(-6)}`);

		refreshPromise = refreshTokens(refreshToken, cookies).finally(() => {
			// IMPORTANT: Clean up the map once the refresh is complete.
			console.log(`Cleaning up refresh promise for token: ...${refreshToken.slice(-6)}`);
			activeRefreshPromises.delete(refreshToken);
		});
	} else {
		console.log(
			`Waiting for existing token refresh for user with token: ...${refreshToken.slice(-6)}`
		);
	}
	// Store the promise in the map so other parallel requests can wait for it.
	activeRefreshPromises.set(refreshToken, refreshPromise);
	try {
		// Wait for the single refresh operation to complete.
		event.locals.user = await refreshPromise;
	} catch (error) {
		// The refresh failed (e.g., refresh token was invalid).
		// We must log the user out completely.
		console.error('Token refresh failed, logging out:', error);
		cookies.delete('accessToken', { path: '/' });
		cookies.delete('refreshToken', { path: '/' });
		event.locals.user = null;
		// Proceed as a logged-out user.
		return await resolve(event);
	}

	return await resolve(event);
};
