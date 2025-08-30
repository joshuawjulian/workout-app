import { form, query } from '$app/server';
import {
	movementsInsertSchema,
	movementsTable,
	movementsToMovementPatternsTable,
	movementsUpdateSchema
} from '$lib/schema/dict.schema';
import { db } from '$lib/server/db/conn';
import * as movementsQueries from '$lib/server/db/queries/movements';
import { getAllMovements } from '$lib/server/db/queries/movements';
import { upsertMovementSchema } from '$lib/server/db/services/movements';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export type MovementReturnType = ReturnType<typeof getAllMovements>;

export const allMovements = query(async () => {
	return await getAllMovements();
});

export const upsertMovement = form(async (data) => {
	console.log('upsertMovement form action');
	console.log(`Data received: ${JSON.stringify(data)}`);
	const dataMovement = {
		id: data.get('id'),
		name: data.get('name'),
		youtubeUrl: data.get('youtubeUrl'),
		parentMovementId: data.get('parentMovementId') === '' ? null : data.get('parentMovementId'),
		movementPatternIds: data.getAll('movementPatternIds')
	};

	const result = upsertMovementSchema.safeParse(dataMovement);

	if (!result.success) error(400, result.error.message);
	let movement = result.data;
	let { id, name, youtubeUrl, parentMovementId, movementPatternIds } = movement;
	await db.transaction(async (tx) => {
		if (id && typeof id === 'string') {
			await tx
				.update(movementsTable)
				.set({
					name,
					youtubeUrl,
					parentMovementId
				})
				.where(eq(movementsTable.id, id));
		} else {
			const [row] = await tx
				.insert(movementsTable)
				.values({
					name,
					youtubeUrl,
					parentMovementId
				})
				.returning({ insertedId: movementsTable.id });
			id = row.insertedId;
		}
		if (typeof id !== 'string') {
			throw error(500, 'Failed to insert movement');
		}

		const temp = movementPatternIds.map((movementPatternId) => ({
			movementId: id as string, //I cant figure out how we get here with it not being a string
			movementPatternId
		}));

		tx.insert(movementsToMovementPatternsTable).values(temp);
	});
});

export const createMovement = form(async (data) => {
	const name = data.get('name');
	const youtubeUrl = data.get('youtubeUrl');
	const parentMovementId = data.get('parentMovementId');
	const movementPatternIds = data.getAll('movementPatternIds');

	const result = movementsInsertSchema.safeParse({ name, youtubeUrl, parentMovementId });

	if (!result.success) error(400, result.error.message);
	const movement = result.data;
	const insertedMovement = await movementsQueries.insertMovement(
		movement,
		movementPatternIds as string[]
	);

	return {
		insertedMovement
	};
});

export const updateMovement = form(async (data) => {
	const id = data.get('id');
	const name = data.get('name');
	const youtubeUrl = data.get('youtubeUrl');
	const parentMovementId = data.get('parentMovementId');
	const movementPatternIds = data.getAll('movementPatternIds');

	const result = movementsUpdateSchema.safeParse({ id, name, youtubeUrl, parentMovementId });

	if (!result.success) error(400, result.error.message);
	const movement = result.data;
	const updatedMovement = await movementsQueries.updateMovement(
		movement,
		movementPatternIds as string[]
	);

	return {
		updatedMovement
	};
});

export const deleteMovement = form(async (data) => {
	const id = data.get('id');
	if (!id) error(400, 'Missing id');
	const deletedMovement = await movementsQueries.deleteMovement(id as string);

	return {
		deletedMovement
	};
});
