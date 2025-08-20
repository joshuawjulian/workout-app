import { db } from '$lib/server/db/conn';
import { eq } from 'drizzle-orm';
import {
	movementPatternsTable,
	type MovementPatternsInsertType,
	type MovementPatternsSelectType,
	type MovementPatternsUpdateType
} from '../schema/dict.schema';

export const getAllMovementPatterns = async (): Promise<MovementPatternsSelectType[]> => {
	const movementPatterns: MovementPatternsSelectType[] = await db
		.select()
		.from(movementPatternsTable);

	return movementPatterns;
};

export const insertMovementPattern = async (
	pattern: MovementPatternsInsertType
): Promise<MovementPatternsSelectType> => {
	const [insertedPattern] = await db.insert(movementPatternsTable).values(pattern).returning();

	return insertedPattern;
};

export const updateMovementPattern = async (
	pattern: MovementPatternsUpdateType
): Promise<MovementPatternsSelectType> => {
	if (!pattern.id) {
		throw new Error('ID is required to update a movement pattern');
	}
	const [updatedPattern] = await db
		.update(movementPatternsTable)
		.set(pattern)
		.where(eq(movementPatternsTable.id, pattern.id))
		.returning();

	return updatedPattern;
};

export const deleteMovementPattern = async (id: string): Promise<MovementPatternsSelectType> => {
	const [deletedPattern] = await db
		.delete(movementPatternsTable)
		.where(eq(movementPatternsTable.id, id))
		.returning();
	return deletedPattern;
};
