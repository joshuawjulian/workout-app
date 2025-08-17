import { getRequestEvent, query } from '$app/server';

export const getLoggedInEmail = query(async () => {
	const { locals } = getRequestEvent();
	const user = locals.user;
	if (!user) {
		return {
			success: false,
			message: 'User not logged in'
		};
	}

	return {
		success: true,
		email: user.email
	};
});
