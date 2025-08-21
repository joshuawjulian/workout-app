import { eq } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import { usersTable, type UserSelectType } from '../../../schema/auth.schema';
import { db } from '../conn';

export const insertUser = async (
	email: string,
	passwordHash: string,
	tx?: PgTransaction<any, any, any>
): Promise<UserSelectType> => {
	const dbInstance = tx || db;
	const [user] = await dbInstance.insert(usersTable).values({ email, passwordHash }).returning();

	return user;
};

export const getUserById = async (userId: string): Promise<UserSelectType | null> => {
	const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

	return user || null;
};

export const getUserByEmail = async (email: string): Promise<UserSelectType | null> => {
	const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

	return user || null;
};

export const getAllUsers = async (): Promise<UserSelectType[]> => {
	const result = await db.select().from(usersTable);
	return result;
};
