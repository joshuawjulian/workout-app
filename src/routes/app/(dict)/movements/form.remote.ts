import { form, query } from '$app/server';
import { movementsInsertSchema, movementsUpdateSchema } from '$lib/schema/dict.schema';
import * as movementsQueries from '$lib/server/db/queries/movements';
import { getAllMovements } from '$lib/server/db/queries/movements';
import { error } from '@sveltejs/kit';

export const allMovements = query(async () => {
	return await getAllMovements();
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
