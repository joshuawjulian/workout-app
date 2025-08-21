import { relations, sql } from 'drizzle-orm';
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

export const usersTable = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: text('email').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const userSelectSchema = createSelectSchema(usersTable);
export type UserSelectType = z.infer<typeof userSelectSchema>;
export const userInsertSchema = createInsertSchema(usersTable);
export type UserInsertType = z.infer<typeof userInsertSchema>;

export const userRelations = relations(usersTable, ({ one, many }) => ({
	userWebsiteRole: one(websiteRolesTable, {
		fields: [usersTable.id],
		references: [websiteRolesTable.userId],
		relationName: 'user_website_role'
	}),
	user_email_confirmed: one(usersEmailConfirmedTable, {
		fields: [usersTable.id],
		references: [usersEmailConfirmedTable.userId],
		relationName: 'users_email_confirmed'
	})
}));

/**
 * TABLE users_email_confirmed
 */

export const usersEmailConfirmedTable = pgTable('users_email_confirmed', {
	userId: uuid('user_id')
		.notNull()
		.references(() => usersTable.id),
	confirmed: boolean('confirmed').notNull().default(false),
	token: text('token'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const usersEmailConfirmedSelectSchema = createSelectSchema(usersEmailConfirmedTable);
export type UsersEmailConfirmedSelectType = z.infer<typeof usersEmailConfirmedSelectSchema>;
export const usersEmailConfirmedInsertSchema = createInsertSchema(usersEmailConfirmedTable);
export type UsersEmailConfirmedInsertType = z.infer<typeof usersEmailConfirmedInsertSchema>;

export const usersEmailConfirmedRelations = relations(usersEmailConfirmedTable, ({ one }) => ({
	user_email_confirmed: one(usersTable, {
		fields: [usersEmailConfirmedTable.userId],
		references: [usersTable.id],
		relationName: 'users_email_confirmed'
	})
}));

/**
 * TABLE sessions
 */

export const sessionsTable = pgTable(
	'sessions',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		userId: uuid('user_id')
			.references(() => usersTable.id)
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

export const sessionSelectSchema = createSelectSchema(sessionsTable);
export type SessionSelectType = z.infer<typeof sessionSelectSchema>;
export const sessionInsertSchema = createInsertSchema(sessionsTable);
export type SessionInsertType = z.infer<typeof sessionInsertSchema>;

export const websiteRolesEnum = pgEnum('website_roles_enum', ['super', 'admin', 'user']);
export const websiteRolesEnumSchema = z.enum(websiteRolesEnum.enumValues);
export type WebsiteRolesEnumType = z.infer<typeof websiteRolesEnumSchema>;

export const websiteRolesTable = pgTable(
	'website_roles',
	{
		userId: uuid('user_id')
			.notNull()
			.references(() => usersTable.id),
		role: websiteRolesEnum().notNull().default('user'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(t) => [primaryKey({ name: 'pk_website_roles', columns: [t.userId, t.role] })]
);

export const websiteRolesSelectSchema = createSelectSchema(websiteRolesTable);
export type WebsiteRolesSelectType = z.infer<typeof websiteRolesSelectSchema>;

export const websiteRolesRelations = relations(websiteRolesTable, ({ one, many }) => ({
	userWebsiteRole: one(usersTable, {
		fields: [websiteRolesTable.userId],
		references: [usersTable.id],
		relationName: 'user_website_role'
	})
}));
