import { sql } from '$lib/server/db/conn';

export const getSessionByRefreshToken = async (refreshToken: string) => {
	const session = await sql`
    SELECT * FROM sessions
    WHERE refresh_token = ${refreshToken}
    AND valid = true
    LIMIT 1
  `;
	return session[0] || null;
};
