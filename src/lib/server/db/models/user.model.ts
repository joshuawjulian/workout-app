import { sql } from '$lib/server/db/conn';
import { userSelectSchema, type UserSelectType } from '../schema/auth.schema';

export const insertUser = async (
	email: string,
	passwordHash: string
): Promise<UserSelectType | null> => {
	const row = await sql`
    INSERT INTO users (email, passwordHash)
    VALUES (${email}, ${passwordHash})
    RETURNING *
  `;
	const result = userSelectSchema.safeParse(row);
	if (result.success) return result.data;
	return null;
};

export const getUserById = async (userId: string): Promise<UserSelectType | null> => {
	const row = await sql`
    SELECT * FROM users
    WHERE id = ${userId}
    LIMIT 1
  `;
	const result = userSelectSchema.safeParse(row[0]);
	if (result.success) return result.data;
	return null;
};
