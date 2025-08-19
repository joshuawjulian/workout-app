import { db } from '../conn';
import { eq } from 'drizzle-orm';
import { users, type UserSelectType } from '../schema/auth.schema';
import type { PgTransaction } from 'drizzle-orm/pg-core';

export const insertUser = async (
	email: string,
	passwordHash: string,
	tx?: PgTransaction<any, any, any>
): Promise<UserSelectType> => {
	const dbInstance = tx || db;
	const [user] = await dbInstance
		.insert(users)
		.values({ email, passwordHash })
		.returning();
		
	return user;
};

export const getUserById = async (userId: string): Promise<UserSelectType | null> => {
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);
		
	return user || null;
};

export const getUserByEmail = async (email: string): Promise<UserSelectType | null> => {
	const [user] = await db
		.select()
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	return user || null;
};

export const getAllUsers = async (): Promise<UserSelectType[]> => {
	return await db.select().from(users);
};