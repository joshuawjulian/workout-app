import { command, form, query } from '$app/server';
import {
	movementPatternsInsertSchema,
	movementPatternsTable,
	movementPatternsUpdateSchema
} from '$lib/schema/dict.schema';
import { db } from '$lib/server/db/conn';
import * as movementPatternsQueries from '$lib/server/db/queries/movementPatterns';
import { getAllMovementPatterns } from '$lib/server/db/queries/movementPatterns';
import { movementPatternSeeds } from '$lib/server/db/seed/movement-patterns';
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

export const deletePattern = form(async (data) => {
	const id = data.get('id');
	if (!id) error(400, 'Missing id');
	const deletedPattern = await movementPatternsQueries.deleteMovementPattern(id as string);

	return {
		deletedPattern
	};
});

export const seedMovementPatterns = command(async () => {
	const mps = await db.query.movementPatternsTable.findMany();
	let seeds = movementPatternSeeds;
	const filteredSeeds = seeds.filter((seed) => {
		return mps.findIndex((mp) => mp.name == seed.name) == -1;
	});
	if (filteredSeeds.length > 0) {
		await db.insert(movementPatternsTable).values(filteredSeeds);
		await allPatterns().refresh();
	}
});
