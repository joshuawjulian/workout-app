import { command, getRequestEvent, query } from '$app/server';
import type { RequestEvent } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { websiteRolesEnumSchema, websiteRolesTable } from './schema/auth.schema';
import { db } from './server/db/conn';
import { getAllUsers, getAllUsersWithRoles } from './server/db/services/users';

export const isLoggedIn = query(async () => {
	const { locals }: RequestEvent = getRequestEvent();
	return locals.user !== null;
});

export const getLoggedInEmail = query(async () => {
	const { locals } = getRequestEvent();
	console.log('getLoggedInEmail()' + JSON.stringify(locals));
	const user = locals.user;
	if (user === null) return 'null';
	return user?.email;
});

export const allUsersWithRoles = query(async () => {
	return await getAllUsersWithRoles();
});

export const allUsers = query(async () => {
	return await getAllUsers();
});

export const updateUserRole = command(
	z.object({ userId: z.uuid(), role: websiteRolesEnumSchema }),
	async ({ userId, role }) => {
		await db
			.update(websiteRolesTable)
			.set({ role: role })
			.where(eq(websiteRolesTable.userId, userId));
		await allUsersWithRoles().refresh();
	}
);
