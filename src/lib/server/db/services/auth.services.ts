import { hashPassword, type UserPayloadType } from '$lib/server/auth';
import { sql } from '$lib/server/db/conn';
import * as argon2 from 'argon2';
import { websiteRolesSelectSchema, type SessionsSelectType } from '../schema/auth.schema';

export const registerNewUser = async (email: string, password: string) => {
	const hash = await hashPassword(password);
	const result = await sql`
  WITH 
	inserted_user AS (
    INSERT INTO users (email, password_hash) VALUES (${email}, ${hash})
    RETURNING id
  ),
	inserted_role AS (
		INSERT INTO website_roles (user_id, role)
		SELECT id, 'user' FROM inserted_user
		RETURNING user_id
	)
  INSERT INTO users_email_confirmed (user_id, confirmed, token)
  SELECT id, true, gen_random_uuid() FROM inserted_user;
  `;
};

export const validateLogin = async (email: string, password: string): Promise<string | null> => {
	const row = await sql`
		SELECT id, password_hash FROM users WHERE email = ${email} LIMIT 1;
	`;

	if (row.length === 0) {
		console.log('validateLogin(): User not found');
		return null;
	}

	const user = row[0];

	const isValid = argon2.verify(user.password_hash, password);

	if (!isValid) {
		console.log('validateLogin(): Invalid password');
		return null;
	}

	return user.id;
};

export const getAllUsers = async () => {
	const result = await sql`
    SELECT *  FROM users;
  `;

	return result;
};

export const getUserPayload = async (userId: string): Promise<UserPayloadType> => {
	const [row] = await sql`
    SELECT * FROM website_roles WHERE user_id = ${userId}
  `;
	console.log(JSON.stringify(row));
	if (row === undefined) throw new Error('getUserPayload(): didnt return a user');
	const result = websiteRolesSelectSchema.safeParse(row);
	console.log('getUserPayload():', result);
	if (!result.success) {
		throw new Error('getUserPayload(): ' + result.error.message);
	}

	const role = result.data;

	return {
		id: userId,
		websiteRole: role.role
	};
};
// return number of rows invalidated (should only be zero or one)
export const invalidateRefreshToken = async (refreshToken: string): Promise<number> => {
	const result = await sql`
    UPDATE sessions
    SET valid = false
    WHERE refresh_token = ${refreshToken}
		AND valide = true
    RETURNING id;
  `;
	return result.length;
};

export const invalidateAllRefreshTokens = async (userId: string): Promise<number> => {
	const result = await sql`
    UPDATE sessions
    SET valid = false
    WHERE user_id = ${userId}
    RETURNING id;
  `;

	return result.length;
};

export const generateRefreshToken = async (userId: string): Promise<SessionsSelectType> => {
	// !TODO: this should be a transaction to ensure atomicity
	const result = await invalidateAllRefreshTokens(userId);
	console.log('generateRefreshToken(): Invalidated', result, 'tokens for user', userId);

	const [session]: [SessionsSelectType] = await sql`
    INSERT INTO sessions (user_id, refresh_token, valid)
    VALUES (${userId}, gen_random_uuid(), true)
    RETURNING refresh_token, expires_at;
  `;

	if (session === undefined) {
		throw new Error('generateRefreshToken(): Failed to generate refresh token');
	}

	return session;
};
