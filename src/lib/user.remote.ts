import { getRequestEvent, query } from '$app/server';
import type { RequestEvent } from '@sveltejs/kit';

export const isLoggedIn = query(async () => {
	const { locals }: RequestEvent = getRequestEvent();
	return locals.user !== null;
});

export const getLoggedInEmail = query(async () => {
	const { locals } = getRequestEvent();
	console.log('getLoggedInEmail()' + JSON.stringify(locals));
	const user = locals.user;
	if (user === null) return 'null';
	return user?.email;
});
