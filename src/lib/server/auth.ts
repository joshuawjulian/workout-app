import { type Cookies } from '@sveltejs/kit';
import * as argon2 from 'argon2';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import z from 'zod';
import { type SessionSelectType } from './db/schema/auth.schema';
import { generateRefreshToken, getUserPayload } from './db/services/auth';

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
		expiresIn: '15m',
		algorithm: 'HS256'
	});
};

export const getUserPayloadFromToken = (accessToken: string) => {
	try {
		const jwtSecret = process.env.ACCESS_TOKEN_SIGN;
		if (!jwtSecret) {
			throw new Error('ACCESS_TOKEN_SIGN environment variable is required');
		}
		
		const results = userPayloadSchema.safeParse(
			jwt.verify(accessToken, jwtSecret)
		);
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
