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

/**
 * Table USERS
 */

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const rawUserSchema = z.object({
	id: z.uuid(),
	email: z.email(),
	password_hash: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date()
});

export const userSelectSchema = rawUserSchema.transform(
	({ password_hash, created_at, updated_at, ...rest }) => ({
		...rest,
		passwordHash: password_hash,
		createdAt: created_at,
		updatedAt: updated_at
	})
);

export type UserSelectType = z.infer<typeof userSelectSchema>;
export const userInsertSchema = rawUserSchema.partial({
	id: true,
	created_at: true,
	updated_at: true
});
export type UserInsertType = z.infer<typeof userInsertSchema>;

/**
 * TABLE users_email_confirmed
 */

export const usersEmailConfirmed = pgTable('users_email_confirmed', {
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	confirmed: boolean('confirmed').notNull().default(false),
	token: text('token'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const rawUserEmailConfirmedSchema = z.object({
	userId: z.uuid(),
	confirmed: z.boolean(),
	token: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date()
});

export const userEmailConfirmedSelectSchema = rawUserEmailConfirmedSchema.transform(
	({ created_at, updated_at, ...rest }) => ({
		...rest,
		createdAt: created_at,
		updatedAt: updated_at
	})
);

/**
 * TABLE sessions
 */

export const sessions = pgTable(
	'sessions',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id')
			.references(() => users.id)
			.notNull(),
		refreshToken: text('refresh_token').notNull(),
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

export const sessionSelectSchema = createSelectSchema(sessions);

export type SessionSelectType = z.infer<typeof sessionSelectSchema>;

export const sessionInsertSchema = createInsertSchema(sessions);

export type SessionInsertType = z.infer<typeof sessionInsertSchema>;
/**
 * Table: Website
 */

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
