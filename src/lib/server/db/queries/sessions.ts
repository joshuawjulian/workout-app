import { and, eq } from 'drizzle-orm';
import { db } from '../conn';
import { sessions, type SessionSelectType } from '../schema/auth.schema';

export const getSessionByRefreshToken = async (
	refreshToken: string
): Promise<SessionSelectType | null> => {
	const [session] = await db
		.select()
		.from(sessions)
		.where(and(eq(sessions.refreshToken, refreshToken), eq(sessions.valid, true)))
		.limit(1);

	return session || null;
};

export const insertSession = async (
	userId: string,
	refreshToken: string,
	valid: boolean = true
): Promise<SessionSelectType> => {
	const [session] = await db.insert(sessions).values({ userId, refreshToken, valid }).returning();

	return session;
};

export const invalidateRefreshToken = async (refreshToken: string): Promise<number> => {
	const result = await db
		.update(sessions)
		.set({ valid: false })
		.where(and(eq(sessions.refreshToken, refreshToken), eq(sessions.valid, true)))
		.returning({ id: sessions.id });

	return result.length;
};

export const invalidateAllRefreshTokens = async (userId: string): Promise<number> => {
	const result = await db
		.update(sessions)
		.set({ valid: false })
		.where(eq(sessions.userId, userId))
		.returning({ id: sessions.id });

	return result.length;
};
