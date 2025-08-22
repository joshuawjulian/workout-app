import { hashPassword, type UserPayloadType } from '$lib/server/auth';
import * as argon2 from 'argon2';
import { websiteRolesSelectSchema, type SessionSelectType } from '../../../schema/auth.schema';
import { db } from '../conn';
import * as roleQueries from '../queries/roles';
import * as sessionQueries from '../queries/sessions';
import * as userQueries from '../queries/users';

export const registerNewUser = async (email: string, password: string) => {
	const hash = await hashPassword(password);
	console.log(`registerNewUser() : hash = ${hash}`);

	return await db.transaction(async (tx) => {
		const user = await userQueries.insertUser(email, hash, tx);

		await roleQueries.insertWebsiteRole(user.id, 'user', tx);

		await roleQueries.insertEmailConfirmation(user.id, true, undefined, tx);

		return user;
	});
};

export const validateLogin = async (email: string, password: string): Promise<string | null> => {
	const user = await userQueries.getUserByEmail(email);

	if (!user) {
		// Perform dummy hash operation to prevent timing attacks
		await argon2.verify('$argon2id$v=19$m=65536,t=3,p=4$dummy$dummy', password);
		return null;
	}

	const isValid = await argon2.verify(user.passwordHash, password);

	if (!isValid) {
		return null;
	}

	return user.id;
};

export const getUserPayload = async (userId: string): Promise<UserPayloadType> => {
	const role = await roleQueries.getWebsiteRoleByUserId(userId);

	if (role === null) throw new Error('getUserPayload(): didnt return a user');

	const result = websiteRolesSelectSchema.safeParse(role);
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
		if (invalidatedCount === 0) {
			// No existing sessions to invalidate, which is fine for new users
		}

		// Generate cryptographically secure random token (32 bytes = 256 bits)
		const tokenBytes = new Uint8Array(32);
		crypto.getRandomValues(tokenBytes);
		const refreshToken = Array.from(tokenBytes, (byte) => byte.toString(16).padStart(2, '0')).join(
			''
		);
		console.log(`refreshToken generated = ${refreshToken}`);

		const session = await sessionQueries.insertSession(userId, refreshToken, true);

		if (!session) {
			throw new Error('generateRefreshToken(): Failed to generate refresh token');
		}

		return session;
	});
};
