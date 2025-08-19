import { and, eq } from 'drizzle-orm';
import { db } from '../conn';
import { sessionsTable, type SessionSelectType } from '../schema/auth.schema';

export const getSessionByRefreshToken = async (
	refreshToken: string
): Promise<SessionSelectType | null> => {
	const [session] = await db
		.select()
		.from(sessionsTable)
		.where(and(eq(sessionsTable.refreshToken, refreshToken), eq(sessionsTable.valid, true)))
		.limit(1);

	return session || null;
};

export const insertSession = async (
	userId: string,
	refreshToken: string,
	valid: boolean = true
): Promise<SessionSelectType> => {
	const [session] = await db
		.insert(sessionsTable)
		.values({ userId, refreshToken, valid })
		.returning();

	return session;
};

export const invalidateRefreshToken = async (refreshToken: string): Promise<number> => {
	const result = await db
		.update(sessionsTable)
		.set({ valid: false })
		.where(and(eq(sessionsTable.refreshToken, refreshToken), eq(sessionsTable.valid, true)))
		.returning({ id: sessionsTable.id });

	return result.length;
};

export const invalidateAllRefreshTokens = async (userId: string): Promise<number> => {
	const result = await db
		.update(sessionsTable)
		.set({ valid: false })
		.where(eq(sessionsTable.userId, userId))
		.returning({ id: sessionsTable.id });

	return result.length;
};
