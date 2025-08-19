import { eq } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import { db } from '../conn';
import {
	usersEmailConfirmed,
	websiteRoles,
	type WebsiteRolesSelectType
} from '../schema/auth.schema';

export const insertWebsiteRole = async (
	userId: string,
	role: 'super' | 'admin' | 'user' = 'user',
	tx?: PgTransaction<any, any, any>
): Promise<WebsiteRolesSelectType> => {
	const dbInstance = tx || db;
	const [websiteRole] = await dbInstance.insert(websiteRoles).values({ userId, role }).returning();

	return websiteRole;
};

export const getWebsiteRoleByUserId = async (
	userId: string
): Promise<WebsiteRolesSelectType | null> => {
	const [role] = await db.select().from(websiteRoles).where(eq(websiteRoles.userId, userId));

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
