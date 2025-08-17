import { sql } from 'drizzle-orm';
import {
	boolean,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	uuid
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const userSelectSchema = createSelectSchema(users);
export type UserSelectType = z.infer<typeof userSelectSchema>;
export const userInsertSchema = createInsertSchema(users);
export type UserInsertType = z.infer<typeof userInsertSchema>;

export const usersEmailConfirmed = pgTable('users_email_confirmed', {
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	confirmed: boolean('confirmed').notNull().default(false),
	token: text('token'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const sessions = pgTable(
	'sessions',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id')
			.references(() => users.id)
			.notNull(),
		resfreshToken: text('refresh_token').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		expiresAt: timestamp('expires_at', { withTimezone: true })
			.notNull()
			.default(sql`now() + interval '30 days'`),
		valid: boolean('valid').default(true).notNull()
	},
	(t) => [
		uniqueIndex('one_active_token_per_user')
			.on(t.userId)
			.where(sql`${t.valid} = true`)
	]
);

export const sessionsSelectSchema = createSelectSchema(sessions);
export type SessionsSelectType = z.infer<typeof sessionsSelectSchema>;

export const websiteRolesEnum = pgEnum('website_roles_enum', ['super', 'admin', 'user']);

export const websiteRolesEnumSchema = z.enum(websiteRolesEnum.enumValues);

export type WebsiteRolesEnumType = z.infer<typeof websiteRolesEnumSchema>;

export const websiteRoles = pgTable(
	'website_roles',
	{
		userId: uuid('user_id').references(() => users.id),
		role: websiteRolesEnum().notNull().default('user'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(t) => [primaryKey({ name: 'pk_website_roles', columns: [t.userId, t.role] })]
);

export const websiteRolesSelectSchema = createSelectSchema(websiteRoles);
export type WebsiteRolesSelectType = z.infer<typeof websiteRolesSelectSchema>;
