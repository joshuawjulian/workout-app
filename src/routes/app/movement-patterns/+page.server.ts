// src/routes/todos/+page.server.ts
import { getAllMovementPatterns } from '$lib/server/db/queries/movementPatterns.js';
import type { MovementPatternsSelectType } from '$lib/server/db/schema/dict.schema.js';
import type { PageServerLoad } from './$types';

// The load function from before...
export const load: PageServerLoad = async () => {
	const patterns: MovementPatternsSelectType[] = await getAllMovementPatterns();
	return { movementPatterns: patterns };
};
