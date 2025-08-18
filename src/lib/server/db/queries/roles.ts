import { db } from '../conn';
import { eq } from 'drizzle-orm';
import { websiteRoles, usersEmailConfirmed, type WebsiteRolesSelectType } from '../schema/auth.schema';

export const insertWebsiteRole = async (
	userId: string, 
	role: 'super' | 'admin' | 'user' = 'user'
): Promise<WebsiteRolesSelectType> => {
	const [websiteRole] = await db
		.insert(websiteRoles)
		.values({ userId, role })
		.returning();
		
	return websiteRole;
};

export const getWebsiteRoleByUserId = async (userId: string): Promise<WebsiteRolesSelectType | null> => {
	const [role] = await db
		.select()
		.from(websiteRoles)
		.where(eq(websiteRoles.userId, userId));
		
	return role || null;
};

export const insertEmailConfirmation = async (
	userId: string,
	confirmed: boolean = true,
	token?: string
): Promise<void> => {
	await db
		.insert(usersEmailConfirmed)
		.values({ 
			userId, 
			confirmed, 
			token: token || crypto.randomUUID() 
		});
};