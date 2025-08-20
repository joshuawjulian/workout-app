import { type Cookies } from '@sveltejs/kit';
import * as argon2 from 'argon2';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import z from 'zod';
import { getUserById } from './db/queries/users';
import { type SessionSelectType, type UserSelectType } from './db/schema/auth.schema';
import { generateRefreshToken, getSessionByRefreshToken, getUserPayload } from './db/services/auth';

export const hashPassword = async (password: string): Promise<string> => {
	return await argon2.hash(password);
};

export const userPayloadSchema = z.object({
	id: z.string(),
	websiteRole: z.enum(['super', 'admin', 'user'])
});

export type UserPayloadType = z.infer<typeof userPayloadSchema>;

export const generateAccessToken = async (userId: string): Promise<string> => {
	const jwtSecret = process.env.ACCESS_TOKEN_SIGN;
	if (!jwtSecret) {
		throw new Error('ACCESS_TOKEN_SIGN environment variable is required');
	}

	const payload = await getUserPayload(userId);
	return jwt.sign(payload, jwtSecret, {
		expiresIn: '10s',
		algorithm: 'HS256'
	});
};

export const getUserPayloadFromToken = (accessToken: string) => {
	try {
		const jwtSecret = process.env.ACCESS_TOKEN_SIGN;
		if (!jwtSecret) {
			throw new Error('ACCESS_TOKEN_SIGN environment variable is required');
		}

		const results = userPayloadSchema.safeParse(jwt.verify(accessToken, jwtSecret));
		if (results.success) return results.data;
		throw new Error(results.error.message);
	} catch (error) {
		throw error;
	}
};

export const generateTokens = async (
	userId: string
): Promise<{ accessToken: string; session: SessionSelectType }> => {
	if (!userId) {
		throw new Error('generateTokens(): userId is required');
	}

	// Verify user exists in database before generating tokens
	const { getUserById } = await import('./db/queries/users');
	const user = await getUserById(userId);
	if (!user) {
		throw new Error('generateTokens(): User does not exist');
	}

	const session = await generateRefreshToken(userId);
	const accessToken = await generateAccessToken(userId);

	return {
		accessToken,
		session
	};
};

export const refreshTokens = async (
	refreshToken: string,
	cookies: Cookies
): Promise<UserSelectType> => {
	const session = await getSessionByRefreshToken(refreshToken);
	if (session === null) throw new Error('resfreshTokens(): session === null');
	const user = await getUserById(session.userId);
	if (user === null) throw new Error('resfreshTokens(): user === null');
	await resetUserTokens(session.userId, cookies);
	return user;
};

export const resetUserTokens = async (userId: string, cookies: Cookies): Promise<void> => {
	const { accessToken, session } = await generateTokens(userId);
	cookies.set('access_token', accessToken, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 60 * 15 // 15 minutes
	});

	cookies.set('refresh_token', session.refreshToken, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: session.expiresAt.getTime() - Date.now()
	});
};

export const isTokenExpired = (token: string): boolean => {
	try {
		const decodedToken = jwt.decode(token);
		if (decodedToken === null || typeof decodedToken === 'string') return true;
		const currentTime = Date.now() / 1000; // Convert to seconds
		const exp = decodedToken.exp;
		if (exp === undefined) return true;
		return exp < currentTime;
	} catch (error) {
		// Handle invalid token format or other decoding errors
		return true;
	}
};
