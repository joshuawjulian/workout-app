import { hashPassword, type UserPayloadType } from '$lib/server/auth';
import * as argon2 from 'argon2';
import { db } from '../conn';
import * as roleQueries from '../queries/roles';
import * as sessionQueries from '../queries/sessions';
import * as userQueries from '../queries/users';
import { websiteRolesSelectSchema, type SessionSelectType } from '../schema/auth.schema';

export const registerNewUser = async (email: string, password: string) => {
	console.log('registerNewUser(): Registering new user with email:', email);

	const hash = await hashPassword(password);

	return await db.transaction(async (tx) => {
		const user = await userQueries.insertUser(email, hash, tx);

		await roleQueries.insertWebsiteRole(user.id, 'user', tx);

		await roleQueries.insertEmailConfirmation(user.id, true, undefined, tx);

		console.log('registerNewUser(): Successfully created user:', user.id);
		return user;
	});
};

export const validateLogin = async (email: string, password: string): Promise<string | null> => {
	const user = await userQueries.getUserByEmail(email);

	if (!user) {
		console.log('validateLogin(): User not found');
		return null;
	}

	console.log('validateLogin():' + user.passwordHash);

	const isValid = await argon2.verify(user.passwordHash, password);

	if (!isValid) {
		console.log('validateLogin(): Invalid password');
		return null;
	}

	return user.id;
};

export const getUserPayload = async (userId: string): Promise<UserPayloadType> => {
	const role = await roleQueries.getWebsiteRoleByUserId(userId);

	console.log(JSON.stringify(role));
	if (role === null) throw new Error('getUserPayload(): didnt return a user');

	const result = websiteRolesSelectSchema.safeParse(role);
	console.log('getUserPayload():', result);
	if (!result.success) {
		throw new Error('getUserPayload(): ' + result.error.message);
	}

	return {
		id: userId,
		websiteRole: result.data.role
	};
};

export const generateRefreshToken = async (userId: string): Promise<SessionSelectType> => {
	return await db.transaction(async (tx) => {
		const invalidatedCount = await sessionQueries.invalidateAllRefreshTokens(userId);
		console.log('generateRefreshToken(): Invalidated', invalidatedCount, 'tokens for user', userId);

		const session = await sessionQueries.insertSession(userId, crypto.randomUUID(), true);

		if (!session) {
			throw new Error('generateRefreshToken(): Failed to generate refresh token');
		}

		return session;
	});
};

// Re-export session functions for convenience
export const invalidateRefreshToken = sessionQueries.invalidateRefreshToken;
export const invalidateAllRefreshTokens = sessionQueries.invalidateAllRefreshTokens;
export const getSessionByRefreshToken = sessionQueries.getSessionByRefreshToken;
