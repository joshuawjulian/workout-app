import { eq } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import {
	usersEmailConfirmed,
	websiteRolesTable,
	type WebsiteRolesSelectType
} from '../../../schema/auth.schema';
import { db } from '../conn';

export const insertWebsiteRole = async (
	userId: string,
	role: 'super' | 'admin' | 'user' = 'user',
	tx?: PgTransaction<any, any, any>
): Promise<WebsiteRolesSelectType> => {
	const dbInstance = tx || db;
	const [websiteRole] = await dbInstance
		.insert(websiteRolesTable)
		.values({ userId, role })
		.returning();

	return websiteRole;
};

export const getWebsiteRoleByUserId = async (
	userId: string
): Promise<WebsiteRolesSelectType | null> => {
	const [role] = await db
		.select()
		.from(websiteRolesTable)
		.where(eq(websiteRolesTable.userId, userId));

	return role || null;
};

export const insertEmailConfirmation = async (
	userId: string,
	confirmed: boolean = true,
	token?: string,
	tx?: PgTransaction<any, any, any>
): Promise<void> => {
	const dbInstance = tx || db;
	await dbInstance.insert(usersEmailConfirmed).values({
		userId,
		confirmed,
		token: token || crypto.randomUUID()
	});
};
