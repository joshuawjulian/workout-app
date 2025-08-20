import { db } from '$lib/server/db/conn';
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
	const [updatedPattern] = await db.update(movementPatternsTable).set(pattern);

	return updatedPattern;
};
