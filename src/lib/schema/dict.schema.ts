import { relations } from 'drizzle-orm';
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
	name: varchar('name', { length: 256 }).notNull(),
	youtubeUrl: varchar('youtube_url', { length: 512 }),
	parentMovementId: uuid('parent_movement_id')
});

export const movementsToMovementPatternsTable = pgTable('movements_to_movement_patterns', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	movementId: uuid('movement_id')
		.notNull()
		.references(() => movementsTable.id),
	movementPatternId: uuid('movement_pattern_id')
		.notNull()
		.references(() => movementPatternsTable.id)
});

export const movementsRelations = relations(movementsTable, ({ one, many }) => ({
	parentMovement: one(movementsTable, {
		fields: [movementsTable.parentMovementId],
		references: [movementsTable.id],
		relationName: 'parentMovement'
	}),
	childrenMovements: many(movementsTable, {
		relationName: 'parentMovement'
	}),
	movementsToMovementPatterns: many(movementsToMovementPatternsTable),
	equipmentToMovements: many(equipmentToMovementsTable)
}));

export const movementPatternsRelations = relations(movementPatternsTable, ({ many }) => ({
	movementsToMovementPatterns: many(movementsToMovementPatternsTable)
}));

export const movementsToMovementPatternsRelations = relations(
	movementsToMovementPatternsTable,
	({ one }) => ({
		movement: one(movementsTable, {
			fields: [movementsToMovementPatternsTable.movementId],
			references: [movementsTable.id]
		}),
		movementPattern: one(movementPatternsTable, {
			fields: [movementsToMovementPatternsTable.movementPatternId],
			references: [movementPatternsTable.id]
		})
	})
);

export const movementsSelectSchema = createSelectSchema(movementsTable);
export type MovementsSelectType = z.infer<typeof movementsSelectSchema>;
export const movementsInsertSchema = createInsertSchema(movementsTable, {
	youtubeUrl: z.string().url()
});
export type MovementsInsertType = z.infer<typeof movementsInsertSchema>;
export const movementsUpdateSchema = createUpdateSchema(movementsTable);
export type MovementsUpdateType = z.infer<typeof movementsUpdateSchema>;

export const equipmentTable = pgTable('equipment', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 256 }).notNull()
});

export const equipmentRelations = relations(equipmentTable, ({ many }) => ({
	equipmentToMovements: many(equipmentToMovementsTable)
}));

export const equipmentToMovementsTable = pgTable('equipment_to_movements', {
	id: uuid('id').notNull().primaryKey().defaultRandom(),
	equipmentId: uuid('equipment_id')
		.notNull()
		.references(() => equipmentTable.id),
	movementId: uuid('movement_id')
		.notNull()
		.references(() => movementsTable.id)
});

export const equipmentToMovementsRelations = relations(equipmentToMovementsTable, ({ one }) => ({
	movement: one(movementsTable, {
		fields: [equipmentToMovementsTable.movementId],
		references: [movementsTable.id]
	}),
	equipment: one(equipmentTable, {
		fields: [equipmentToMovementsTable.equipmentId],
		references: [equipmentTable.id]
	})
}));
