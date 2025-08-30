import {
	movementsTable,
	movementsToMovementPatternsTable,
	type MovementsSelectType
} from '$lib/schema/dict.schema';
import z from 'zod';
import { db } from '../conn';

export const movementFullInsertSchema = z.object({
	name: z.string().min(2).max(100),
	youtubeUrl: z.url().optional(),
	parentMovementId: z.uuid().optional(),
	repetitionCriteria: z.string().min(2).max(10000).optional(),
	movementPatternIds: z.array(z.uuid()).min(1).max(10)
});

export type MovementFullInsertType = z.infer<typeof movementFullInsertSchema>;

export async function insertMovementWithPatterns(data: MovementFullInsertType) {
	// as a transaction
	try {
		await db.transaction(async (tx) => {
			// Insert the movement into the database
			const [movement]: MovementsSelectType[] = await tx
				.insert(movementsTable)
				.values(data)
				.returning();

			// Insert the movement patterns
			for (const patternId of data.movementPatternIds) {
				await tx.insert(movementsToMovementPatternsTable).values({
					movementId: movement.id,
					movementPatternId: patternId
				});
			}
			return movement;
		});
	} catch (err) {
		console.error(err);
		throw err;
	}
}

export const upsertMovementSchema = z.object({
	id: z.uuid().optional().nullable(),
	name: z.string().min(2).max(100),
	youtubeUrl: z.url().optional(),
	parentMovementId: z.uuid().optional().nullable(),
	movementPatternIds: z.array(z.uuid())
});

export type UpsertMovementType = z.infer<typeof upsertMovementSchema>;
