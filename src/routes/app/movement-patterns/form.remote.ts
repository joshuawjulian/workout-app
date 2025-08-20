import { form, query } from '$app/server';
import * as movementPatternsQueries from '$lib/server/db/queries/movementPatterns';
import { getAllMovementPatterns } from '$lib/server/db/queries/movementPatterns';
import {
	movementPatternsInsertSchema,
	movementPatternsUpdateSchema
} from '$lib/server/db/schema/dict.schema';
import { error } from '@sveltejs/kit';

export const allPatterns = query(async () => {
	return await getAllMovementPatterns();
});

export const createPattern = form(async (data) => {
	const name = data.get('name');
	const description = data.get('description');
	const result = movementPatternsInsertSchema.safeParse({ name, description });

	if (!result.success) error(400, result.error.message);
	const pattern = result.data;
	const insertedPattern = await movementPatternsQueries.insertMovementPattern(pattern);

	return {
		insertedPattern
	};
});

export const updatePattern = form(async (data) => {
	const id = data.get('id');
	const name = data.get('name');
	const description = data.get('description');
	const result = movementPatternsUpdateSchema.safeParse({ id, name, description });

	if (!result.success) error(400, result.error.message);
	const pattern = result.data;
	const updatedPattern = await movementPatternsQueries.updateMovementPattern(pattern);

	return {
		updatedPattern
	};
});
