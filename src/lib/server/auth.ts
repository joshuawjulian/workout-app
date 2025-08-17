import type { Cookies } from '@sveltejs/kit';
import * as argon2 from 'argon2';
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import z from 'zod';
import { websiteRolesEnumSchema, type SessionsSelectType } from './db/schema/auth.schema';
import { generateRefreshToken, getUserPayload } from './db/services/auth.services';

export const hashPassword = async (password: string): Promise<string> => {
	return await argon2.hash(password);
};

export const UserPayloadSchema = z.object({
	id: z.string(),
	websiteRole: websiteRolesEnumSchema
});

export type UserPayloadType = z.infer<typeof UserPayloadSchema>;

export const generateAccessToken = async (userId: string): Promise<string> => {
	const payload = await getUserPayload(userId);
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SIGN || '', {
		expiresIn: '15m',
		algorithm: 'HS256'
	});
};

export const generateTokens = async (
	userId: string
): Promise<{ accessToken: string; refreshToken: SessionsSelectType }> => {
	if (!userId) {
		throw new Error('generateTokens(): userId is required');
	}

	// check that userId exists in the database

	const refreshToken = await generateRefreshToken(userId);
	const accessToken = await generateAccessToken(userId);

	return {
		accessToken,
		refreshToken
	};
};

export const resetUserTokens = async (userId: string, cookies: Cookies): Promise<void> => {
	const { accessToken, refreshToken } = await generateTokens(userId);
	cookies.set('access_token', accessToken, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 60 * 15 // 15 minutes
	});

	cookies.set('refresh_token', refreshToken.resfreshToken, {
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: refreshToken.expiresAt.getTime() - Date.now()
	});
};
