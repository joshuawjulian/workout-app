import { db } from '$lib/server/db/conn';
import { eq } from 'drizzle-orm';
import {
	movementsTable,
	movementsToMovementPatternsTable,
	type MovementsInsertType,
	type MovementsSelectType,
	type MovementsUpdateType
} from '../../../schema/dict.schema';

export const getAllMovements = async () => {
	const movements = await db.query.movementsTable.findMany({
		with: {
			parentMovement: true,
			movementsToMovementPatterns: {
				with: {
					movementPattern: true
				}
			}
		}
	});

	// const mp = await db.query.movementPatternsTable.findMany();

	// const randomMovementId =
	// 	movements.length > 0 ? movements[Math.floor(Math.random() * movements.length)].id : null;

	// const randomMovementPatternId =
	// 	mp.length > 0 ? mp[Math.floor(Math.random() * mp.length)].id : null;

	// console.log(randomMovementId, ' ', randomMovementPatternId);
	// // add to movementsToMovementPatternsTable
	// if (randomMovementId && randomMovementPatternId) {
	// 	await db.insert(movementsToMovementPatternsTable).values({
	// 		movementId: randomMovementId,
	// 		movementPatternId: randomMovementPatternId
	// 	});
	// }

	// const m2mp = await db.query.movementsToMovementPatternsTable.findMany({});
	// console.log('m2mp', m2mp);

	return movements;
};

export const insertMovement = async (
	movement: MovementsInsertType,
	movementPatternIds: string[]
): Promise<MovementsSelectType> => {
	const [insertedMovement] = await db.insert(movementsTable).values(movement).returning();

	if (movementPatternIds.length > 0) {
		await db.insert(movementsToMovementPatternsTable).values(
			movementPatternIds.map((movementPatternId) => ({
				movementId: insertedMovement.id,
				movementPatternId
			}))
		);
	}

	return insertedMovement;
};

export const updateMovement = async (
	movement: MovementsUpdateType,
	movementPatternIds: string[]
): Promise<MovementsSelectType> => {
	if (!movement.id) {
		throw new Error('ID is required to update a movement');
	}

	const [updatedMovement] = await db
		.update(movementsTable)
		.set(movement)
		.where(eq(movementsTable.id, movement.id))
		.returning();

	await db
		.delete(movementsToMovementPatternsTable)
		.where(eq(movementsToMovementPatternsTable.movementId, movement.id));

	if (movementPatternIds.length > 0) {
		await db.insert(movementsToMovementPatternsTable).values(
			movementPatternIds.map((movementPatternId) => ({
				movementId: movement.id as string,
				movementPatternId
			}))
		);
	}

	return updatedMovement;
};

export const deleteMovement = async (id: string): Promise<MovementsSelectType> => {
	await db
		.delete(movementsToMovementPatternsTable)
		.where(eq(movementsToMovementPatternsTable.movementId, id));

	const [deletedMovement] = await db
		.delete(movementsTable)
		.where(eq(movementsTable.id, id))
		.returning();

	return deletedMovement;
};
