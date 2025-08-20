import { pgTable, text, uuid, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { z } from 'zod';

export const movementPatternsTable = pgTable('movement_patterns', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name').notNull(),
	description: text('description').notNull()
});

export const movementPatternsSelectSchema = createSelectSchema(movementPatternsTable);
export type MovementPatternsSelectType = z.infer<typeof movementPatternsSelectSchema>;
export const movementPatternsInsertSchema = createInsertSchema(movementPatternsTable);
export type MovementPatternsInsertType = z.infer<typeof movementPatternsInsertSchema>;
export const movementPatternsUpdateSchema = createUpdateSchema(movementPatternsTable);
export type MovementPatternsUpdateType = z.infer<typeof movementPatternsUpdateSchema>;

export const movementsTable = pgTable('movements', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name').notNull()
});

export const movementsSelectSchema = createSelectSchema(movementsTable);
export type MovementsSelectType = z.infer<typeof movementsSelectSchema>;
export const movementsInsertSchema = createInsertSchema(movementsTable);
export type MovementsInsertType = z.infer<typeof movementsInsertSchema>;
